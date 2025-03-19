import React, { useContext, useState } from 'react';
import '../../styles/Tiles.css';
import { ThemeContext } from '../../context/ThemeContext';

const LargeTile = ({ title, children }) => {
  const { darkMode } = useContext(ThemeContext);
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div 
      className={`tile ${expanded ? 'expanded-tile' : ''} cursor-pointer transition-all duration-300`}
      onClick={toggleExpand}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
          {title}
        </h2>
      </div>
      <div className="chart-container" data-expanded={expanded}>
        {children}
      </div>
    </div>
  );
};

export default LargeTile; 