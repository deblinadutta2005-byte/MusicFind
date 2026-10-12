import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ConnectionProvider } from './context/ConnectionContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { AppRoutes } from './routes/AppRoutes';
import './App.css';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConnectionProvider>
          <div className="app-shell">
            <Navbar />
            <main className="main-content">
              <AppRoutes />
            </main>
            <Footer />
            <Toast />
          </div>
        </ConnectionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
