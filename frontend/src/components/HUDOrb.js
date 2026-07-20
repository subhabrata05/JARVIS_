import React from 'react';
import './HUDOrb.css';

const HUDOrb = ({ state = 'idle' }) => {
  // state: 'idle' | 'listening' | 'thinking'
  const labels = {
    idle: 'STANDBY',
    listening: 'LISTENING',
    thinking: 'PROCESSING',
  };

  return (
    <div className={`hud-orb hud-orb--${state}`}>
      
      {/* 3D Environment */}
      <div className="hud-orb__3d-container">
        
        {/* Core Glow */}
        <div className="hud-orb__core-glow" />
        
        {/* 3D Rings */}
        <div className="hud-orb__ring-3d hud-orb__ring-3d--1">
          <div className="hud-orb__ring-accent" />
        </div>
        <div className="hud-orb__ring-3d hud-orb__ring-3d--2" />
        <div className="hud-orb__ring-3d hud-orb__ring-3d--3" />
        <div className="hud-orb__ring-3d hud-orb__ring-3d--4">
          <div className="hud-orb__ring-accent hud-orb__ring-accent--alt" />
        </div>
        
        {/* Particles */}
        <div className="hud-orb__particles">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="hud-orb__particle" 
              style={{
                '--angle': `${Math.random() * 360}deg`,
                '--radius': `${Math.random() * 60 + 120}px`,
                '--delay': `${Math.random() * -10}s`,
                '--speed': `${Math.random() * 4 + 4}s`
              }} 
            />
          ))}
        </div>

        {/* Central Sphere */}
        <div className="hud-orb__sphere">
          <div className="hud-orb__sphere-inner" />
          <div className="hud-orb__sphere-glare" />
        </div>

        {/* 3D Holographic Pedestal */}
        <div className="hud-orb__pedestal">
          <div className="hud-orb__pedestal-ring" />
          <div className="hud-orb__pedestal-base" />
        </div>
      </div>

      {/* Status label */}
      <div className="hud-orb__status">
        <span className="hud-orb__status-dot" />
        <span className="hud-orb__status-text font-hud">{labels[state]}</span>
      </div>

      {/* Audio Visualizer / Arcs */}
      <div className="hud-orb__arcs">
        {[...Array(9)].map((_, i) => (
          <div 
            key={i} 
            className="hud-orb__arc-bar" 
            style={{ 
              animationDelay: `${i * 150}ms`,
              height: `${Math.random() * 15 + 10}px` 
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default HUDOrb;
