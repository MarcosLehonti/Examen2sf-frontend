import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/Home.css';
import lienzoImg from '../assets/lienzo.svg';
import SubirArc from '../assets/subirImg.svg';
import SubirDoc from '../assets/subir_archivo.svg';
import SubirPrompt from '../assets/proyecto.svg';
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLienzoClick = () => {
    setShowModal(true);  // Mostrar el modal al presionar el botón
  };

  const handleSolo = () => {
    const roomId = uuidv4();
    navigate(`/diagrams/createlienzo/${roomId}`);
  };

  const handleColaborativo = () => {
    const roomId = uuidv4();
    navigate(`/diagrams/configurar-sala/${roomId}`);
  };

  const closeModal = () => setShowModal(false);

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="card-container">
          {/* Tarjeta 1 - Lienzo */}
          <div className="card">
            <img src={lienzoImg} alt="Lienzo" className="card-image" />
            <h2>Comienza tu proyecto desde un Lienzo</h2>
            <p>Crea tu interfaz arrastrando y soltando elementos en un lienzo interactivo.</p>
            <button 
              className="card-button"
              onClick={handleLienzoClick}
            >
              Ir al Lienzo
            </button>
          </div>

          {/* Tarjeta 2 - Subir UML */}
          <div className="card">
            <img src={SubirDoc} alt="Documento" className="card-image" />
            <h2>Genera tu vista subiendo un archivo UML</h2>
            <p>Sube tu diagrama de clases UML y genera automáticamente tu vista.</p>
            <button className="card-button" onClick={() => navigate('/diagrams/creatediagram')} >
              Subir UML
            </button>
          </div>

          {/* Tarjeta 3 - Subir Imagen */}
          <div className="card">
            <img src={SubirArc} alt="Archivo" className="card-image" />
            <h2>Sube una imagen y listo</h2>
            <p>Convierte un boceto o diseño en imagen en una vista funcional fácilmente.</p>
            <button className="card-button" onClick={() => navigate('/diagrams/createimage')} >
              Subir Imagen
            </button>
          </div>

           {/* Tarjeta 4 - Prompt */}
          <div className="card">
            <img src={SubirPrompt} alt="Archivo" className="card-image" />
            <h2>Chatea con el Prompt</h2>
            <p>Dile al prompt tu idea de una vista y el te la generara facilmente.</p>
            <button className="card-button" onClick={() => navigate('/prompt')} >
              Chatear
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>¿Cómo deseas trabajar?</h2>
            <p>Selecciona el modo de trabajo para tu proyecto:</p>
            <button className="modal-button" onClick={handleSolo}> Trabajar Solo</button>
            <button className="modal-button" onClick={handleColaborativo}> Modo Colaborativo</button>
            <button className="modal-close" onClick={closeModal}>Cancelar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;