import React, { useState } from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  Collapse,
  CardActionArea,
  Tooltip,
  Zoom,
  Badge
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon, 
  Favorite as FavoriteIcon,
  LocalOffer as LocalOfferIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Estilizar el icono para que rote al expandir
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const MenuItem = ({ item, viewMode = 'customer', onEdit, onToggleVisibility }) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const isAdminMode = viewMode === 'admin';

  return (
    <Card 
      elevation={expanded ? 3 : 1} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        transform: expanded ? 'scale(1.02)' : 'scale(1)',
        position: 'relative',
        opacity: isAdminMode && !item.isVisible ? 0.7 : 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isAdminMode && !item.isVisible && (
        <Badge
          badgeContent="Oculto"
          color="warning"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1
          }}
        />
      )}

      <CardActionArea onClick={handleExpandClick}>
        {item.imageUrl && (
          <CardMedia
            component="img"
            height="140"
            image={item.imageUrl}
            alt={item.name}
            sx={{ objectFit: 'cover' }}
          />
        )}

        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="h6" component="h2" gutterBottom fontWeight="500">
              {item.name}
              {item.isNew && (
                <Chip 
                  label="Nuevo" 
                  color="secondary" 
                  size="small" 
                  sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                />
              )}
            </Typography>
            
            <Typography 
              variant="h6" 
              color="primary" 
              fontWeight="bold"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                ml: 1
              }}
            >
              {formatPrice(item.price)}
            </Typography>
          </Box>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              mb: 1 
            }}
          >
            {item.shortDescription || item.description}
          </Typography>

          {item.tags && item.tags.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {item.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  icon={<LocalOfferIcon fontSize="small" />}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
              {item.tags.length > 3 && (
                <Chip
                  icon={<InfoIcon fontSize="small" />}
                  label={`+${item.tags.length - 3}`}
                  size="small"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
            </Box>
          )}
        </CardContent>
      </CardActionArea>

      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2, 
          py: 1,
          borderTop: '1px solid',
          borderTopColor: 'divider'
        }}
      >
        {item.isPopular ? (
          <Tooltip title="Plato popular" arrow>
            <Chip
              icon={<FavoriteIcon fontSize="small" />}
              label="Popular"
              size="small"
              color="error"
              variant="outlined"
            />
          </Tooltip>
        ) : (
          <Box /> // Placeholder para mantener el espacio
        )}

        {isAdminMode && (
          <Box sx={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s' }}>
            <Tooltip title="Editar plato" TransitionComponent={Zoom}>
              <IconButton 
                size="small" 
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEdit) onEdit(item.id);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip 
              title={item.isVisible ? "Ocultar plato" : "Mostrar plato"} 
              TransitionComponent={Zoom}
            >
              <IconButton 
                size="small" 
                color={item.isVisible ? "default" : "warning"}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleVisibility) onToggleVisibility(item.id);
                }}
              >
                {item.isVisible ? (
                  <VisibilityIcon fontSize="small" />
                ) : (
                  <VisibilityOffIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        )}

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="mostrar más"
          size="small"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          {item.description && (
            <>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Descripción
              </Typography>
              <Typography variant="body2" paragraph>
                {item.description}
              </Typography>
            </>
          )}

          {item.ingredients && item.ingredients.length > 0 && (
            <>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Ingredientes
              </Typography>
              <Typography variant="body2" paragraph>
                {item.ingredients.join(', ')}
              </Typography>
            </>
          )}

          {item.allergens && item.allergens.length > 0 && (
            <>
              <Typography variant="subtitle2" fontWeight="bold" color="warning.main" gutterBottom>
                Alérgenos
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {item.allergens.map((allergen, index) => (
                  <Chip
                    key={index}
                    label={allergen}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                ))}
              </Box>
            </>
          )}

          {item.nutritionalInfo && (
            <>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2 }} gutterBottom>
                Información nutricional
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(item.nutritionalInfo).map(([key, value]) => (
                  <Chip
                    key={key}
                    label={`${key}: ${value}`}
                    size="small"
                    variant="outlined"
                    color="info"
                  />
                ))}
              </Box>
            </>
          )}
          
          {item.notes && (
            <>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2 }} gutterBottom>
                Notas adicionales
              </Typography>
              <Typography variant="body2">
                {item.notes}
              </Typography>
            </>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default MenuItem;