// ═══════════════════════════════════════════════════════════
// CanvasRenderer — 2D Canvas rendering for the game field
// ═══════════════════════════════════════════════════════════

import { WordEntity, BaseState, WordCategory, ScreenShake } from '../types';
import { ParticleSystem } from './ParticleSystem';

// ─── Design tokens from portfolio ───────────────────────
const COLORS = {
  bg: '#0a0a14',
  bgGradientInner: '#111128',
  bgGradientOuter: '#0a0a14',
  accent: '#c2f751',
  accentDim: 'rgba(194, 247, 81, 0.15)',
  accentGlow: 'rgba(194, 247, 81, 0.3)',
  textPrimary: '#f0f0f5',
  textSecondary: '#8a8a9a',
  textTyped: '#c2f751',
  textUntyped: 'rgba(240, 240, 245, 0.6)',
  textTargeted: '#ffffff',
  danger: '#ff4757',
  dangerGlow: 'rgba(255, 71, 87, 0.4)',
  success: '#2ed573',
  border: 'rgba(255, 255, 255, 0.08)',
  borderAccent: 'rgba(194, 247, 81, 0.3)',
  baseFill: 'rgba(194, 247, 81, 0.1)',
  baseStroke: 'rgba(194, 247, 81, 0.5)',
  baseGlow: 'rgba(194, 247, 81, 0.2)',
  dotGrid: 'rgba(255, 255, 255, 0.03)',
  programming: '#61dafb',
  boss: '#ff6b9d',
};

