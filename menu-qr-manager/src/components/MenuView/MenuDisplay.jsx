import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Container, 
  Paper, 
  CircularProgress,
  Fade, 
  Chip,
  Alert, 
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { RestaurantMenu as MenuIcon } from '@mui/icons-material';
import CategoryList from './CategoryList';
import MenuItem from './MenuItem';

const MenuDisplay = ({ menu, loading = false, error = null, viewMode = 'customer' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [animateItems, setAnimateItems] = useState(false);

  // Procesar el menú para extraer categorías e items
  useEffect(() => {
    if (menu && menu.categories) {
      const categoriesWithCount = menu.categories.map(cat => ({
        ...cat,
        itemCount: (menu.items || []).filter(item => item.categoryId === cat.id).length
      }));
      
      setCategories(categoriesWithCount);
      
      // Establecer la primera categoría como activa si no hay ninguna seleccionada
      if (!activeCategory && categoriesWithCount.length > 0) {
        setActiveCategory(categoriesWithCount[0].id);
      }
    }
  }, [menu, activeCategory]);

  // Filtrar items por categoría activa
  useEffect(() => {
    if (menu && menu.items && activeCategory) {
      setAnimateItems(false);
      // Pequeño retraso para la animación
      setTimeout(() => {
        const items = menu.items.filter(item => item.categoryId === activeCategory);
        setFilteredItems(items);
        setAnimateItems(true);
      }, 300);
    } else {
      setFilteredItems([]);
    }
  }, [activeCategory, menu]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Box>
    );
  }

  // Si no hay menú, mostrar mensaje
  if (!menu) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          No se encontró el menú solicitado.
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Cabecera del menú */}
      <Box 
        sx={{ 
          mb: 4, 
          textAlign: 'center',
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${menu.coverImage || '/default-menu-bg.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          p: 5,
          borderRadius: 2,
          color: 'white'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 2
          }}
        >
          <MenuIcon sx={{ mr: 1, fontSize: 40 }} />
          <Typography variant="h3" component="h1" fontWeight="bold">
            {menu.name}
          </Typography>
        </Box>
        
        {menu.description && (
          <Typography variant="h6" sx={{ maxWidth: '800px', mx: 'auto', mb: 2, fontStyle: 'italic' }}>
            {menu.description}
          </Typography>
        )}
        
        {menu.tags && menu.tags.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {menu.tags.map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                variant="outlined" 
                sx={{ m: 0.5, borderColor: 'white', color: 'white' }} 
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Contenido principal del menú */}
      <Grid container spacing={3}>
        {/* Lista de categorías */}
        <Grid item xs={12} md={3}>
          <CategoryList 
            categories={categories} 
            activeCategory={activeCategory}
            onSelectCategory={handleCategoryChange}
            loading={loading}
          />
        </Grid>
        
        {/* Lista de platos */}
        <Grid item xs={12} md={9}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              minHeight: '70vh'
            }}
          >
            {categories.length > 0 ? (
              <>
                {/* Título de la categoría actual */}
                {activeCategory && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">
                      {categories.find(cat => cat.id === activeCategory)?.name || 'Categoría'}
                    </Typography>
                    <Divider sx={{ mt: 1 }} />
                  </Box>
                )}
                
                {/* Items */}
                <Grid container spacing={2}>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <Fade 
                        in={animateItems} 
                        key={item.id}
                        style={{ 
                          transitionDelay: `${index * 100}ms`,
                          transitionDuration: '0.4s'
                        }}
                      >
                        <Grid item xs={12} sm={6} md={isMobile ? 12 : 6} lg={4}>
                          <MenuItem 
                            item={item} 
                            viewMode={viewMode}
                          />
                        </Grid>
                      </Fade>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Box 
                        sx={{ 
                          p: 4, 
                          textAlign: 'center',
                          bgcolor: 'background.default',
                          borderRadius: 1
                        }}
                      >
                        <Typography color="text.secondary">
                          No hay elementos en esta categoría.
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </>
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '50vh'
                }}
              >
                <MenuIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Este menú aún no tiene categorías o elementos.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MenuDisplay;