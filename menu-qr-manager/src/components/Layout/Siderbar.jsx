import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/sidebar.css';

// Importar iconos (suponiendo que estamos usando react-icons)
import { FaTachometerAlt, FaList, FaPlus, FaQrcode, FaUser, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  const { userData } = useAuth();
  
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>MenuQR</h2>
        <p className="user-name">{userData?.displayName || 'Usuario'}</p>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? 'active' : ''}
              end
            >
              <FaTachometerAlt /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard/menus" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <FaList /> Mis Menús
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard/menus/new" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <FaPlus /> Crear Menú
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard/qrcodes" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <FaQrcode /> Códigos QR
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard/profile" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <FaUser /> Perfil
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard/settings" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <FaCog /> Configuración
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
