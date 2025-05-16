import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/authService';
import '../../styles/components/header.css';

const Header = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { success, error } = await logoutUser();
    if (success) {
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>MenuQR</h1>
          </Link>
        </div>
        
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Inicio</Link></li>
            {currentUser ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li className="user-menu">
                  <span className="user-name">
                    {userData?.displayName || currentUser.email}
                  </span>
                  <button className="logout-button" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login">Iniciar Sesión</Link></li>
                <li><Link to="/register" className="register-link">Registrarse</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;