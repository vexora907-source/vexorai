import React, { useEffect, useState } from 'react';
import logoVexor from '../../assets/images/logo-Vexor.png';

interface WelcomeSplashProps {
  onAnimationComplete: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onAnimationComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onAnimationComplete, 800);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div className={`splash-screen ${fadeOut ? 'splash-screen--hidden' : ''}`}>
      <div className="splash-glow" />

      <div className="splash-content">
        <img src={logoVexor} alt="Vexor AI Logo" className="splash-logo" />

        <div className="splash-loader">
          <div className="splash-loader-bar" />
        </div>
      </div>
    </div>
  );
};
