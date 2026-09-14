# Cahier de Charges — Typing Tower Defense (TTD)

## 0. Résumé du projet

Un jeu de type "tower defense" où les ennemis sont des mots qui avancent vers une base centrale. Le joueur les détruit en les tapant correctement. La difficulté s'adapte en temps réel à la vitesse de frappe (WPM) du joueur. Projet double usage :
- **Application standalone** (jeu complet, déployé indépendamment)
- **Widget intégré au portfolio** (version simplifiée, showcase)

Le projet inclut un backend simple permettant inscription/connexion, historique des parties, classement (leaderboard) et un dashboard personnel.

---

## 1. Objectifs

- Démontrer une maîtrise du temps réel / performance front-end (rendu 60fps, latence d'input minimale)
- Fournir une expérience de jeu originale (pas un clone Monkeytype classique)
- Fournir un backend simple mais complet (auth, persistance, classement)
- Être réutilisable comme pièce de portfolio ET comme produit autonome

---

## 2. Architecture générale

```
┌─────────────────────┐        ┌──────────────────────┐
│   Frontend Jeu       │──HTTP──▶│   Backend API         │
│   (Vite + TS/Canvas) │◀───────│   (Auth, Scores, Stats)│
└─────────────────────┘        └──────────────────────┘
          ▲
          │ iframe / lien
┌─────────────────────┐
│  Portfolio (Next.js) │
└─────────────────────┘
```

**Pourquoi Vite (jeu) + Next.js (portfolio) séparés :**
Le jeu est une application temps réel côté client pur (canvas, boucle de rendu, aucun besoin de SSR/SEO). Next.js apporte du rendu serveur, du routing multi-pages et du SEO — utile pour le portfolio, inutile (et coûteux en overhead) pour une boucle de jeu. Séparer les deux permet de déployer, versionner et réutiliser le jeu indépendamment (ex: le soumettre à un showcase de jeux) sans alourdir le portfolio, et si besoin le portfolio peut aussi être une simple iframe/lien vers le jeu déployé séparément.

---

## 3. Modules fonctionnels — Frontend (Jeu)

### 3.1 Game Engine Core
- Boucle de jeu (fixed timestep + rendu interpolé via `requestAnimationFrame`)
- Système d'entités : chaque mot-ennemi = `{id, text, x, y, speed, charIndex, hp, spawnTime}`
- Détection d'impact (mot atteint la base)
- Gestionnaire de vagues (spawn de groupes de mots selon un timer/pattern)

### 3.2 Typing Engine
- Un seul listener global `keydown` (pas de multiples inputs) qui dispatch vers la "cible active"
- Auto-ciblage : verrouille automatiquement le mot le plus proche/ancien correspondant à la touche pressée, ou ciblage manuel au clic
- Validation caractère par caractère par rapport au mot ciblé
- Gestion des fautes de frappe (configurable : bloque l'avancée vs. pénalité et continue)
- Complétion du mot → animation de destruction + score

### 3.3 Système de difficulté adaptative
- Calcul de WPM glissant (fenêtre de 5–10s, pas une moyenne globale, pour réagir à la performance actuelle)
- Paramètres pilotés par le WPM : taux de spawn, longueur/complexité des mots, vitesse des ennemis, nombre de mots simultanés
- Fonction de lissage (éviter des pics de difficulté brusques après une rafale ponctuelle)

### 3.4 Système de vagues (Waves)
- Définitions de vagues en config (JSON) : pool de mots, pattern de spawn (rafale, goutte-à-goutte, multi-directions), durée
- Pools de mots : mots communs, mots-clés de programmation (différenciateur lié à ton profil dev), paliers de longueur croissante
- Vagues "boss" (optionnel, phase avancée) : groupe de mots formant une phrase longue avec plus de "HP" (plusieurs frappes nécessaires)

### 3.5 Rendu (Rendering)
- **Canvas 2D** pour le champ de jeu (pas WebGL — inutile à cette échelle 2D)
- Overlay HTML/React léger uniquement pour le HUD statique (score, WPM, barre de vie) qui se met à jour moins fréquemment
- Effets de feedback légers (pas de moteur physique) : particules à la destruction, "hit-stop"/tremblement d'écran léger à la prise de dégâts

### 3.6 Score & Statistiques
- Score = fonction de (longueur du mot, WPM au moment du kill, streak de précision)
- HUD en direct : WPM, précision %, combo, numéro de vague, HP de la base
- Écran de fin de partie : graphique WPM dans le temps, heatmap des erreurs, mots/min par vague

### 3.7 Audio (optionnel, faible coût)
- Son de frappe, feedback correct/incorrect, son de destruction, jingle de fin de vague
- Web Audio API directement (éviter une librairie lourde) pour une latence quasi nulle

### 3.8 Mode Widget Portfolio
- Version réduite (viewport plus petit, UI simplifiée)
- Lien "jouer à la version complète" vers l'app standalone

---

## 4. Modules fonctionnels — Backend

Objectif : rester **simple mais complet**. Pas de sur-ingénierie — un CRUD propre + auth + un peu d'agrégation suffit.

### 4.1 Authentification
- Inscription (email + mot de passe, hashé avec bcrypt/argon2)
- Connexion (JWT access token + refresh token, ou session simple selon préférence)
- Route "me" pour récupérer le profil connecté
- (Optionnel simple) Connexion invité — jouer sans compte, score non sauvegardé sur le classement global

### 4.2 Historique des parties
- Chaque partie terminée envoie un résumé au backend : `{userId, score, maxWpm, avgWpm, accuracy, wavesReached, duration, playedAt}`
- Endpoint pour lister l'historique d'un utilisateur (paginé)

### 4.3 Leaderboard
- Classement global (top N par score, ou par meilleur WPM)
- Filtres simples : top du jour / de la semaine / all-time (facile à faire avec juste une requête filtrée par date, pas besoin d'un job de reset)
- Endpoint public en lecture (pas besoin d'auth pour consulter)

### 4.4 Dashboard utilisateur
- Statistiques agrégées : meilleur score, meilleur WPM, précision moyenne, nombre de parties jouées, progression dans le temps (graphique simple à partir de l'historique déjà stocké — pas de table séparée nécessaire)
- Rang actuel de l'utilisateur dans le classement global

### 4.5 Petits ajouts simples à forte valeur (sans complexifier)
- **Rate limiting basique** sur les routes d'auth (protection anti brute-force, une lib comme `express-rate-limit` suffit)
- **Validation des scores côté serveur** : rejeter un score si le WPM/accuracy dépassent des seuils physiquement improbables (anti-triche basique sans système complexe)
- **Endpoint santé** (`/health`) pour le monitoring de déploiement

Ce qu'on évite volontairement (hors scope pour rester simple) : système d'amis, chat, notifications, achievements complexes, OAuth multi-providers — tout ça peut être ajouté plus tard si le projet grandit.

---

## 5. Modèle de données (simplifié)

```
User
├── id
├── email (unique)
├── passwordHash
├── username
└── createdAt

GameSession
├── id
├── userId (FK)
├── score
├── maxWpm
├── avgWpm
├── accuracy
├── wavesReached
├── duration
└── playedAt
```

Le leaderboard et le dashboard sont tous deux dérivés de `GameSession` par agrégation (`ORDER BY score DESC`, `GROUP BY userId`, etc.) — pas besoin de tables supplémentaires.

---

## 6. Exigences non-fonctionnelles (performance)

| Exigence | Cible | Approche |
|---|---|---|
| Latence d'input | <16ms (1 frame @60fps) | Aucun état React par frappe ; mises à jour impératives Canvas |
| Frame rate | 60fps stable avec 20+ mots simultanés | Object pooling pour les entités-mots (réutilisation, pas de recréation) |
| Coût de re-render | Zéro re-render React dans le chemin critique | État du jeu hors React (contrôleur JS/classe séparée) ; React ne monte le container qu'une fois |
| Mémoire | Pas de fuite en session longue | Nettoyage des listeners, `cancelAnimationFrame` au démontage |
| Backend | Réponses <100ms sur les routes lues fréquemment (leaderboard) | Index DB sur `score` et `userId`, pagination systématique |

---

## 7. Stack technique

**Frontend Jeu**
- React + TypeScript (coquille/HUD uniquement) + moteur Canvas 2D en vanilla TS
- Machine à états légère et personnalisée (menu → jeu → pause → game over)
- Build : Vite

**Portfolio**
- Next.js (existant), intégration du jeu via iframe ou lien(don't codet he portfolio i have it tell me only how to do it )

**Backend**
- nest js+ PostgreSQL 
- JWT pour l'auth
- ORM : Prisma (si NestJS)

**Déploiement**
- Jeu : Vercel/Netlify
- Backend : Railway/Render/Fly.io (bases gratuites suffisantes pour un projet portfolio)

---

## 8. Structure de projet suggérée

```
typing-tower-defense/
├── frontend/
│   ├── src/
│   │   ├── engine/
│   │   │   ├── GameLoop.ts
│   │   │   ├── WordEntity.ts
│   │   │   ├── SpawnManager.ts
│   │   │   ├── DifficultyController.ts
│   │   │   └── TypingController.ts
│   │   ├── render/
│   │   │   └── CanvasRenderer.ts
│   │   ├── audio/
│   │   │   └── SoundManager.ts
│   │   ├── data/
│   │   │   └── wordPools.json
│   │   ├── api/
│   │   │   └── client.ts   (appels au backend : auth, sessions, leaderboard)
│   │   ├── ui/  (HUD, MainMenu, Login, GameOverScreen, Dashboard)
│   │   └── App.tsx
└── backend/
    ├── src/
    │   ├── auth/        (signup, login, jwt)
    │   ├── users/
    │   ├── sessions/    (historique de parties)
    │   ├── leaderboard/
    │   └── main.ts
    └── prisma/schema.prisma (ou models SQLAlchemy)
```

---

## 9. Ordre de construction recommandé (Milestones)

1. Boucle Canvas + rendu statique d'un mot
2. Détection de frappe → destruction d'un seul mot à complétion correcte
3. Spawn de plusieurs mots + mouvement vers la base
4. HP de la base + état "game over"
5. Calcul du WPM + branchement de la difficulté adaptative
6. HUD overlay (React) qui lit l'état du moteur via observer/subscription
7. Polish : particules, son, tremblement d'écran
8. Système de vagues + paliers de pools de mots (mode "mots-clés de code" en différenciateur)
9. Écran de statistiques de fin de partie
10. **Backend** : setup auth (signup/login) + modèle GameSession
11. Connexion frontend ↔ backend : sauvegarde de session en fin de partie
12. Leaderboard (endpoint + UI)
13. Dashboard utilisateur (agrégations + graphique de progression)
14. Mode widget portfolio + lien vers version complète

---

## 10. Prochaines étapes possibles

- Scaffolding du moteur de jeu (milestones 1–2) en code de démarrage
- Scaffolding du backend (auth + modèle de données) en code de démarrage