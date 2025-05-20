import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import '../styles/LogsView.css';

const LogsView = () => {
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');   // ✅ Obtener token

    fetch('http://localhost:4000/api/logs', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) throw new Error('No autorizado. Debes iniciar sesión.');
        if (res.status === 403) throw new Error('Acceso denegado. No tienes permisos.');
        return res.json();
      })
      .then(data => {
        setLogs(data.logs);
        setLoading(false);
      })
      .catch(err => {
        setLogs(`❌ Error: ${err.message}`);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="logs-container">
        <h2>📝 Bitácora del Servidor</h2>
        {loading ? (
          <p>Cargando logs...</p>
        ) : (
          <textarea
            className="logs-textarea"
            value={logs}
            readOnly
          />
        )}
      </div>
    </>
  );
};

export default LogsView;
