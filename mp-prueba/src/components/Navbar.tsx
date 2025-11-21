// src/components/Navbar.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        // Limpiar token y datos de usuario del localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        // En una app real: limpiar tokens, contexto de usuario, etc.
        console.log("Cerrando Sesión...");
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/home">MP-PRUEBA 🚀</Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {/* Opciones de navegación */}
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/home">Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/Expedientes">Expedientes</Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link className="nav-link" to="/usuarios">Usuarios</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/reportes">Reportes</Link>
                        </li> */}
                    </ul>
                    <div className="d-flex">
                        <button 
                            className="btn btn-outline-light"
                            onClick={handleLogout}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;