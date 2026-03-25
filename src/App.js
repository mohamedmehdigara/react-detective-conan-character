import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';

// --- Animations ---

const glint = keyframes`
  0% { transform: translateX(-350%) skewX(-30deg); }
  35%, 100% { transform: translateX(500%) skewX(-30deg); }
`;

const gridScroll = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 0 40px; }
`;

const shake = keyframes`
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
`;

const pulseTarget = keyframes`
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
`;

// --- Global Styles ---

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: ${props => props.isSolving ? '#050507' : '#0f172a'};
    transition: background 1s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'Share Tech Mono', monospace;
    overflow: hidden;
    color: white;
    user-select: none;
  }
`;

// --- Styled Components ---

const Stage = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  perspective: 2000px;
  ${props => props.isSolving && css`animation: ${shake} 0.5s cubic-bezier(.36,.07,.19,.97) both;`}
`;

const CulpritShadow = styled.div`
  position: absolute;
  width: 600px;
  height: 800px;
  background: #000;
  clip-path: polygon(50% 5%, 75% 25%, 85% 100%, 15% 100%, 25% 25%);
  filter: blur(80px);
  opacity: ${props => props.isSolving ? 0.7 : 0};
  transition: opacity 1.5s ease-in-out;
  pointer-events: none;
`;

const ConanContainer = styled.div`
  position: relative;
  z-index: 10;
  transform-style: preserve-3d;
  transform: rotateY(${props => props.rotate.x}deg) rotateX(${props => props.rotate.y}deg);
  transition: transform 0.15s ease-out;
`;

const HairSpike = styled.div`
  position: absolute;
  background: #111;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
`;

const Face = styled.div`
  position: relative;
  width: 210px;
  height: 190px;
  background: linear-gradient(135deg, #ffdbac 0%, #f1c27d 100%);
  border: 4px solid #000;
  border-radius: 40% 40% 50% 50% / 40% 40% 90% 90%;
  box-shadow: inset -15px -10px 0 rgba(0,0,0,0.1);
  zIndex: 5;
`;

const Neck = styled.div`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 40px;
  background: #e5b584;
  border: 4px solid #000;
  border-radius: 0 0 10px 10px;
  zIndex: 4;
`;

const Eye = styled.div`
  position: absolute;
  top: 80px;
  width: 52px;
  height: 46px;
  background: white;
  border: 3px solid #000;
  border-radius: 50%;
  left: ${props => props.right ? '118px' : '32px'};
  opacity: ${props => props.isSolving ? 0 : 1};
  transition: opacity 0.4s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &::after {
    content: '';
    width: 26px;
    height: 32px;
    background: radial-gradient(circle at 35% 35%, #555, #000 80%);
    border-radius: 50%;
  }
`;

const GlassFrame = styled.div`
  position: absolute;
  top: 65px;
  left: 5px;
  width: 200px;
  display: flex;
  justify-content: space-between;
  zIndex: 20;
  pointer-events: none;

  .lens {
    width: 92px;
    height: 68px;
    background: ${props => props.isSolving ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.1)'};
    border: 5px solid #000;
    border-radius: 14px;
    position: relative;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    box-shadow: ${props => props.isSolving ? '0 0 25px rgba(255,255,255,0.4)' : 'none'};

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%);
      animation: ${props => props.isSolving ? css`${glint} 2.5s infinite` : 'none'};
      opacity: ${props => props.isSolving ? 1 : 0.3};
    }
  }
`;

const HUDOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-size: 15px 15px;
  background-image: 
    linear-gradient(to right, rgba(0, 255, 68, 0.15) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 255, 68, 0.15) 1px, transparent 1px);
  animation: ${gridScroll} 3s linear infinite;
  display: ${props => props.active ? 'block' : 'none'};
`;

const Crosshair = styled.div`
  position: absolute;
  top: 50%; left: 50%;
  width: 22px; height: 22px;
  border: 2px solid #ff0000;
  border-radius: 50%;
  animation: ${pulseTarget} 1.2s infinite;
  display: ${props => props.active ? 'block' : 'none'};
  &::before { content: ''; position: absolute; top: 10px; left: -8px; width: 38px; height: 2px; background: #ff0000; }
  &::after { content: ''; position: absolute; left: 10px; top: -8px; width: 2px; height: 38px; background: #ff0000; }
`;

