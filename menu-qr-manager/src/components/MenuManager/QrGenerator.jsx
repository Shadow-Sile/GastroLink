import React, { useState, useEffect } from 'react';
import { Button, Card, TextField, CircularProgress, Snackbar, Alert, Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import QRCode from 'qrcode.react';
import { saveAs } from 'file-saver';
import { generateQR, saveQRToStorage } from '../services/QrService';
import { useParams } from 'react-router-dom';
import { getMenuById } from '../services/MenuService';

const QrGenerator = () => {
  const { menuId } = useParams();
  const [menu, setMenu] = useState(null);
  const [qrSize, setQrSize] = useState(300);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [fgColor, setFgColor] = useState('#000000');
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [qrGenerated, setQrGenerated] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [urlType, setUrlType] = useState('default');

  useEffect(() => {
    const fetchMenu = async () => {
      if (menuId) {
        setLoading(true);
        try {
          const menuData = await getMenuById(menuId);
          setMenu(menuData);
          // Generar la URL predeterminada basada en el ID del menú
          const defaultUrl = `${window.location.origin}/menu/${menuId}`;
          setQrValue(defaultUrl);
        } catch (error) {
          console.error("Error fetching menu:", error);
          showNotification(`Error al cargar el menú: ${error.message}`, 'error');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMenu();
  }, [menuId]);

  const handleGenerateQR = async () => {
    setLoading(true);
    try {
      const url = urlType === 'custom' ? customUrl : `${window.location.origin}/menu/${menuId}`;
      setQrValue(url);
      
      const qrData = {
        menuId,
        url,
        size: qrSize,
        backgroundColor: bgColor,
        foregroundColor: fgColor,
        timestamp: new Date().toISOString(),
      };
      
      await generateQR(qrData);
      await saveQRToStorage(menuId, qrData);
      
      setQrGenerated(true);
      showNotification('QR generado correctamente', 'success');
    } catch (error) {
      console.error("Error generating QR:", error);
      showNotification(`Error al generar QR: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById("qr-code-canvas");
    if (canvas) {
      canvas.toBlob((blob) => {
        saveAs(blob, `menu-qr-${menuId}.png`);
        showNotification('QR descargado correctamente', 'success');
      });
    } else {
      showNotification('No se pudo descargar el QR', 'error');
    }
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  return (
    <Card sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Generador de QR para Menú
      </Typography>
      
      {loading && !menu ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {menu && (
            <Typography variant="subtitle1" gutterBottom>
              Menú: {menu.name}
            </Typography>
          )}
          
          <Box mt={3} mb={4}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tipo de URL</InputLabel>
              <Select
                value={urlType}
                onChange={(e) => setUrlType(e.target.value)}
                label="Tipo de URL"
              >
                <MenuItem value="default">URL predeterminada</MenuItem>
                <MenuItem value="custom">URL personalizada</MenuItem>
              </Select>
            </FormControl>
            
            {urlType === 'custom' && (
              <TextField
                fullWidth
                label="URL personalizada"
                variant="outlined"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}
            
            <TextField
              type="number"
              label="Tamaño del QR (px)"
              variant="outlined"
              value={qrSize}
              onChange={(e) => setQrSize(parseInt(e.target.value))}
              inputProps={{ min: 100, max: 1000 }}
              sx={{ mb: 2, mr: 2, width: '48%' }}
            />
            
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
              <TextField
                label="Color de fondo"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                sx={{ width: '48%' }}
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                label="Color del QR"
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                sx={{ width: '48%' }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleGenerateQR}
              disabled={loading || (urlType === 'custom' && !customUrl)}
              fullWidth
              sx={{ mb: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Generar QR'}
            </Button>
          </Box>
          
          {qrGenerated && (
            <Box textAlign="center" mb={3}>
              <Box 
                sx={{ 
                  p: 3, 
                  display: 'inline-block',
                  backgroundColor: bgColor,
                  border: '1px solid #eee',
                  borderRadius: 2
                }}
              >
                <QRCode
                  id="qr-code-canvas"
                  value={qrValue}
                  size={qrSize}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  level="H"
                  includeMargin
                  renderAs="canvas"
                />
              </Box>
              
              <Box mt={3}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={handleDownloadQR}
                  sx={{ mr: 2 }}
                >
                  Descargar QR
                </Button>
                
                <Button 
                  variant="outlined"
                  onClick={() => window.open(qrValue, '_blank')}
                >
                  Probar QR
                </Button>
              </Box>
            </Box>
          )}
        </>
      )}
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default QrGenerator;