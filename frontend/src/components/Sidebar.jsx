import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { ConversationContext } from '../context/ConversationContext';
import { IoMdClose } from 'react-icons/io';
import { HiOutlineMenu } from "react-icons/hi";

// Icons (you can replace these with actual icons)
const DashboardIcon = () => <span className="text-xl">📊</span>;
const ConversationsIcon = () => <span className="text-xl">💬</span>;
const SettingsIcon = () => <span className="text-xl">⚙️</span>;
const LogoutIcon = () => <span className="text-xl">🚪</span>;

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { darkMode } = useContext(ThemeContext);
  const { selectConversationByIndex } = useContext(ConversationContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleConversationInsightsClick = (e) => {
    e.preventDefault();
    // Select the first conversation by default
    selectConversationByIndex(0);
    navigate('/conversation-insights?index=0', { replace: true });
  };

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      path: '/conversation-insights',
      name: 'Conversation Insights',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      onClick: handleConversationInsightsClick
    },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    } else if (path === '/conversation-insights') {
      return location.pathname.startsWith(path);
    }
    return location.pathname === path;
  };

  return (
    <div
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-100 ease-in-out ${
        isOpen ? 'w-64' : 'w-[5%]'
      } shadow-xl`}
      style={{ 
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)'
      }}
    >
      <div className="p-4 h-full flex flex-col">
        <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} mb-6 w-full`}>
          {isOpen && (
            <div className="flex items-center">
              <span className="font-bold text-lg">Chatbot Factory Analytics</span>
            </div>
          )}
          
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-0 rounded-md bg-opacity-0"
              style={{ 
                color: 'var(--color-text-primary)',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                padding: '0',
                margin: '0'
              }}
            >
              {isOpen ? (
                <HiOutlineMenu className="h-6 w-6" />
              ) : (
                <HiOutlineMenu 
                  className="h-6 w-6" 
                  color={darkMode ? 'white' : 'black'} 
                />
              )}
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-hidden">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index} className={isOpen ? "" : "flex justify-center"}>
                {item.onClick ? (
                  <a
                    href={item.path}
                    onClick={item.onClick}
                    className={`flex items-center p-3 rounded-md transition-colors ${
                      isActive(item.path) ? 'font-medium' : 'hover:bg-opacity-10 hover:bg-gray-500'
                    } ${isOpen ? '' : 'justify-center'}`}
                    style={{ 
                      backgroundColor: isActive(item.path) ? (darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(156, 39, 176, 0.1)') : 'transparent',
                      color: isActive(item.path) ? 'var(--color-gradient-primary)' : 'var(--color-text-primary)'
                    }}
                  >
                    <span className={isOpen ? "mr-3" : ""}>{item.icon}</span>
                    {isOpen && (
                      <span className="whitespace-nowrap">{item.name}</span>
                    )}
                  </a>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-md transition-colors ${
                      isActive(item.path) ? 'font-medium' : 'hover:bg-opacity-10 hover:bg-gray-500'
                    } ${isOpen ? '' : 'justify-center'}`}
                    style={{ 
                      backgroundColor: isActive(item.path) ? (darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(156, 39, 176, 0.1)') : 'transparent',
                      color: isActive(item.path) ? 'var(--color-gradient-primary)' : 'var(--color-text-primary)'
                    }}
                  >
                    <span className={isOpen ? "mr-3" : ""}>{item.icon}</span>
                    {isOpen && (
                      <span className="whitespace-nowrap">{item.name}</span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {isOpen && (
          <div className="mt-auto pt-4 border-t" style={{ borderColor: darkMode ? '#2d3748' : '#e2e8f0' }}>
            <p className="text-sm opacity-70">© 2025 Chatbot Factory</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 