

import React from 'react';
import '../../styles/components/stats-card.css';
import { FaUtensils, FaListAlt, FaCheck, FaBookOpen } from 'react-icons/fa';

const StatsCard = ({ title, value, icon }) => {

  const renderIcon = () => {
    switch (icon) {
      case 'menu':
        return <FaBookOpen className="stats-icon" />;
      case 'active':
        return <FaCheck className="stats-icon" />;
      case 'category':
        return <FaListAlt className="stats-icon" />;
      case 'dish':
        return <FaUtensils className="stats-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="stats-card">
      <div className="stats-icon-container">
        {renderIcon()}
      </div>
      <div className="stats-content">
        <h3 className="stats-value">{value}</h3>
        <p className="stats-title">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;