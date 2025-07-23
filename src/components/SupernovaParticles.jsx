// SupernovaParticles.jsx
import React, { useRef, useEffect } from 'react';

// Particle color themes for each element
const ELEMENT_PARTICLE_THEMES = {
  Earth: {
    colors: ['#4B8F29', '#A3C585', '#6B8E23', '#BDB76B'],
    shape: 'circle',
  },
  Water: {
    colors: ['#2196F3', '#B0E0E6', '#00BFFF', '#40C4FF'],
    shape: 'circle',
  },
  Fire: {
    colors: ['#FF5722', '#FFD700', '#FF9800', '#FF4500'],
    shape: 'circle',
  },
  Air: {
    colors: ['#B0E0E6', '#E0FFFF', '#F0F8FF', '#D3EFFF'],
    shape: 'circle',
  },
};

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function SupernovaParticles({ element, trigger }) {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const particlesRef = useRef([]);
  const centerRef = useRef({ x: 0, y: 0 });

  // Particle burst config
  const PARTICLE_COUNT = 60;
  const DURATION = 2000; // ms
  const RADIUS = 120; // px

  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    centerRef.current = { x: width / 2, y: height / 2 };
    const theme = ELEMENT_PARTICLE_THEMES[element] || ELEMENT_PARTICLE_THEMES.Earth;

    // Create particles
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (2 * Math.PI * i) / PARTICLE_COUNT + randomBetween(-0.1, 0.1);
      const speed = randomBetween(1.5, 2.5);
      const color = theme.colors[Math.floor(Math.random() * theme.colors.length)];
      return {
        x: centerRef.current.x,
        y: centerRef.current.y,
        angle,
        speed,
        radius: randomBetween(4, 8),
        color,
        swirl: randomBetween(0.8, 1.2),
        orbit: randomBetween(RADIUS * 0.7, RADIUS * 1.2),
        startTime: performance.now(),
      };
    });
    particlesRef.current = particles;

    let animationFrame;
    function animate(now) {
      ctx.clearRect(0, 0, width, height);
      const elapsed = now - particles[0].startTime;
      particles.forEach((p, i) => {
        // Swirl outward, then orbit
        let t = Math.min(elapsed / DURATION, 1);
        let r = p.orbit * t;
        let swirlAngle = p.angle + t * 4 * p.swirl;
        let px = centerRef.current.x + r * Math.cos(swirlAngle);
        let py = centerRef.current.y + r * Math.sin(swirlAngle);
        ctx.beginPath();
        ctx.arc(px, py, p.radius * (1 - t * 0.7), 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 1 - t * 0.7;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (elapsed < DURATION) {
        animationFrame = requestAnimationFrame(animate);
      }
    }
    animationFrame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, width, height);
    };
  }, [element, trigger]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={320}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
} 