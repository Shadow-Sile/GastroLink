import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/AuthService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!formData.email || !formData.password || !formData.confirmPassword || 
        !formData.restaurantName || !formData.firstName || !formData.lastName) {
      setError('Por favor complete todos los campos.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);
      
      const userData = {
        email: formData.email,
        password: formData.password,
        restaurantName: formData.restaurantName,
        firstName: formData.firstName,
        lastName: formData.lastName
      };
      
      await register(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al registrar la cuenta. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Navbar />
      
      <div className="register-container">
        <div className="register-form-container">
          <h2>Crear Cuenta</h2>
          <p>Complete el formulario para registrarse en GastroLink</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Su nombre"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Su apellido"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="restaurantName">Nombre del Restaurante</label>
              <input
                type="text"
                id="restaurantName"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                placeholder="Nombre de su restaurante"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar su contraseña"
                required
              />
            </div>
            
            <button type="submit" className="register-button" disabled={loading}>
              {loading ? 'Procesando...' : 'Registrarse'}
            </button>
          </form>
          
          <div className="login-link">
            ¿Ya tiene una cuenta? <Link to="/login">Iniciar Sesión</Link>
          </div>
        </div>
        
        <div className="register-info">
          <h3>Beneficios de GastroLink</h3>
          <ul>
            <li>Gestione su menú digital fácilmente</li>
            <li>Genere códigos QR para sus mesas</li>
            <li>Actualice su menú en tiempo real</li>
            <li>Mejore la experiencia de sus clientes</li>
            <li>Acceda desde cualquier dispositivo</li>
          </ul>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;