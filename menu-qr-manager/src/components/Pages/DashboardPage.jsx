import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  IconButton, 
  CircularProgress, 
  Divider, 
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Add as AddIcon, 
  Restaurant as RestaurantIcon, 
  QrCode as QrCodeIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  BarChart as BarChartIcon,
  Menu as MenuIcon,
  ContentCopy as CopyIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAllMenus, deleteMenu, duplicateMenu } from '../services/MenuService';
import { auth } from '../services/firebase';

const DashboardPage = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const userId = auth.currentUser?.uid;
        if (!userId) {
          navigate('/login');
          return;
        }
        
        const menusData = await getAllMenus(userId);
        setMenus(menusData);
      } catch (err) {
        console.error("Error fetching menus:", err);
        setError("No se pudieron cargar los menús. Por favor, inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [navigate]);

  const handleCreateMenu = () => {
    navigate('/menu/new');
  };

  const handleEditMenu = (menuId) => {
    navigate(`/menu/edit/${menuId}`);
  };

  const handleViewMenu = (menuId) => {
    navigate(`/menu/${menuId}`);
  };

  const handleGenerateQR = (menuId) => {
    navigate(`/menu/${menuId}/qr`);
  };

  const openDeleteConfirm = (menu) => {
    setMenuToDelete(menu);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setMenuToDelete(null);
  };

  const confirmDelete = async () => {
    if (!menuToDelete) return;
    
    try {
      await deleteMenu(menuToDelete.id);
      setMenus(menus.filter(menu => menu.id !== menuToDelete.id));
      showNotification(`El menú "${menuToDelete.name}" ha sido eliminado`, 'success');
    } catch (err) {
      console.error("Error deleting menu:", err);
      showNotification(`Error al eliminar el menú: ${err.message}`, 'error');
    } finally {
      closeDeleteConfirm();
    }
  };

  const handleDuplicateMenu = async (menuId) => {
    try {
      setLoading(true);
      const duplicatedMenu = await duplicateMenu(menuId);
      setMenus([...menus, duplicatedMenu]);
      showNotification('Menú duplicado correctamente', 'success');
    } catch (err) {
      console.error("Error duplicating menu:", err);
      showNotification(`Error al duplicar el menú: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleShareMenu = (menuId) => {
    const shareUrl = `${window.location.origin}/menu/${menuId}`;
    navigator.clipboard.writeText(shareUrl);
    showNotification('Enlace copiado al portapapeles', 'success');
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Función para formatear la fecha
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha desconocida';
    
    const date = timestamp instanceof Date 
      ? timestamp 
      : new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp);
    
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Panel de Control
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateMenu}
        >
          Crear Nuevo Menú
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          <MenuIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Mis Menús
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : menus.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <RestaurantIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aún no tienes menús
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Crea tu primer menú para comenzar a compartirlo con tus clientes.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateMenu}
            >
              Crear Menú
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {menus.map((menu) => (
              <Grid item xs={12} sm={6} md={4} key={menu.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <Box 
                    sx={{ 
                      height: 120, 
                      background: menu.coverImage
                        ? `url(${menu.coverImage})`
                        : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}
                  >
                    {menu.published ? (
                      <Chip
                        label="Publicado"
                        color="success"
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      />
                    ) : (
                      <Chip
                        label="Borrador"
                        color="default"
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      />
                    )}
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {menu.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {menu.description 
                        ? (menu.description.length > 80 
                            ? `${menu.description.substring(0, 80)}...` 
                            : menu.description)
                        : 'Sin descripción'}
                    </Typography>
                    
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                        Creado:
                      </Typography>
                      <Typography variant="caption" fontWeight="medium">
                        {formatDate(menu.createdAt)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                        Actualizado:
                      </Typography>
                      <Typography variant="caption" fontWeight="medium">
                        {formatDate(menu.updatedAt)}
                      </Typography>
                    </Box>
                    
                    {menu.categories && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          {menu.categories.length} categorías • {menu.itemCount || 0} platos
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Box>
                      <Tooltip title="Editar menú">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditMenu(menu.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Ver menú">
                        <IconButton 
                          size="small"
                          onClick={() => handleViewMenu(menu.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Generar QR">
                        <IconButton 
                          size="small" 
                          color="secondary"
                          onClick={() => handleGenerateQR(menu.id)}
                        >
                          <QrCodeIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Box>
                      <Tooltip title="Compartir">
                        <IconButton 
                          size="small"
                          onClick={() => handleShareMenu(menu.id)}
                        >
                          <ShareIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    
                      <Tooltip title="Duplicar menú">
                        <IconButton 
                          size="small"
                          onClick={() => handleDuplicateMenu(menu.id)}
                        >
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    
                      <Tooltip title="Eliminar menú">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => openDeleteConfirm(menu)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={closeDeleteConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          ¿Eliminar menú?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar el menú "{menuToDelete?.name}"? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirm} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DashboardPage;