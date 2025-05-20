import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Navbar from "./Navbar";
import "../styles/vista-generada.css"; 

const VistaGenerada = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formFields, generatedCode, imagePreview } = location.state || {};

  const handleCompartirSala = () => {
    const roomId = uuidv4();
    navigate(`/sala/${roomId}`, {
      state: {
        generatedCode,
      },
    });
  };

  const handleDescargarYRedirigir = () => {
    localStorage.setItem("htmlGenerado", generatedCode);
    navigate("/generar-angular");
  };

  return (
    <>
      <Navbar />

      {/* ✅ Solo estilos adicionales para el formulario */}
      <style>{`
        .form-wrapper {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 600px;
          margin-bottom: 30px;
        }

        .form-generado {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-generado label {
          font-weight: bold;
          margin-bottom: 6px;
        }

        .form-generado input,
        .form-generado button,
        .form-generado table {
          font-size: 16px;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }

        .form-generado button {
          background-color: #007bff;
          color: white;
          border: none;
          cursor: pointer;
        }

        .form-generado table {
          border-collapse: collapse;
          width: 100%;
        }

        .form-generado th,
        .form-generado td {
          border: 1px solid #999;
          padding: 8px;
          text-align: center;
        }

        .form-generado th {
          background-color: #f0f0f0;
        }
      `}</style>

      <div className="vista-container">
        <h2>Formulario generado a partir de la imagen</h2>

        {imagePreview && (
          <>
            <h4>✅ Esto me pasaste:</h4>
            <img className="vista-imagen" src={imagePreview} alt="Bosquejo" />
          </>
        )}

        {formFields && (
          <>
            <div className="formulario-generado form-wrapper">
              <h4>✨ Esto es un ejemplo de cómo se vería tu vista:</h4>
              <form className="form-generado">
                {formFields.map((field, idx) => (
                  <div key={idx} className="form-item">
                    {["input", "email", "password", "tel"].includes(field.type) && (
                      <>
                        <label>{field.label}</label>
                        <input
                          type={field.type === "input" ? "text" : field.type}
                          placeholder={field.label}
                        />
                      </>
                    )}

                    {field.type === "button" && (
                      <button type="submit">{field.label}</button>
                    )}

                    {field.type === "table" && (
                      <table>
                        <thead>
                          <tr>
                            <th>Columna 1</th>
                            <th>Columna 2</th>
                            <th>Columna 3</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Dato 1</td>
                            <td>Dato 2</td>
                            <td>Dato 3</td>
                          </tr>
                          <tr>
                            <td>Dato 4</td>
                            <td>Dato 5</td>
                            <td>Dato 6</td>
                          </tr>
                          <tr>
                            <td>Dato 7</td>
                            <td>Dato 8</td>
                            <td>Dato 9</td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                ))}
              </form>
            </div>

            <div className="codigo-generado">
              <h4>📄 Código HTML Generado</h4>
              <textarea readOnly value={generatedCode}></textarea>
              <br />
              <button onClick={handleDescargarYRedirigir}>
                Descargar código
              </button>
              <button style={{ marginTop: "10px" }} onClick={handleCompartirSala}>
                🔗 Compartir en Sala
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default VistaGenerada;
