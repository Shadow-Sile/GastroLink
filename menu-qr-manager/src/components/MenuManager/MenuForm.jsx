import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { saveMenu, getMenuById } from '../services/MenuService';
import { Box, Button, TextField, Typography, Paper, Container } from '@mui/material';

const MenuForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState({
    name: '',
    description: '',
    restaurantName: '',
    active: true
  });
  const [loading, setLoading] = useState(false);
  const isEditMode = !!id;

  useEffect(() => {
    const loadMenu = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const menuData = await getMenuById(id);
          if (menuData) {
            setMenu(menuData);
          }
        } catch (error) {
          console.error('Error loading menu:', error);
          toast.error('No se pudo cargar el menú');
        } finally {
          setLoading(false);
        }
      }
    };

    loadMenu();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu(prevMenu => ({
      ...prevMenu,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!menu.name || !menu.restaurantName) {
      toast.error('Nombre del menú y del restaurante son obligatorios');
      return;
    }

    try {
      setLoading(true);
      await saveMenu(menu, id);
      toast.success(`Menú ${isEditMode ? 'actualizado' : 'creado'} correctamente`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving menu:', error);
      toast.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} el menú`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <Typography>Cargando menú...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Editar Menú' : 'Crear Nuevo Menú'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nombre del Menú"
            name="name"
            value={menu.name}
            onChange={handleChange}
            autoFocus
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="restaurantName"
            label="Nombre del Restaurante"
            name="restaurantName"
            value={menu.restaurantName}
            onChange={handleChange}
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Descripción"
            name="description"
            value={menu.description}
            onChange={handleChange}
            multiline
            rows={4}
          />
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default MenuForm;