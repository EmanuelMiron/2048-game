import { useEffect, useState } from 'react';
import { ParticleConfig } from '../types/game';

interface ParticleEffectProps {
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({ 
  x, 
  y, 
  color, 
  onComplete 
}) => {
  const [particles, setParticles] = useState<ParticleConfig[]>([]);

  useEffect(() => {
    // Create particles
    const newParticles: ParticleConfig[] = [];
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const velocity = 2 + Math.random() * 2;
      
      newParticles.push({
        x,
        y,
        color,
        size: 4 + Math.random() * 4,
        velocity: {
          x: Math.cos(angle) * velocity,
          y: Math.sin(angle) * velocity
        },
        life: 1
      });
    }
    
    setParticles(newParticles);

    // Animate particles
    const animationDuration = 600;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / animationDuration;
      
      if (progress >= 1) {
        onComplete();
        return;
      }
      
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          x: particle.x + particle.velocity.x,
          y: particle.y + particle.velocity.y,
          life: 1 - progress,
          velocity: {
            x: particle.velocity.x * 0.98,
            y: particle.velocity.y * 0.98 + 0.1 // gravity
          }
        }))
      );
      
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [x, y, color, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.life,
            transform: `scale(${particle.life})`,
            transition: 'none'
          }}
        />
      ))}
    </div>
  );
};