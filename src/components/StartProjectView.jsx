import React, { useState } from "react";
import UMLUploadView from "./UMLUploadView";
import ImageToFormView from "./ImageToFormView";
import "../styles/start-project.css"; 
import Navbar from "./Navbar";

const StartProjectView = () => {
  const [viewType, setViewType] = useState(null);

  return (
    <>
    <Navbar/>
    <div className="start-container">
      <div className="start-content">
        <h2>Empieza tu proyecto</h2>
        <p>Selecciona el tipo de archivo con el que quieres generar la interfaz</p>

        <button onClick={() => setViewType("imagen")}>Subir imagen dibujada</button>

        <div className="start-view-area">
          {viewType === "uml" && <UMLUploadView />}
          {viewType === "imagen" && <ImageToFormView />}
        </div>
      </div>
    </div>
    </>
  );
};

export default StartProjectView;
