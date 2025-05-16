import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserMenus } from '../../services/menuService';
import StatsCard from './StatsCard';
import '../../styles/components/dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      if (!currentUser) return;
      
      try {
        const { menus, error } = await getUserMenus(currentUser.uid);
        
        if (error) {
          setError('Error al cargar tus menús');
        } else {
          setMenus(menus);
        }
      } catch (err) {
        setError('Error inesperado. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [currentUser]);

  // Calcular estadísticas básicas
  const totalMenus = menus.length;
  const activeMenus = menus.filter(menu => menu.active !== false).length;
  const totalCategories = menus.reduce((acc, menu) => acc + (menu.categories?.length || 0), 0);
  const totalItems = menus.reduce((acc, menu) => {
    return acc + (menu.categories?.reduce((itemAcc, cat) => itemAcc + (cat.items?.length || 0), 0) || 0);
  }, 0);

  if (loading) {
    return <div className="dashboard-loading">Cargando dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="stats-container">
        <StatsCard title="Total Menús" value={totalMenus} icon="menu" />
        <StatsCard title="Menús Activos" value={activeMenus} icon="active" />
        <StatsCard title="Categorías" value={totalCategories} icon="category" />
        <StatsCard title="Platos" value={totalItems} icon="dish" />
      </div>
      
      <section className="recent-activity">
        <h2>Actividad Reciente</h2>
        
        {menus.length === 0 ? (
          <div className="no-menus">
            <p>Aún no has creado ningún menú.</p>
            <a href="/dashboard/menus/new" className="create-menu-button">
              Crear tu primer menú
            </a>
          </div>
        ) : (
          <div className="menus-preview">
            <h3>Tus menús ({menus.length})</h3>
            <div className="menus-grid">
              {menus.slice(0, 4).map(menu => (
                <div key={menu.id} className="menu-preview-card">
                  <h4>{menu.name}</h4>
                  <p>{menu.description || 'Sin descripción'}</p>
                  <div className="menu-stats">
                    <span>{menu.categories?.length || 0} categorías</span>
                    <span>
                      {menu.categories?.reduce((acc, cat) => acc + (cat.items?.length || 0), 0) || 0} platos
                    </span>
                  </div>
                  <a href={`/dashboard/menus/${menu.id}`} className="view-menu-button">
                    Ver Detalles
                  </a>
                </div>
              ))}
            </div>
            
            {menus.length > 4 && (
              <a href="/dashboard/menus" className="view-all-link">
                Ver todos los menús
              </a>
            )}
          </div>
        )}
      </section>
      
      <section className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <a href="/dashboard/menus/new" className="action-card">
            <div className="action-icon">+</div>
            <h3>Crear Menú</h3>
            <p>Crea un nuevo menú digital para tu restaurante</p>
          </a>
          
          <a href="/dashboard/qrcodes" className="action-card">
            <div className="action-icon">QR</div>
            <h3>Gestionar QR</h3>
            <p>Administra tus códigos QR dinámicos</p>
          </a>
          
          <a href="/dashboard/profile" className="action-card">
            <div className="action-icon">⚙️</div>
            <h3>Perfil</h3>
            <p>Actualiza la información de tu restaurante</p>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;