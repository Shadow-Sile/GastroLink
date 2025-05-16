import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserMenus, deleteMenu } from '../../services/menuService';
import '../../styles/components/menu-list.css';
import { FaEdit, FaTrash, FaQrcode, FaEye } from 'react-icons/fa';

const MenuList = () => {
  const { currentUser } = useAuth();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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

  const handleDeleteClick = (menuId) => {
    setDeleteConfirm(menuId);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const handleDeleteConfirm = async (menuId) => {
    try {
      const { success, error } = await deleteMenu(menuId);
      
      if (error) {
        setError('Error al eliminar el menú');
      } else {
      
        setMenus(menus.filter(menu => menu.id !== menuId));
      }
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo más tarde.');
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (loading) {
    return <div className="loading">Cargando menús...</div>;
  }

  return (
    <div className="menu-list">
      <div className="menu-list-header">
        <h2>Mis Menús</h2>
        <Link to="/dashboard/menus/new" className="create-menu-button">
          Crear Menú
        </Link>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {menus.length === 0 ? (
        <div className="no-menus">
          <p>Aún no has creado ningún menú.</p>
          <Link to="/dashboard/menus/new" className="create-menu-button">
            Crear tu primer menú
          </Link>
        </div>
      ) : (
        <div className="menus-table-container">
          <table className="menus-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categorías</th>
                <th>Platos</th>
                <th>Estado</th>
                <th>Fecha de creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {menus.map(menu => (
                <tr key={menu.id}>
                  <td>{menu.name}</td>
                  <td>{menu.categories?.length || 0}</td>
                  <td>
                    {menu.categories?.reduce((acc, cat) => acc + (cat.items?.length || 0), 0) || 0}
                  </td>
                  <td>
                    <span className={`status ${menu.active !== false ? 'active' : 'inactive'}`}>
                      {menu.active !== false ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    {menu.createdAt ? new Date(menu.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="actions-cell">
                    <div className="menu-actions">
                      <Link to={`/dashboard/menus/${menu.id}`} className="action-button edit" title="Editar">
                        <FaEdit />
                      </Link>
                      <Link to={`/menu/${menu.qrCodeId}`} target="_blank" className="action-button view" title="Vista previa">
                        <FaEye />
                      </Link>
                      <Link to={`/dashboard/menus/${menu.id}/qr`} className="action-button qr" title="Código QR">
                        <FaQrcode />
                      </Link>
                      <button 
                        className="action-button delete" 
                        onClick={() => handleDeleteClick(menu.id)}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    
                    {deleteConfirm === menu.id && (
                      <div className="delete-confirm-dialog">
                        <p>¿Seguro que quieres eliminar este menú?</p>
                        <div className="delete-actions">
                          <button 
                            className="cancel-button" 
                            onClick={handleDeleteCancel}
                          >
                            Cancelar
                          </button>
                          <button 
                            className="confirm-button" 
                            onClick={() => handleDeleteConfirm(menu.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MenuList;