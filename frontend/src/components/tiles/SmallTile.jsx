import React from 'react';
import '../../styles/Tiles.css';

const SmallTile = ({ title, value, icon }) => {
  return (
    <div className="small-tile tile">
      <div className="tile-icon">{icon}</div>
      <div className="tile-content">
        <h3 className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>{title}</h3>
        <p className="tile-value">{value}</p>
      </div>
    </div>
  );
};

export default SmallTile; 