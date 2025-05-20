import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from './Navbar';


export default function GuardarProyecto() {
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar el código guardado en localStorage
    const htmlGuardado = localStorage.getItem("htmlGenerado") || "";
    setCodigo(htmlGuardado);
  }, []);

  const handleGuardar = async () => {
    try {
      const token = localStorage.getItem('token'); // Tu token JWT debe estar guardado
      if (!token) {
        alert('Debes estar logueado');
        return;
      }

      const response = await axios.post('localhost:4000/api/projects', 
        { nombre, codigo },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('Proyecto guardado exitosamente');
      navigate('/diagrams'); // Redirigir luego de guardar
    } catch (error) {
      console.error('Error guardando el proyecto:', error);
      alert('Error al guardar el proyecto');
    }
  };

  return (
    <>
      <Navbar />
  
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        paddingTop: '60px', // Ajusta este valor al alto de tu navbar
        boxSizing: 'border-box'
      }}>
        <div style={{ width: '100%', maxWidth: '600px', padding: '20px' }}>
          <h2>Guardar Proyecto</h2>
          <div style={{ marginBottom: '10px' }}>
            <label>Nombre del Proyecto:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Código Generado (HTML):</label>
            <textarea
              value={codigo}
              readOnly
              rows="10"
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <button onClick={handleGuardar} style={{ padding: '10px 20px' }}>
            Guardar Proyecto
          </button>
        </div>
      </div>
    </>
  );
  

}
