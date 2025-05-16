import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { saveCategory, getCategoryById } from '../services/MenuService';

const CategoryForm = () => {
  const { menuId, categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: '',
    description: '',
    order: 0
  });
  const [loading, setLoading] = useState(false);
  const isEditMode = !!categoryId;

  useEffect(() => {
    const loadCategory = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const categoryData = await getCategoryById(menuId, categoryId);
          if (categoryData) {
            setCategory(categoryData);
          }
        } catch (error) {
          console.error('Error loading category:', error);
          toast.error('No se pudo cargar la categoría');
        } finally {
          setLoading(false);
        }
      }
    };

    loadCategory();
  }, [menuId, categoryId, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory(prevCategory => ({
      ...prevCategory,
      [name]: name === 'order' ? parseInt(value, 10) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.name) {
      toast.error('El nombre de la categoría es obligatorio');
      return;
    }

    try {
      setLoading(true);
      await saveCategory(menuId, category, categoryId);
      toast.success(`Categoría ${isEditMode ? 'actualizada' : 'creada'} correctamente`);
      navigate(`/menus/${menuId}/edit`);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} la categoría`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Editar Categoría' : 'Crear Nueva Categoría'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nombre de la Categoría"
            name="name"
            value={category.name}
            onChange={handleChange}
            autoFocus
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Descripción"
            name="description"
            value={category.description}
            onChange={handleChange}
            multiline
            rows={2}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="order-label">Orden</InputLabel>
            <Select
              labelId="order-label"
              id="order"
              name="order"
              value={category.order}
              label="Orden"
              onChange={handleChange}
            >
              {[...Array(20).keys()].map(number => (
                <MenuItem key={number} value={number}>{number}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/menus/${menuId}/edit`)}
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

export default CategoryForm;