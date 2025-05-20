import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useLocation, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/sala-colaborativa.css';

const socket = io('http://localhost:4000'); // Cambia esto si usas IP externa

const SalaColaborativa = () => {
  const { roomId } = useParams();
  const { state } = useLocation();
  const { generatedCode = "" } = state || {};

  const [code, setCode] = useState(generatedCode);
  const iframeRef = useRef();

  // Unirse a la sala al cargar
  useEffect(() => {
    if (roomId) {
      socket.emit('join-room', roomId);
  
      // ⚠️ Si soy el host y tengo código generado, lo guardo en el servidor
      if (generatedCode) {
        socket.emit('code-change', { roomid: roomId, code: generatedCode });
      }
    }
  }, [roomId, generatedCode]);
  

  // Escuchar cambios desde el socket
  useEffect(() => {
    // Código que otros usuarios envían
    socket.on('receive-code', (newCode) => {
      setCode(newCode);
    });

    // Código que el backend manda a nuevos usuarios al entrar
    socket.on('load_code', (existingCode) => {
      setCode(existingCode);
    });

    return () => {
      socket.off('receive-code');
      socket.off('load_code');
    };
  }, []);

  // Actualizar el iframe con la vista previa del código
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = code;
    }
  }, [code]);

  // Emitir cambios al escribir en el textarea
  const handleChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    socket.emit('code-change', { roomid:roomId, code: newCode });
  };

  return (
    <>
      <Navbar />
      <div className="sala-container">
        <h2>Sala colaborativa: {roomId}</h2>

        <div className="sala-content">
          {/* Editor de código */}
          <textarea
            value={code}
            onChange={handleChange}
            className="sala-textarea"
            placeholder="Aquí va tu HTML generado..."
          />

          {/* Vista previa */}
          <div className="preview-container">
            <h4>🔍 Vista previa</h4>
            <iframe
              ref={iframeRef}
              title="Vista previa HTML"
              className="sala-preview"
              sandbox="allow-same-origin allow-scripts"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalaColaborativa;
