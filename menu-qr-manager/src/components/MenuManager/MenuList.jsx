import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMenus, deleteMenu, toggleMenuActive } from '../services/MenuService';
import { 
  Box, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Grid, 
  IconButton, 
  Switch, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton
} from '@mui/material';
import { Edit, Delete, Visibility, QrCode } from '@mui/icons-material';
import { toast } from 'react-toastify';

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const data = await getMenus();
      setMenus(data);
    } catch (error) {
      console.error('Error loading menus:', error);
      toast.error('Error al cargar los menús');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (menu) => {
    try {
      await toggleMenuActive(menu.id, !menu.active);
      setMenus(menus.map(m => 
        m.id === menu.id ? { ...m, active: !m.active } : m
      ));
      toast.success(`Menú ${!menu.active ? 'activado' : 'desactivado'} correctamente`);
    } catch (error) {
      console.error('Error toggling menu status:', error);
      toast.error('Error al cambiar el estado del menú');
    }
  };

  const openDeleteDialog = (menu) => {
    setMenuToDelete(menu);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setMenuToDelete(null);
  };

  const confirmDelete = async () => {
    if (!menuToDelete) return;
    
    try {
      await deleteMenu(menuToDelete.id);
      setMenus(menus.filter(menu => menu.id !== menuToDelete.id));
      toast.success('Menú eliminado correctamente');
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error('Error al eliminar el menú');
    } finally {
      closeDeleteDialog();
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h2">
          Tus Menús
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/menus/new"
        >
          Crear Nuevo Menú
        </Button>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} md={4} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
                <CardActions>
                  <Skeleton variant="rectangular" width={180} height={36} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : menus.length === 0 ? (
        <Box textAlign="center" my={5}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No tienes menús creados
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/menus/new" 
            sx={{ mt: 2 }}
          >
            Crear tu primer menú
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {menus.map((menu) => (
            <Grid item xs={12} sm={6} md={4} key={menu.id}>
              <Card 
                variant="outlined" 
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: menu.active ? 1 : 0.7
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {menu.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {menu.restaurantName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {menu.description || 'Sin descripción'}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Typography variant="body2" mr={1}>
                      {menu.active ? 'Activo' : 'Inactivo'}
                    </Typography>
                    <Switch
                      checked={menu.active}
                      onChange={() => handleToggleActive(menu)}
                      size="small"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <IconButton 
                    component={Link} 
                    to={`/menus/${menu.id}/edit`} 
                    title="Editar menú"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    component={Link} 
                    to={`/menus/${menu.id}`} 
                    title="Ver menú"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton 
                    component={Link} 
                    to={`/menus/${menu.id}/qr`} 
                    title="Generar código QR"
                  >
                    <QrCode />
                  </IconButton>
                  <IconButton 
                    onClick={() => openDeleteDialog(menu)} 
                    color="error"
                    title="Eliminar menú"
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el menú "{menuToDelete?.name}"? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuList;