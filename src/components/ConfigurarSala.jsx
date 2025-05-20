import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Navbar from './Navbar';
import '../styles/ConfigurarSala.css';

const ConfigurarSala = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [metadata, setMetadata] = useState({
    name: '',
    description: ''
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    socketRef.current = io('http://localhost:4000');

    // Unirse a la sala y solicitar metadatos
    socketRef.current.emit('join-room', roomId);

    socketRef.current.on('room-metadata', (data) => {
      setMetadata({
        name: data.name || '',
        description: data.description || ''
      });
    });

    socketRef.current.on('room-updated', (updatedData) => {
      console.log('✅ Sala actualizada:', updatedData);
      navigate(`/diagrams/createlienzo/${roomId}`);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    socketRef.current.emit('edit-room', {
      roomid: roomId,
      newMetadata: metadata
    });
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/diagrams/createlienzo/${roomId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />
      <div className="configurar-container">
        <form className="configurar-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <h2>⚙️ Configurar Sala</h2>

          <label>Nombre de la Sala:</label>
          <input
            type="text"
            name="name"
            value={metadata.name}
            onChange={handleChange}
            required
          />

          <label>Descripción:</label>
          <textarea
            name="description"
            rows="3"
            value={metadata.description}
            onChange={handleChange}
            required
          />

          <button type="submit">💾 Guardar y Entrar al Lienzo</button>

          <div className="share-link-container">
            <label>🔗 Link para compartir:</label>
            <div className="share-link-box">
              <input 
                type="text" 
                value={`${window.location.origin}/diagrams/createlienzo/${roomId}`} 
                readOnly 
              />
              <button type="button" onClick={handleCopyLink}>📋 Copiar Link</button>
            </div>
            {copied && <span className="copied-message">✅ Link copiado</span>}
          </div>
        </form>
      </div>
    </>
  );
};

export default ConfigurarSala;
