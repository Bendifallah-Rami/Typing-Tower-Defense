// ═══════════════════════════════════════════════════════════
// ParticleSystem — Lightweight particle effects
// ═══════════════════════════════════════════════════════════

import { Particle } from '../types';

const MAX_PARTICLES = 500;

export class ParticleSystem {
  private particles: Particle[] = [];

  constructor() {
    // Pre-allocate
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.particles.push({
        x: 0, y: 0, vx: 0, vy: 0,
        life: 0, maxLife: 0, size: 0,
        color: '', opacity: 0, active: false,
      });
    }
  }

  /**
   * Emit particles at a position
   */
  emit(x: number, y: number, count: number, color: string): void {
    let spawned = 0;
    for (const p of this.particles) {
      if (spawned >= count) break;
      if (p.active) continue;

      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 200;

      p.x = x;
      p.y = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.life = 0;
      p.maxLife = 0.4 + Math.random() * 0.6;
      p.size = 2 + Math.random() * 4;
      p.color = color;
      p.opacity = 1;
      p.active = true;

      spawned++;
    }
  }

  /**
   * Update all active particles
   */
  update(dt: number): void {
    for (const p of this.particles) {
      if (!p.active) continue;

      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Slow down
      p.vx *= 0.96;
      p.vy *= 0.96;

      // Fade out
      p.opacity = 1 - p.life / p.maxLife;
      p.size *= 0.99;
    }
  }

  /**
   * Draw all active particles
   */
  draw(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      if (!p.active) continue;

      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /**
   * Clear all particles
   */
  clear(): void {
    for (const p of this.particles) {
      p.active = false;
    }
  }
}
