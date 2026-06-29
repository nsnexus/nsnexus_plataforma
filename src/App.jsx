import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Cursos from './pages/Cursos';
import CursoDetalhe from './pages/CursoDetalhe';
import Player from './pages/Player';
import Dashboard from './pages/Dashboard';
import BibliotecaPrompts from './pages/BibliotecaPrompts';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Admin from './pages/Admin';
import Servicos from './pages/Servicos';
import Sobre from './pages/Sobre';
import Termos from './pages/Termos';

// Global Stylesheets
import './assets/styles/variables.css';
import './assets/styles/base.css';
import './assets/styles/components.css';
import './assets/styles/layout.css';
import './assets/styles/hero.css';
import './assets/styles/animations.css';
import './assets/styles/responsive.css';

// Inner layout component to conditionally render Header/Footer
const AppLayout = () => {
  const location = useLocation();
  const showHeaderFooter = !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/player');

  return (
    <>
      {showHeaderFooter && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/curso/:id" element={<CursoDetalhe />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Protected Student Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/player/:courseId/:lessonId" 
          element={
            <ProtectedRoute>
              <Player />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/biblioteca-prompts" 
          element={
            <ProtectedRoute>
              <BibliotecaPrompts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout/:courseId" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />

        {/* Fallback to Home */}
        <Route path="*" element={<Home />} />
      </Routes>
      {showHeaderFooter && <Footer />}
    </>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
};

export default App;
