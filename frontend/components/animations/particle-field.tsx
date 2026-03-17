'use client';
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

interface ParticleFieldProps {
  count?: number;
  connected?: boolean;
  className?: string;
}

export function ParticleField({ count = 70, connected = true, className }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const COLORS = ['#3b82f6', '#a855f7', '#14b8a6', '#06b6d4'];
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2.5 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (connected) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(59,130,246,${0.12 * (1 - dist / 110)})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [count, connected]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className || ''}`}
    />
  );
}

// DNA Helix SVG animation
export function DNAHelix({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 60 200" className="w-full h-full opacity-20">
        {Array.from({ length: 20 }, (_, i) => {
          const y = i * 10;
          const phase = (i / 20) * Math.PI * 4;
          const x1 = 30 + Math.sin(phase) * 20;
          const x2 = 30 - Math.sin(phase) * 20;
          return (
            <g key={i}>
              <circle cx={x1} cy={y} r="3" fill="#3b82f6" opacity={0.6 + Math.sin(phase) * 0.3} />
              <circle cx={x2} cy={y} r="3" fill="#a855f7" opacity={0.6 - Math.sin(phase) * 0.3} />
              {i < 19 && (
                <line
                  x1={x1} y1={y}
                  x2={30 + Math.sin(phase + 0.314) * 20}
                  y2={y + 10}
                  stroke="#3b82f6" strokeWidth="0.5" opacity="0.3"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
