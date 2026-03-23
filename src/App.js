import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

// --- Animations ---

const glint = keyframes`
  0% { transform: translateX(-150%) skewX(-25deg); }
  50% { transform: translateX(150%) skewX(-25deg); }
  100% { transform: translateX(150%) skewX(-25deg); }
`;

const talk = keyframes`
  0%, 100% { height: 5px; }
  50% { height: 12px; }
`;

// --- Styled Components ---

const Canvas = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: radial-gradient(circle, #ffffff 0%, #d7e1ec 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const ConanWrapper = styled.div`
  position: relative;
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HairGroup = styled.div`
  position: absolute;
  top: -10px;
  z-index: 5;
`;

const Spike = styled.div`
  position: absolute;
  background: #222;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
`;

const MainHair = styled.div`
  width: 210px;
  height: 100px;
  background: #222;
  border-radius: 100px 100px 20px 20px;
  position: relative;
`;

const Face = styled.div`
  position: relative;
  width: 200px;
  height: 180px;
  background: #ffdbac;
  border: 3px solid #1a1a1a;
  border-radius: 40% 40% 60% 60% / 40% 40% 90% 90%;
  box-shadow: inset 0 -15px 0 rgba(0,0,0,0.1); /* Chin Shadow */
  z-index: 2;
  margin-top: -40px;
  overflow: hidden;
`;

const Glasses = styled.div`
  position: absolute;
  top: 65px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 0 5px;
  box-sizing: border-box;
  z-index: 10;

  .lens {
    width: 85px;
    height: 60px;
    border: 5px solid #1a1a1a;
    border-radius: 10px;
    background: ${props => props.isSolving ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)'};
    position: relative;
    overflow: hidden;
    transition: background 0.5s ease;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 40px;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
      animation: ${props => props.isSolving ? css`${glint} 2s infinite` : 'none'};
    }
  }
`;

const Mouth = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 5px;
  background: #8e5a4e;
  border-radius: 10px;
  animation: ${props => props.isSolving ? css`${talk} 0.2s infinite` : 'none'};
`;

const Suit = styled.div`
  position: relative;
  width: 220px;
  height: 100px;
  background: #004494; /* Blazer */
  border: 3px solid #1a1a1a;
  border-radius: 50% 50% 10% 10%;
  margin-top: -10px;
  z-index: 1;

  &::before { /* Shirt Collar */
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 40px;
    background: white;
    border: 3px solid #1a1a1a;
    clip-path: polygon(0 0, 100% 0, 85% 100%, 15% 100%);
  }
`;

const BowtieVoiceChanger = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 45px;
  background: #d00;
  border: 2px solid #000;
  z-index: 15;
  clip-path: polygon(0 0, 45% 50%, 0 100%, 100% 100%, 55% 50%, 100% 0);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover { transform: translateX(-50%) scale(1.1); }
`;

const Controls = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const SolveButton = styled.button`
  background: #d00;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(208, 0, 0, 0.3);
  transition: all 0.3s;

  &:hover { background: #b00; transform: translateY(-2px); }
  &:active { transform: translateY(0); }
`;

// --- The App ---

export default function App() {
  const [isSolving, setIsSolving] = useState(false);

  return (
    <Canvas>
      <ConanWrapper>
        {/* Hair Layer */}
        <HairGroup>
          <Spike style={{ width: 60, height: 80, left: -20, top: 10, transform: 'rotate(-40deg)' }} />
          <Spike style={{ width: 50, height: 70, right: -15, top: 20, transform: 'rotate(35deg)' }} />
          <Spike style={{ width: 40, height: 90, left: 80, top: -40, transform: 'rotate(5deg)' }} />
          <MainHair />
        </HairGroup>

        {/* Head Layer */}
        <Face>
          <Glasses isSolving={isSolving}>
            <div className="lens" />
            <div className="lens" />
          </Glasses>
          <Mouth isSolving={isSolving} />
        </Face>

        {/* Body Layer */}
        <Suit>
          <BowtieVoiceChanger onClick={() => setIsSolving(!isSolving)} />
        </Suit>
      </ConanWrapper>

      <Controls>
        <h1 style={{ color: '#004494' }}>
          {isSolving ? "The culprit is YOU!" : "Case #1412: The CSS Mystery"}
        </h1>
        <SolveButton onClick={() => setIsSolving(!isSolving)}>
          {isSolving ? "Case Closed" : "Deduction Mode"}
        </SolveButton>
      </Controls>
    </Canvas>
  );
}