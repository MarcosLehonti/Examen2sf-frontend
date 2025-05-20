// src/components/StartProjectView.jsx
import React, { useState } from "react";
///////
///////
const StartProjectView = () => {
  const [umlFile, setUmlFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleUmlUpload = (e) => {
    setUmlFile(e.target.files[0]);
  };

  const handleImageUpload = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <div style={styles.container}>
      <h2>Empieza tu proyecto</h2>
      <p>Sube un archivo UML o una imagen de tu bosquejo.</p>

      <div style={styles.uploadBlock}>
        <label>Archivo UML:</label>
        <input type="file" accept=".uml,.json,.txt" onChange={handleUmlUpload} />
        {umlFile && <p>Subido: {umlFile.name}</p>}
      </div>

      <div style={styles.uploadBlock}>
        <label>Imagen del bosquejo:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imageFile && <p>Subido: {imageFile.name}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "10%",
  },
  uploadBlock: {
    marginTop: "30px",
  },
};

export default StartProjectView;
