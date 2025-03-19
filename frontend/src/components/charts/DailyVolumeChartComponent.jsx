import React, { useState, useEffect, useContext, useRef } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DailyVolumeChartComponent = ({ data }) => {
  const { darkMode } = useContext(ThemeContext);
  const [currentMonth, setCurrentMonth] = useState('January');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const containerRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if parent container has data-expanded attribute
  useEffect(() => {
    const checkExpanded = () => {
      if (containerRef.current) {
        const parent = containerRef.current.closest('.chart-container');
        if (parent) {
          setIsExpanded(parent.getAttribute('data-expanded') === 'true');
        }
      }
    };
    
    checkExpanded();
    
    // Set up a mutation observer to watch for changes to the data-expanded attribute
    const observer = new MutationObserver(checkExpanded);
    if (containerRef.current) {
      const parent = containerRef.current.closest('.chart-container');
      if (parent) {
        observer.observe(parent, { attributes: true, attributeFilter: ['data-expanded'] });
      }
    }
    
    return () => observer.disconnect();
  }, []);

  // Colors for the chart based on theme
  const conversationsColor = darkMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(37, 99, 235, 0.8)';
  const conversationsBorderColor = darkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(37, 99, 235, 1)';
  const textColor = darkMode ? '#e2e8f0' : '#1e293b';
  const gridColor = darkMode ? 'rgba(71, 85, 105, 0.2)' : 'rgba(203, 213, 225, 0.2)';

  useEffect(() => {
    if (data && data[currentMonth]) {
      const monthData = data[currentMonth];
      
      // Create labels for each day of the month
      const labels = monthData.map((_, index) => `${index + 1}`);
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Total Conversations',
            data: monthData,
            backgroundColor: conversationsColor,
            borderColor: conversationsBorderColor,
            borderWidth: 1,
            borderRadius: 4,
            maxBarThickness: isExpanded ? 15 : 10,
          }
        ],
      });
    }
  }, [data, currentMonth, conversationsColor, conversationsBorderColor, isExpanded]);

  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: {
            size: isExpanded ? 12 : 10
          },
          boxWidth: isExpanded ? 15 : 10
        }
      },
      title: {
        display: true,
        text: `Daily Volume - ${currentMonth}`,
        color: textColor,
        font: {
          size: isExpanded ? 18 : 14,
          weight: 'bold'
        },
        padding: {
          top: isExpanded ? 10 : 5,
          bottom: isExpanded ? 10 : 5
        }
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: darkMode ? '#e2e8f0' : '#1e293b',
        bodyColor: darkMode ? '#e2e8f0' : '#1e293b',
        borderColor: darkMode ? 'rgba(71, 85, 105, 0.2)' : 'rgba(203, 213, 225, 0.2)',
        borderWidth: 1,
        padding: isExpanded ? 12 : 8,
        displayColors: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (tooltipItems) => {
            return `Day ${tooltipItems[0].label}`;
          },
          label: (context) => {
            return `Total Conversations: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: textColor,
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: isExpanded ? 31 : 8,
          font: {
            size: isExpanded ? 11 : 9
          }
        },
        title: {
          display: true,
          text: 'Day of Month',
          color: textColor,
          font: {
            size: isExpanded ? 14 : 10
          },
          padding: {
            top: 0,
            bottom: isExpanded ? 10 : 5
          }
        }
      },
      y: {
        grid: {
          color: gridColor
        },
        ticks: {
          color: textColor,
          precision: 0,
          font: {
            size: isExpanded ? 11 : 9
          }
        },
        title: {
          display: true,
          text: 'Number of Conversations',
          color: textColor,
          font: {
            size: isExpanded ? 14 : 10
          },
          padding: {
            top: 0,
            bottom: 0
          }
        },
        beginAtZero: true
      }
    },
    animation: {
      duration: 300
    },
    layout: {
      padding: {
        left: isExpanded ? 10 : 5,
        right: isExpanded ? 10 : 5,
        top: isExpanded ? 10 : 5,
        bottom: isExpanded ? 10 : 5
      }
    }
  };

  const handleMonthChange = (e) => {
    e.stopPropagation();
    setCurrentMonth(e.target.value);
  };

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    const months = Object.keys(data);
    const currentIndex = months.indexOf(currentMonth);
    const prevIndex = (currentIndex - 1 + months.length) % months.length;
    setCurrentMonth(months[prevIndex]);
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    const months = Object.keys(data);
    const currentIndex = months.indexOf(currentMonth);
    const nextIndex = (currentIndex + 1) % months.length;
    setCurrentMonth(months[nextIndex]);
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center h-full w-full p-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative" style={{ 
        width: '100%', 
        maxWidth: '100%', 
        height: isExpanded ? '400px' : '200px',
        margin: '0 auto',
        transition: 'all 0.3s ease-in-out'
      }}>
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="flex items-center justify-center mt-2 space-x-2 pb-2">
        <button 
          onClick={handlePrevMonth}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm"
        >
          &lt;
        </button>
        
        <select 
          value={currentMonth} 
          onChange={handleMonthChange}
          className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 text-sm"
        >
          {data && Object.keys(data).map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
        
        <button 
          onClick={handleNextMonth}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default DailyVolumeChartComponent; 