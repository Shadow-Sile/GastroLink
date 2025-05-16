import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/AuthService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate('/');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      
      // Personalizar mensajes de error
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email o contraseña incorrectos');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Inténtalo más tarde');
      } else {
        setError('Error al iniciar sesión. Por favor, inténtalo de nuevo');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 py-4">
            <h2 className="text-center text-2xl font-bold text-white">Iniciar Sesión</h2>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ejemplo@correo.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Iniciando...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Regístrate
                </Link>
              </p>
              
              <Link to="/forgot-password" className="block mt-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoginPage;