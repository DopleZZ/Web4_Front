import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
}

@Component({
  selector: 'app-interactive-background',
  templateUrl: './interactive-background.component.html',
  styleUrls: ['./interactive-background.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class InteractiveBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private width!: number;
  private height!: number;
  private mousePosition = { x: 0, y: 0 };
  private particles: Particle[] = [];
  private animationFrameId!: number;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = context;
    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.initParticles();
    this.animate();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeCanvas.bind(this));
    window.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    cancelAnimationFrame(this.animationFrameId);
  }

  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = this.width;
    canvas.height = this.height;
    this.initParticles();
  }

  initParticles() {
    this.particles = Array.from({ length: 50 }, (): Particle => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: Math.random() * 2 + 1,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
    }));
  }

  drawParticle(particle: Particle) {
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(0, 113, 227, 0.1)';
    this.ctx.fill();
  }

  connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 150) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(0, 113, 227, ${0.1 * (1 - distance / 150)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      const dx = this.mousePosition.x - particle.x;
      const dy = this.mousePosition.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const angle = Math.atan2(dy, dx);
        particle.x -= Math.cos(angle) * 0.5;
        particle.y -= Math.sin(angle) * 0.5;
      }

      if (particle.x < 0 || particle.x > this.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.height) particle.speedY *= -1;

      this.drawParticle(particle);
    });

    this.connectParticles();
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  handleMouseMove(e: MouseEvent) {
    this.mousePosition = { x: e.clientX, y: e.clientY };
  }
}
