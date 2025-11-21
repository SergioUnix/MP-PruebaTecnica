// main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// 1. Importar los componentes necesarios de React Router DOM
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importar tus componentes de página
import Login from './Login.tsx';
import Home from './Home.tsx'; // Asegúrate de que este archivo exista
import Expedientes from './Expedientes.tsx';

// Importar Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';


const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    {/* 2. Envolver toda la aplicación en BrowserRouter */}
    <BrowserRouter>
      {/* 3. Definir todas las rutas de la aplicación dentro de Routes */}
      <Routes>
        {/* Si el usuario accede a la ruta raíz "/", lo redirige a "/login" */}
        <Route path="/" element={<Navigate replace to="/login" />} />
        
        {/* Ruta para la página de Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta para la página principal después de iniciar sesión */}
        <Route path="/home" element={<Home />} />
        
        {/* Aquí puedes agregar más rutas como /productos, /usuarios, etc. */}
        <Route path="/Expedientes" element={<Expedientes />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
);