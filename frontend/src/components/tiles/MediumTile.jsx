import React from 'react';
import '../../styles/Tiles.css';

const MediumTile = ({ title, children }) => {
  return (
    <div className="medium-tile tile">
      <h3 className="tile-title">{title}</h3>
      <div className="tile-content">
        {children}
      </div>
    </div>
  );
};

export default MediumTile; 