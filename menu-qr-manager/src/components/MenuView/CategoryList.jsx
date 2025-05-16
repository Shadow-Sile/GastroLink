import React, { useEffect, useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemButton, 
  Divider, 
  Typography, 
  Box,
  Skeleton,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Restaurant as RestaurantIcon } from '@mui/icons-material';

const CategoryList = ({ categories, activeCategory, onSelectCategory, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Si está cargando, muestra esqueletos de carga
  if (loading) {
    return (
      <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, p: 1 }}>
        <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
          Categorías
        </Typography>
        <Divider />
        {[...Array(5)].map((_, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <Skeleton variant="rectangular" width="100%" height={40} />
            </ListItem>
            {index < 4 && <Divider />}
          </React.Fragment>
        ))}
      </Box>
    );
  }

  // Si no hay categorías, muestra un mensaje
  if (!categories || categories.length === 0) {
    return (
      <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, p: 1 }}>
        <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
          Categorías
        </Typography>
        <Divider />
        <ListItem>
          <ListItemText 
            primary="No hay categorías disponibles" 
            secondary="Este menú aún no tiene categorías definidas."
          />
        </ListItem>
      </Box>
    );
  }

  // Si hay categorías, muestra la lista normal
  return (
    <Box 
      sx={{ 
        width: '100%', 
        bgcolor: 'background.paper', 
        borderRadius: 1,
        boxShadow: 1,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)'
      }}
    >
      <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
        Categorías
      </Typography>
      <Divider />
      <List 
        component="nav" 
        aria-label="menu categories"
        sx={{
          p: 0,
          maxHeight: isMobile ? 'auto' : '70vh',
          overflowY: isMobile ? 'hidden' : 'auto'
        }}
      >
        {categories.map((category, index) => (
          <React.Fragment key={category.id}>
            <ListItemButton
              selected={activeCategory === category.id}
              sx={{
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  }
                },
                py: 1.5
              }}
              onClick={() => onSelectCategory(category.id)}
            >
              <ListItemText 
                primary={
                  <Box display="flex" alignItems="center">
                    <RestaurantIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                    <Typography variant="body1" fontWeight={activeCategory === category.id ? 'bold' : 'normal'}>
                      {category.name}
                    </Typography>
                  </Box>
                }
              />
              <Badge 
                badgeContent={category.itemCount || 0} 
                color="primary"
                sx={{ ml: 1 }}
              />
            </ListItemButton>
            {index < categories.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default CategoryList;