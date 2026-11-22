import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Eye, RotateCcw, Sparkles } from 'lucide-react';
import logoVexor from '../../assets/images/logo-Vexor.png';

interface WelcomeSplashProps {
  onAnimationComplete: () => void;
}

const particles = Array.from({ length: 24 }, (_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  top: `${58 + ((index * 23) % 40)}%`,
  size: 3 + (index % 4),
  duration: `${7 + (index % 6)}s`,
  delay: `${-(index % 8)}s`,
  drift: `${(index % 2 === 0 ? 1 : -1) * (18 + (index % 5) * 8)}px`,
}));

function messageFor(progress: number) {
  if (progress >= 100) return 'Listo!';
  if (progress >= 68) return 'Optimizando diseño...';
  if (progress >= 34) return 'Preparando proyectos...';
  return 'Cargando portafolio...';
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onAnimationComplete }) => {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const message = useMemo(() => messageFor(progress), [progress]);

  useEffect(() => {
    if (ready) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setProgress(100);
      setReady(true);
      return;
    }

    const timer = window.setInterval(() => {
      setProgress((value) => {
        const next = Math.min(100, value + 1 + Math.floor(Math.random() * 3));
        if (next >= 100) {
          window.clearInterval(timer);
          setReady(true);
        }
        return next;
      });
    }, 34);

    return () => window.clearInterval(timer);
  }, [ready]);

  useEffect(() => {
    const safetyTimer = window.setTimeout(onAnimationComplete, 8000);
    return () => window.clearTimeout(safetyTimer);
  }, [onAnimationComplete]);

  const enter = () => {
    setFadeOut(true);
    window.setTimeout(onAnimationComplete, 430);
  };

  const skip = () => {
    setFadeOut(true);
    window.setTimeout(onAnimationComplete, 430);
  };

  const restart = () => {
    setFadeOut(false);
    setReady(false);
    setProgress(0);
  };

  return (
    <main className={`vs-splash ${fadeOut ? 'vs-splash--hidden' : ''}`} aria-label="Pantalla de carga del portafolio">
      <div className="vs-splash-aurora" aria-hidden="true" />
      <div className="vs-splash-particles" aria-hidden="true">
        {particles.map((particle, index) => (
          <span
            key={index}
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
              '--vs-drift': particle.drift,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="vs-splash-shell">
        <header className="vs-splash-header">
          <span><i /> VexoraIA</span>
          <span>Portafolio · 2026</span>
          <span>VX / 01</span>
        </header>

        <section className="vs-splash-content">
          <div className="vs-splash-logo-wrap">
            <div className="vs-splash-ring" />
            <div className="vs-splash-ring vs-splash-ring--second" />
            <div className="vs-splash-logo-core">
              <img src={logoVexor} alt="VexoraIA" />
            </div>
            <span className="vs-splash-spark"><Sparkles size={15} /></span>
          </div>

          <p className="vs-splash-kicker">Bienvenido al portafolio</p>
          <h1>VexoraIA</h1>
          <p className="vs-splash-subtitle">Desarrollo web <span>·</span> IA <span>·</span> Sistemas comerciales</p>

          <div className="vs-splash-progress-wrap">
            <div className="vs-splash-progress-label">
              <span aria-live="polite">{message}</span>
              <strong aria-live="polite">{progress}<b>%</b></strong>
            </div>
            <div
              className="vs-splash-progress-track"
              role="progressbar"
              aria-label="Progreso de carga"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div className="vs-splash-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="vs-splash-progress-tags"><span>Diseño</span><span>Desarrollo</span><span>Automatización</span></div>
          </div>

          {ready ? (
            <div className="vs-splash-ready">
              <div><strong><i>✓</i> ¡Bienvenido!</strong><p>Todo está listo para mostrarte el trabajo y la experiencia.</p></div>
              <button type="button" onClick={enter}>Entrar al portafolio <ArrowRight size={17} /></button>
            </div>
          ) : (
            <div className="vs-splash-dots" aria-label="Cargando">
              <i /><i /><i />
            </div>
          )}

          <div className="vs-splash-actions">
            <button type="button" onClick={skip} disabled={ready}><Eye size={15} /> Saltar</button>
            <button type="button" onClick={restart}><RotateCcw size={15} /> Volver a ver</button>
          </div>
        </section>

        <footer className="vs-splash-footer">
          <span>© VexoraIA · Colombia</span>
          <span>Diseño · Código · Seguridad</span>
        </footer>
      </div>
    </main>
  );
};