const Bowtie = styled.div`
  position: absolute;
  bottom: -45px;
  left: 50%;
  transform: translateX(-50%);
  width: 110px;
  height: 55px;
  background: #cc0000;
  border: 4px solid #000;
  clip-path: polygon(0 20%, 40% 50%, 0 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 60% 50%, 100% 20%, 80% 0, 50% 30%, 20% 0);
  zIndex: 30;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);

  &:hover { transform: translateX(-50%) scale(1.1) rotate(3deg); }
  &:active { transform: translateX(-50%) scale(0.9); }
`;

const UI = styled.div`
  margin-top: 120px;
  text-align: center;
  zIndex: 100;
`;

const StatusText = styled.h1`
  font-size: 2.2rem;
  color: ${props => props.isSolving ? '#ff3e3e' : '#38bdf8'};
  text-shadow: ${props => props.isSolving ? '0 0 25px rgba(255,62,62,0.6)' : '0 0 10px rgba(56,189,248,0.3)'};
  transition: all 0.5s ease;
  margin-bottom: 5px;
`;

// --- The Application ---

export default function App() {
  const [isSolving, setIsSolving] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleToggle = useCallback(() => setIsSolving(prev => !prev), []);

  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 45;
      const y = (e.clientY - window.innerHeight / 2) / 45;
      setRotation({ x: x, y: -y });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') handleToggle();
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleToggle]);

  return (
    <Stage isSolving={isSolving}>
      <GlobalStyle isSolving={isSolving} />
      <CulpritShadow isSolving={isSolving} />

      <ConanContainer rotate={rotation}>
        {/* Background Hair Layers */}
        <HairSpike style={{ width: 130, height: 160, top: -80, left: -40, transform: 'rotate(-35deg)', background: '#0a0a0a' }} />
        <HairSpike style={{ width: 110, height: 140, top: -70, right: -40, transform: 'rotate(30deg)', background: '#0a0a0a' }} />
        <HairSpike style={{ width: 70, height: 110, top: -90, left: 70, transform: 'rotate(8deg)', background: '#0a0a0a' }} />

        <Face>
          <Eye isSolving={isSolving} />
          <Eye right isSolving={isSolving} />
          
          <GlassFrame isSolving={isSolving}>
            <div className="lens">
              <HUDOverlay active={isSolving} />
              <Crosshair active={isSolving} />
            </div>
            <div className="lens" />
          </GlassFrame>

          {/* Nose & Mouth */}
          <div style={{ position: 'absolute', top: 130, left: '50%', width: 8, height: 4, background: 'rgba(0,0,0,0.25)', borderRadius: '50%' }} />
          <div style={{ 
            position: 'absolute', bottom: 45, left: '50%', transform: 'translateX(-50%)',
            width: isSolving ? 45 : 22, height: 3, background: '#000', transition: 'all 0.4s ease',
            borderRadius: '10px'
          }} />
          <Neck />
        </Face>

        {/* Foreground Hair Part */}
        <div style={{
          position: 'absolute', top: -35, left: 5, width: 200, height: 85,
          background: '#1a1a1a', borderRadius: '100px 100px 20px 20px', zIndex: 6,
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
        }} />

        <Bowtie onClick={handleToggle} />
      </ConanContainer>

      <UI>
        <StatusText isSolving={isSolving}>
          {isSolving ? "SHINJITSU WA ITSUMO HITOTSU!" : "STATUS: UNDERCOVER"}
        </StatusText>
        <p style={{ color: '#94a3b8', fontSize: '1rem', letterSpacing: '1px' }}>
          {isSolving ? "DETECTIVE GADGETS ACTIVE // TARGET ACQUIRED" : "SCANNING AREA FOR CLUES"}
        </p>
      </UI>
    </Stage>
  );
}