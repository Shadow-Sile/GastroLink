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
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment
} from '@mui/material';
import { saveMenuItem, getMenuItemById, getCategories } from '../services/MenuService';

const ItemForm = () => {
  const { menuId, categoryId, itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: categoryId || '',
    available: true,
    featured: false,
    order: 0,
    imageUrl: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditMode = !!itemId;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load categories
        const categoriesData = await getCategories(menuId);
        setCategories(categoriesData);

        // If edit mode, load item data
        if (isEditMode) {
          const itemData = await getMenuItemById(menuId, categoryId, itemId);
          if (itemData) {
            setItem({
              ...itemData,
              price: itemData.price ? itemData.price.toString() : ''
            });
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [menuId, categoryId, itemId, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setItem(prevItem => ({
      ...prevItem,
      [name]: type === 'checkbox' ? checked : 
              name === 'order' ? parseInt(value, 10) || 0 : 
              value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.name || !item.categoryId) {
      toast.error('Nombre del plato y categoría son obligatorios');
      return;
    }

    // Format price before saving
    const formattedItem = {
      ...item,
      price: item.price ? parseFloat(item.price) : null
    };

    try {
      setLoading(true);
      await saveMenuItem(menuId, formattedItem, itemId);
      toast.success(`Plato ${isEditMode ? 'actualizado' : 'creado'} correctamente`);
      navigate(`/menus/${menuId}/edit`);
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} el plato`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <Typography>Cargando datos...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Editar Plato' : 'Añadir Nuevo Plato'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nombre del Plato"
            name="name"
            value={item.name}
            onChange={handleChange}
            autoFocus
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="category-label">Categoría</InputLabel>
            <Select
              labelId="category-label"
              id="categoryId"
              name="categoryId"
              value={item.categoryId}
              label="Categoría"
              onChange={handleChange}
            >
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Descripción"
            name="description"
            value={item.description}
            onChange={handleChange}
            multiline
            rows={3}
          />

          <TextField
            margin="normal"
            fullWidth
            id="price"
            label="Precio"
            name="price"
            type="number"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            value={item.price}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            fullWidth
            id="imageUrl"
            label="URL de la imagen (opcional)"
            name="imageUrl"
            value={item.imageUrl}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="order-label">Orden</InputLabel>
            <Select
              labelId="order-label"
              id="order"
              name="order"
              value={item.order}
              label="Orden"
              onChange={handleChange}
            >
              {[...Array(20).keys()].map(number => (
                <MenuItem key={number} value={number}>{number}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={item.available}
                  onChange={handleChange}
                  name="available"
                />
              }
              label="Disponible"
            />
          </Box>

          <Box sx={{ mt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={item.featured}
                  onChange={handleChange}
                  name="featured"
                />
              }
              label="Destacado"
            />
          </Box>
          
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

export default ItemForm;