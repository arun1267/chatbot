import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  console.log('Layout component rendering');
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    console.log('Layout useEffect running - checking authentication');
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    console.log('Is authenticated in Layout:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('User is not authenticated, redirecting to login');
      navigate('/login');
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div 
        className={`flex-1 transition-all duration-150 ease-in-out overflow-auto ${sidebarOpen ? 'ml-64' : 'ml-16'}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout; 