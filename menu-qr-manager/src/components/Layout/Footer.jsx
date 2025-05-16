import React from 'react';
import '../../styles/components/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>MenuQR</h3>
            <p>La manera más fácil de gestionar tus menús digitales con códigos QR dinámicos.</p>
          </div>
          
          <div className="footer-section">
            <h3>Enlaces</h3>
            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/login">Iniciar Sesión</a></li>
              <li><a href="/register">Registrarse</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contacto</h3>
            <p>Email: info@menuqr.com</p>
            <p>Teléfono: +34 123 456 789</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} MenuQR. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;