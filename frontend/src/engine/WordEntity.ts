// ═══════════════════════════════════════════════════════════
// WordEntity — Object-pooled word entity manager
// ═══════════════════════════════════════════════════════════

import { WordEntity, WordCategory } from '../types';

const POOL_SIZE = 100;

export class WordEntityPool {
  private pool: WordEntity[] = [];
  private nextId = 0;

  constructor() {
    // Pre-allocate pool
    for (let i = 0; i < POOL_SIZE; i++) {
      this.pool.push(this.createEmpty());
    }
  }

  private createEmpty(): WordEntity {
    return {
      id: -1,
      text: '',
      x: 0,
      y: 0,
      speed: 0,
      charIndex: 0,
      hp: 1,
      maxHp: 1,
      spawnTime: 0,
      isTargeted: false,
      angle: 0,
      distance: 0,
      category: WordCategory.COMMON,
      active: false,
      opacity: 0,
      color: undefined,
    };
  }

  /**
   * Acquire a word entity from the pool
   */
  spawn(
    text: string,
    angle: number,
    distance: number,
    speed: number,
    category: WordCategory = WordCategory.COMMON,
    centerX: number,
    centerY: number,
  ): WordEntity | null {
    // Find an inactive entity in the pool
    let entity = this.pool.find((e) => !e.active);

    if (!entity) {
      // Expand pool if needed
      entity = this.createEmpty();
      this.pool.push(entity);
    }

    // Initialize the entity
    entity.id = this.nextId++;
    entity.text = text;
    entity.angle = angle;
    entity.distance = distance;
    entity.speed = speed;
    entity.charIndex = 0;
    entity.hp = category === WordCategory.BOSS ? text.length : 1;
    entity.maxHp = entity.hp;
    entity.spawnTime = performance.now();
    entity.isTargeted = false;
    entity.category = category;
    entity.active = true;
    entity.opacity = 0; // fade in
    entity.color = undefined;

    // Calculate position from angle and distance
    entity.x = centerX + Math.cos(angle) * distance;
    entity.y = centerY + Math.sin(angle) * distance;

    return entity;
  }

  /**
   * Release a word entity back to the pool
   */
  release(entity: WordEntity): void {
    entity.active = false;
    entity.isTargeted = false;
    entity.text = '';
  }

  /**
   * Get all active entities
   */
  getActive(): WordEntity[] {
    return this.pool.filter((e) => e.active);
  }

  /**
   * Get count of active entities
   */
  getActiveCount(): number {
    let count = 0;
    for (const e of this.pool) {
      if (e.active) count++;
    }
    return count;
  }

  /**
   * Update all active entities (move toward center)
   */
  update(dt: number, centerX: number, centerY: number, baseRadius: number): WordEntity[] {
    const reachedBase: WordEntity[] = [];

    for (const entity of this.pool) {
      if (!entity.active) continue;

      // Fade in
      if (entity.opacity < 1) {
        entity.opacity = Math.min(1, entity.opacity + dt * 3);
      }

      // Move toward center
      entity.distance -= entity.speed * dt;

      // Recalculate position
      entity.x = centerX + Math.cos(entity.angle) * entity.distance;
      entity.y = centerY + Math.sin(entity.angle) * entity.distance;

      // Check if reached base
      if (entity.distance <= baseRadius + 10) {
        reachedBase.push(entity);
      }
    }

    return reachedBase;
  }

  /**
   * Find the best target for a given key press
   * Priority: closest word whose next character matches the key
   */
  findTarget(key: string, currentTarget: WordEntity | null): WordEntity | null {
    // If there's a current target and it's still active, keep typing it
    if (currentTarget && currentTarget.active) {
      return currentTarget;
    }

    // Find all words whose next untyped character matches the key
    const candidates = this.pool.filter(
      (e) =>
        e.active &&
        !e.isTargeted &&
        e.charIndex < e.text.length &&
        e.text[e.charIndex].toLowerCase() === key.toLowerCase()
    );

    if (candidates.length === 0) return null;

    // Pick the one closest to the base (smallest distance)
    candidates.sort((a, b) => a.distance - b.distance);
    return candidates[0];
  }

  /**
   * Clear all entities
   */
  clearAll(): void {
    for (const entity of this.pool) {
      entity.active = false;
      entity.isTargeted = false;
    }
  }

  /**
   * Reset the pool entirely
   */
  reset(): void {
    this.clearAll();
    this.nextId = 0;
  }
}