const FONT = {
  word: '600 16px "Inter", sans-serif',
  wordLarge: '700 20px "Inter", sans-serif',
  wordSmall: '500 14px "Inter", sans-serif',
  ui: '400 12px "Inter", sans-serif',
  waveBanner: '800 48px "Inter", sans-serif',
  waveBannerSub: '500 18px "Inter", sans-serif',
};

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: ParticleSystem;
  private shake: ScreenShake = { intensity: 0, duration: 0, elapsed: 0, offsetX: 0, offsetY: 0 };
  private dotPattern: ImageData | null = null;

  // Wave banner animation
  private waveBannerText = '';
  private waveBannerOpacity = 0;
  private waveBannerTime = 0;

  // Between-wave countdown
  private countdownText = '';

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D context not available');
    this.ctx = ctx;
    this.particles = new ParticleSystem();
  }

  /**
   * Resize canvas to fill container
   */
  resize(width: number, height: number): void {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(dpr, dpr);
    this.dotPattern = null; // invalidate cached pattern
  }

  get width(): number {
    return this.canvas.width / (window.devicePixelRatio || 1);
  }

  get height(): number {
    return this.canvas.height / (window.devicePixelRatio || 1);
  }

  get centerX(): number {
    return this.width / 2;
  }

  get centerY(): number {
    return this.height / 2;
  }

  /**
   * Trigger screen shake effect
   */
  triggerShake(intensity: number, duration: number): void {
    this.shake.intensity = intensity;
    this.shake.duration = duration;
    this.shake.elapsed = 0;
  }

  /**
   * Show wave banner
   */
  showWaveBanner(text: string): void {
    this.waveBannerText = text;
    this.waveBannerOpacity = 1;
    this.waveBannerTime = 0;
  }

  /**
   * Set countdown text
   */
  setCountdown(text: string): void {
    this.countdownText = text;
  }

  /**
   * Spawn destruction particles at a word's position
   */
  spawnDestructionParticles(x: number, y: number, category: WordCategory): void {
    const color =
      category === WordCategory.PROGRAMMING
        ? COLORS.programming
        : category === WordCategory.BOSS
          ? COLORS.boss
          : COLORS.accent;

    this.particles.emit(x, y, 15, color);
  }

  /**
   * Spawn damage particles at base
   */
  spawnDamageParticles(x: number, y: number): void {
    this.particles.emit(x, y, 10, COLORS.danger);
  }

  /**
   * Main render method
   */
  render(
    dt: number,
    words: WordEntity[],
    base: BaseState,
    _alpha: number,
  ): void {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Update screen shake
    this.updateShake(dt);

    ctx.save();

    // Apply screen shake offset
    if (this.shake.intensity > 0) {
      ctx.translate(this.shake.offsetX, this.shake.offsetY);
    }

    // ─── Background ────────────────────────────────────
    this.drawBackground(w, h);

    // ─── Spawn radius indicator ────────────────────────
    this.drawSpawnCircle(base.x, base.y, w * 0.45);

    // ─── Base ──────────────────────────────────────────
    this.drawBase(base);

    // ─── Word Entities ─────────────────────────────────
    for (const word of words) {
      if (word.active) {
        this.drawWord(word);
      }
    }

    // ─── Particles ─────────────────────────────────────
    this.particles.update(dt);
    this.particles.draw(ctx);

    // ─── Wave Banner ───────────────────────────────────
    this.drawWaveBanner(dt, w, h);

    // ─── Countdown ─────────────────────────────────────
    if (this.countdownText) {
      this.drawCountdown(w, h);
    }

    ctx.restore();
  }

  private drawBackground(w: number, h: number): void {
    const ctx = this.ctx;

    // Solid background
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, w, h);

    // Radial gradient from center
    const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.6);
    gradient.addColorStop(0, COLORS.bgGradientInner);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Dot grid pattern
    this.drawDotGrid(w, h);

    // Corner glow (ambient accent)
    const cornerGlow = ctx.createRadialGradient(w * 0.85, h * 0.2, 0, w * 0.85, h * 0.2, 200);
    cornerGlow.addColorStop(0, 'rgba(194, 247, 81, 0.06)');
    cornerGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = cornerGlow;
    ctx.fillRect(0, 0, w, h);
  }

  private drawDotGrid(w: number, h: number): void {
    const ctx = this.ctx;
    const spacing = 30;

    ctx.fillStyle = COLORS.dotGrid;
    for (let x = spacing; x < w; x += spacing) {
      for (let y = spacing; y < h; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private drawSpawnCircle(cx: number, cy: number, radius: number): void {
    const ctx = this.ctx;

    // Dashed circle showing spawn boundary
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Range rings
    for (let r = 100; r < radius; r += 100) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.02})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }

  private drawBase(base: BaseState): void {
    const ctx = this.ctx;
    const { x, y, radius, hp, maxHp } = base;

    // Outer glow
    const glow = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 2.5);
    const hpRatio = hp / maxHp;

    if (hpRatio > 0.5) {
      glow.addColorStop(0, COLORS.baseGlow);
    } else if (hpRatio > 0.25) {
      glow.addColorStop(0, 'rgba(255, 165, 2, 0.2)');
    } else {
      glow.addColorStop(0, COLORS.dangerGlow);
    }
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(x - radius * 3, y - radius * 3, radius * 6, radius * 6);

    const baseColor = hpRatio > 0.25 ? COLORS.baseStroke : COLORS.danger;

    // Draw Hexagon Foundation instead of circle
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = COLORS.baseFill;
    ctx.fill();
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // HP Hexagon arc
    if (hp < maxHp) {
      ctx.beginPath();
      // Calculate how many segments to draw based on hpRatio
      const segments = hpRatio * 6;
      for (let i = 0; i <= Math.floor(segments); i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const px = x + Math.cos(angle) * (radius + 8);
        const py = y + Math.sin(angle) * (radius + 8);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      
      // Interpolate the last partial segment
      const remainder = segments % 1;
      if (remainder > 0) {
        const i = Math.floor(segments);
        const angle1 = (Math.PI / 3) * i - Math.PI / 2;
        const angle2 = (Math.PI / 3) * (i + 1) - Math.PI / 2;
        
        const px1 = x + Math.cos(angle1) * (radius + 8);
        const py1 = y + Math.sin(angle1) * (radius + 8);
        const px2 = x + Math.cos(angle2) * (radius + 8);
        const py2 = y + Math.sin(angle2) * (radius + 8);
        
        const finalX = px1 + (px2 - px1) * remainder;
        const finalY = py1 + (py2 - py1) * remainder;
        ctx.lineTo(finalX, finalY);
      }
      
      ctx.strokeStyle = hpRatio > 0.5 ? COLORS.accent : hpRatio > 0.25 ? '#ffa502' : COLORS.danger;
      ctx.lineWidth = 4;
      ctx.lineJoin = 'miter';
      ctx.stroke();
    }

    // Center Tower Icon (using the same path as the logo)
    ctx.save();
    ctx.translate(x, y);
    // Scale the 24x24 icon to fit the foundation nicely
    const iconScale = (radius * 1.5) / 24; 
    ctx.scale(iconScale, iconScale);
    ctx.translate(-12, -12); // Center the path

    const p = new Path2D("M2 22H22V18H18V8H20V2H16V6H14V2H10V6H8V2H4V8H6V18H2V22ZM9 10H15V12H13V16H11V12H9V10Z");
    ctx.fillStyle = hpRatio > 0.25 ? COLORS.accent : COLORS.danger;
    ctx.fill(p);
    ctx.restore();

    // HP text
    ctx.font = FONT.ui;
    ctx.fillStyle = COLORS.textSecondary;
    ctx.textAlign = 'center';
    ctx.fillText(`${hp}/${maxHp}`, x, y + radius + 28);
  }

  private drawWord(word: WordEntity): void {
    const ctx = this.ctx;
    const { x, y, text, charIndex, isTargeted, category, opacity } = word;

    ctx.globalAlpha = opacity;

    // Word background pill
    const metrics = ctx.measureText(text);
    // Need to set font first for accurate measurement
    ctx.font = isTargeted ? FONT.wordLarge : FONT.word;
    const textWidth = ctx.measureText(text).width;
    const pillWidth = textWidth + 24;
    const pillHeight = isTargeted ? 34 : 28;

    // Shadow/glow for targeted word
    if (isTargeted) {
      ctx.shadowColor = COLORS.accentGlow;
      ctx.shadowBlur = 12;
    }

    // Pill background
    const pillX = x - pillWidth / 2;
    const pillY = y - pillHeight / 2;

    ctx.beginPath();
    const pillRadius = pillHeight / 2;
    ctx.roundRect(pillX, pillY, pillWidth, pillHeight, pillRadius);

    // Different styling per category
    if (category === WordCategory.BOSS) {
      ctx.fillStyle = 'rgba(255, 107, 157, 0.15)';
      ctx.strokeStyle = 'rgba(255, 107, 157, 0.4)';
    } else if (category === WordCategory.PROGRAMMING) {
      ctx.fillStyle = 'rgba(97, 218, 251, 0.1)';
      ctx.strokeStyle = 'rgba(97, 218, 251, 0.3)';
    } else {
      ctx.fillStyle = isTargeted ? 'rgba(194, 247, 81, 0.1)' : 'rgba(20, 20, 40, 0.8)';
      ctx.strokeStyle = isTargeted ? COLORS.borderAccent : COLORS.border;
    }

    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Draw text character by character
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    let charX = x - textWidth / 2;
    for (let i = 0; i < text.length; i++) {
      if (i < charIndex) {
        // Already typed — accent color
        ctx.fillStyle = COLORS.textTyped;
      } else if (i === charIndex && isTargeted) {
        // Current character — bright white
        ctx.fillStyle = COLORS.textTargeted;
      } else {
        // Not yet typed
        ctx.fillStyle = COLORS.textUntyped;
      }

      const char = text[i];
      ctx.fillText(char, charX, y);
      charX += ctx.measureText(char).width;
    }

    // Distance indicator (small line toward center)
    if (!isTargeted) {
      const angle = word.angle + Math.PI; // reverse direction
      const lineLen = 8;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * (pillWidth / 2 + 4), y + Math.sin(angle) * (pillHeight / 2 + 4));
      ctx.lineTo(
        x + Math.cos(angle) * (pillWidth / 2 + 4 + lineLen),
        y + Math.sin(angle) * (pillHeight / 2 + 4 + lineLen),
      );
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }

  private drawWaveBanner(dt: number, w: number, h: number): void {
    if (this.waveBannerOpacity <= 0) return;

    this.waveBannerTime += dt;

    // Fade out after 2 seconds
    if (this.waveBannerTime > 2) {
      this.waveBannerOpacity = Math.max(0, this.waveBannerOpacity - dt * 2);
    }

    const ctx = this.ctx;
    ctx.globalAlpha = this.waveBannerOpacity;

    // Banner text
    ctx.font = FONT.waveBanner;
    ctx.fillStyle = COLORS.accent;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Subtle scale animation
    const scale = 1 + Math.sin(this.waveBannerTime * 3) * 0.02;
    ctx.save();
    ctx.translate(w / 2, h / 2 - 20);
    ctx.scale(scale, scale);
    ctx.fillText(this.waveBannerText, 0, 0);
    ctx.restore();

    ctx.globalAlpha = 1;
  }

  private drawCountdown(w: number, h: number): void {
    const ctx = this.ctx;
    ctx.font = FONT.waveBannerSub;
    ctx.fillStyle = COLORS.textSecondary;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.countdownText, w / 2, h / 2 + 30);
  }

  private updateShake(dt: number): void {
    if (this.shake.intensity <= 0) return;

    this.shake.elapsed += dt;
    if (this.shake.elapsed >= this.shake.duration) {
      this.shake.intensity = 0;
      this.shake.offsetX = 0;
      this.shake.offsetY = 0;
      return;
    }

    // Decay
    const decay = 1 - this.shake.elapsed / this.shake.duration;
    const currentIntensity = this.shake.intensity * decay;

    this.shake.offsetX = (Math.random() - 0.5) * 2 * currentIntensity;
    this.shake.offsetY = (Math.random() - 0.5) * 2 * currentIntensity;
  }

  /**
   * Get the particle system (for external access)
   */
  getParticles(): ParticleSystem {
    return this.particles;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.particles.clear();
  }
}
