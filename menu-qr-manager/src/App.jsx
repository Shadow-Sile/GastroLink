import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Importación de componentes principales
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Importación de componentes de MenuManager
import MenuManager from './components/MenuManager/MenuManager';
import MenuList from './components/MenuManager/MenuList/MenuList';
import MenuDetail from './components/MenuManager/MenuDetail/MenuDetail';
import MenuForm from './components/MenuManager/MenuForm/MenuForm';
import CategoryManager from './components/MenuManager/CategoryManager/CategoryManager';
import ItemManager from './components/MenuManager/ItemManager/ItemManager';
import QRCodeGenerator from './components/MenuManager/QRCodeGenerator/QRCodeGenerator';

// Importación de estilos
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rutas protegidas */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas del MenuManager */}
              <Route 
                path="/menus" 
                element={
                  <ProtectedRoute>
                    <MenuManager />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/menus/list" 
                element={
                  <ProtectedRoute>
                    <MenuList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/menus/:menuId" 
                element={
                  <ProtectedRoute>
                    <MenuDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/menus/new" 
                element={
                  <ProtectedRoute>
                    <MenuForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/menus/edit/:menuId" 
                element={
                  <ProtectedRoute>
                    <MenuForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/categories/:menuId" 
                element={
                  <ProtectedRoute>
                    <CategoryManager />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/items/:categoryId" 
                element={
                  <ProtectedRoute>
                    <ItemManager />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/qr-generator/:menuId" 
                element={
                  <ProtectedRoute>
                    <QRCodeGenerator />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
