import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="container header__container">
          <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
            <img src="/images/logo.png" alt="NSNexus" style={{ height: '32px', width: '32px', objectFit: 'contain', borderRadius: '6px' }} />
            <span>NSNexus</span>
          </Link>
          
          <nav className="nav">
            <ul className="nav__list">
              <li>
                <NavLink to="/" className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}>
                  Início
                </NavLink>
              </li>
              <li>
                <NavLink to="/cursos" className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}>
                  Cursos
                </NavLink>
              </li>
              <li>
                <NavLink to="/biblioteca-prompts" className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}>
                  Prompts
                </NavLink>
              </li>
              <li>
                <NavLink to="/servicos" className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}>
                  Consultoria
                </NavLink>
              </li>
              <li>
                <NavLink to="/sobre" className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}>
                  Sobre
                </NavLink>
              </li>
            </ul>
          </nav>
          
          <div className="header__actions">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn btn-sm btn-primary" style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))', border: 'none', color: 'white' }}>
                    Admin
                  </Link>
                )}
                <Link to="/dashboard" className="btn btn-sm btn-outline">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn btn-sm btn-ghost">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-ghost">
                  Entrar
                </Link>
                <Link to="/cursos" className="btn btn-sm btn-primary">
                  Começar
                </Link>
              </>
            )}
            <div className={`menu-toggle ${mobileMenuOpen ? 'menu-toggle--active' : ''}`} id="mobile-menu-toggle" onClick={toggleMobileMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'mobile-nav--open' : ''}`} id="mobile-nav-drawer">
        <ul className="mobile-nav__list">
          <li>
            <Link to="/" className="mobile-nav__link" onClick={toggleMobileMenu}>Início</Link>
          </li>
          <li>
            <Link to="/cursos" className="mobile-nav__link" onClick={toggleMobileMenu}>Cursos</Link>
          </li>
          <li>
            <Link to="/biblioteca-prompts" className="mobile-nav__link" onClick={toggleMobileMenu}>Prompts</Link>
          </li>
          <li>
            <Link to="/servicos" className="mobile-nav__link" onClick={toggleMobileMenu}>Consultoria</Link>
          </li>
          <li>
            <Link to="/sobre" className="mobile-nav__link" onClick={toggleMobileMenu}>Sobre</Link>
          </li>
        </ul>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'auto' }}>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-primary btn-full" style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))', border: 'none', color: 'white' }} onClick={toggleMobileMenu}>
                  Painel Admin
                </Link>
              )}
              <Link to="/dashboard" className="btn btn-outline btn-full" onClick={toggleMobileMenu}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-full">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-full" onClick={toggleMobileMenu}>
                Entrar
              </Link>
              <Link to="/cursos" className="btn btn-primary btn-full" onClick={toggleMobileMenu}>
                Matricule-se
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      <div className={`mobile-overlay ${mobileMenuOpen ? 'mobile-overlay--active' : ''}`} id="mobile-nav-overlay" onClick={toggleMobileMenu}></div>
    </>
  );
};
export default Navbar;
