// src/components/WelcomeView.jsx
import React from "react";

const WelcomeView = ({ onStart }) => {
  return (
    <div style={styles.container}>
      <h1>¡Bienvenido a AutoUI!</h1>
      <p>Genera interfaces automáticamente desde tus diagramas o bosquejos.</p>
      <button onClick={onStart} style={styles.button}>
        Empezar con tu proyecto
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "20%",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    marginTop: "20px",
    cursor: "pointer",
  },
};

export default WelcomeView;
