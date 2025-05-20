import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import '../styles/GenerarAngular.css';
import angularLogo from '../assets/ilustracion.svg';
import Navbar from './Navbar';

const GenerarAngular = () => {

  const generarZip = async () => {
    const zip = new JSZip();

    zip.file("README.md", "# Proyecto Angular generado automáticamente\nEste es un proyecto de ejemplo.");
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "proyecto-angular.zip");
  };

  return (
    <>
      <Navbar />
      <div className="generate-container">
        <div className="generate-card">
          <img src={angularLogo} alt="Angular Logo" className="generate-image" />
          <h2>Generar Proyecto Angular</h2>
          <p>Descarga automáticamente un proyecto Angular basado en tu diseño.</p>
          <button onClick={generarZip} className="generate-button">
            Descargar Proyecto Angular
          </button>
        </div>
      </div>
    </>
  );
};

export default GenerarAngular;
