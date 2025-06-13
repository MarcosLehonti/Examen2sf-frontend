import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const ImageToFormView = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedHtml, setGeneratedHtml] = useState("");
  const navigate = useNavigate();

  const baseContext = `
Considerando un diseño HTML como inspiración (no debe replicarse literalmente, sino adaptarse):
HTML de referencia:
- Un botón azul (#007bff).
- Un campo de texto con placeholder "Ingrese Texto".
- Una etiqueta con borde discontinuo.
- Un contenedor con fondo azul claro (#90bdc6), bordes redondeados, y un checklist de 3 opciones.
- Una tabla con columnas "Nombre", "Email", "Acciones".
Usa estos elementos como ideas para crear una interfaz HTML similar pero optimizada (por ejemplo, usa flexbox o grid para responsividad, no posiciones absolutas).

Instrucciones:
- Analiza la imagen proporcionada, que representa una interfaz simple (puede ser dibujada a mano o generada por computadora) con elementos como botones, campos de texto, grids, listas, o tablas.
- Genera un código HTML completo (con DOCTYPE, head, y estilos CSS) que represente la interfaz detectada.
- Asegúrate de que el HTML sea funcional, responsivo, y estilizado de forma moderna (usa flexbox o grid, colores similares al HTML de referencia si es posible).
- Incluye estilos en un <style> dentro de <head>.
- Devuelve SOLO el código HTML como un string, sin explicaciones ni backticks.
`;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const supportedMimeTypes = ["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"];
      if (!supportedMimeTypes.includes(file.type)) {
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const result = reader.result;

        if (!result || typeof result !== "string" || !result.includes(",")) {
          throw new Error("No se pudo leer correctamente la imagen.");
        }

        const base64Parts = result.split(",");
        const imageBase64 = base64Parts[1]?.trim();
        const mimeType = file.type;

        if (!imageBase64) {
          throw new Error("Imagen vacía o mal codificada en base64.");
        }

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error("Google API Key no configurada");
        }

        const ai = new GoogleGenAI({ apiKey });

        const payload = {
          contents: [
            {
              parts: [
                { text: baseContext },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
            stopSequences: [],
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          ],
        };

        const response = await ai.models.generateContent({
          model: "gemini-1.5-flash-latest",
          contents: payload.contents,
          generationConfig: payload.generationConfig,
          safetySettings: payload.safetySettings,
        });

        const html = response.text?.trim();
        if (!html) {
          throw new Error("No se pudo obtener HTML de Gemini.");
        }

        setGeneratedHtml(html);
        localStorage.setItem("htmlGenerado", html); // 💾 Guarda en localStorage
      };

      reader.onerror = (e) => {
        console.error("Error leyendo el archivo:", e);
        setError("Error al leer la imagen.");
      };
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h3>Sube tu imagen dibujada de una interfaz</h3>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
          onChange={handleImageUpload}
          disabled={loading}
        />
        {loading && <p>Procesando imagen...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {generatedHtml && (
          <div style={{ marginTop: "30px", textAlign: "left", padding: "10px" }}>
            <h4>📄 Código HTML Generado</h4>
            <textarea
              value={generatedHtml}
              readOnly
              rows={25}
              style={{
                width: "100%",
                fontFamily: "monospace",
                fontSize: "14px",
                backgroundColor: "#f5f5f5",
                padding: "10px",
              }}
            />


          <button
            style={{
              marginTop: "16px",
              padding: "10px 24px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px"
            }}
            onClick={() => navigate("/generar-componentes")}
          >
            Generar Componentes a lienzo
          </button>



          <button
            style={{
              marginTop: "16px",
              padding: "10px 24px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px"
            }}
            onClick={() => navigate("/generar-flutter-boceto")}
          >
            Generar Flutter
          </button>


          </div>
        )}
      </div>
    </>
  );
};

export default ImageToFormView;
