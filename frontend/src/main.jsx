import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'

console.log('main.jsx executing');

try {
  console.log('Attempting to render React app');
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found!');
  } else {
    console.log('Root element found, creating React root');
    const root = ReactDOM.createRoot(rootElement);
    
    console.log('Rendering App component');
    root.render(
      <React.StrictMode>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </React.StrictMode>
    );
    console.log('App rendered successfully');
  }
} catch (error) {
  console.error('Error rendering React app:', error);
  // Display a fallback UI
  document.body.innerHTML = `
    <div style="padding: 20px; margin: 20px; border: 1px solid red; border-radius: 5px">
      <h2>Failed to load the application</h2>
      <p>Error: ${error.message}</p>
      <button onclick="window.location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer">
        Reload Page
      </button>
    </div>
  `;
}
