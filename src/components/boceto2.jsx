import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const ImageToFormView2 = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setLoading(true);

    Tesseract.recognize(file, 'eng', { logger: m => console.log(m) })
      .then(({ data: { text } }) => {
        const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

        const elements = lines.map((line) => {
          const lower = line.toLowerCase();

          // ✔️ Tabla
          if (lower.includes("tabla")) {
            return { type: "table", label: line };
          }

          // ✔️ Botones
          const isButton = ["enviar", "submit", "registrar", "aceptar", "guardar", "buscar", "cancelar"]
            .some(word => lower.includes(word));
          if (isButton) {
            return { type: "button", label: line };
          }

          // ✔️ Checkbox-list con símbolos como ☐, [ ], ( )
          const checkboxSymbols = ["☐", "[ ]", "( )"];
          const hasCheckboxSymbol = checkboxSymbols.some(sym => line.includes(sym));

          if (hasCheckboxSymbol && line.includes(":")) {
            const [labelRaw, rest] = line.split(":");
            const regex = /(?:☐|\[\s*\]|\(\s*\))\s*([\wáéíóúÁÉÍÓÚüÜñÑ]+)/g;
            const options = [];
            let match;

            while ((match = regex.exec(rest)) !== null) {
              options.push(match[1]);
            }

            if (options.length >= 2) {
              return {
                type: "checkbox-list",
                label: labelRaw.trim(),
                options
              };
            }
          }

          // ✔️ NUEVO: detectar sintaxis Palabra: opcion1, opcion2, ...
          if (line.includes(":")) {
            const [label, optionsRaw] = line.split(":");
            const options = optionsRaw
              .split(",")
              .map(o => o.trim())
              .filter(Boolean);

            if (options.length >= 2) {
              return {
                type: "checkbox-list",
                label: label.trim(),
                options
              };
            }
          }

          // ✔️ Por defecto: input
          return { type: "input", label: line };
        });

        const code = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Formulario Generado</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }

            .form-wrapper {
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              width: 100%;
              max-width: 600px;
            }

            form {
              display: flex;
              flex-direction: column;
              gap: 16px;
            }

            label {
              font-weight: bold;
              margin-bottom: 6px;
            }

            input, button, table {
              font-size: 16px;
              padding: 10px;
              border-radius: 6px;
              border: 1px solid #ccc;
            }

            button {
              background-color: #007bff;
              color: white;
              border: none;
              cursor: pointer;
            }

            table {
              border-collapse: collapse;
              width: 100%;
            }

            th, td {
              border: 1px solid #999;
              padding: 8px;
              text-align: center;
            }

            th {
              background-color: #f0f0f0;
            }
          </style>
        </head>
        <body>
          <div class="form-wrapper">
            <form>
              ${elements.map(field => {
                if (field.type === "input") {
                  return `<label>${field.label}</label><input type="text" name="${field.label}" />`;
                } else if (field.type === "email") {
                  return `<label>${field.label}</label><input type="email" name="${field.label}" />`;
                } else if (field.type === "password") {
                  return `<label>${field.label}</label><input type="password" name="${field.label}" />`;
                } else if (field.type === "tel") {
                  return `<label>${field.label}</label><input type="tel" name="${field.label}" />`;
                } else if (field.type === "button") {
                  return `<button type="submit">${field.label}</button>`;
                } else if (field.type === "table") {
                  return (
                    '<table>\n' +
                    '  <thead><tr><th>Columna 1</th><th>Columna 2</th><th>Columna 3</th></tr></thead>\n' +
                    '  <tbody>\n' +
                    '    <tr><td>Dato 1</td><td>Dato 2</td><td>Dato 3</td></tr>\n' +
                    '    <tr><td>Dato 4</td><td>Dato 5</td><td>Dato 6</td></tr>\n' +
                    '    <tr><td>Dato 7</td><td>Dato 8</td><td>Dato 9</td></tr>\n' +
                    '  </tbody>\n' +
                    '</table>'
                  );
                } else if (field.type === "checkbox-list") {
                  return `<label>${field.label}</label>\n` +
                    field.options.map(option =>
                      `<label style="display:block;"><input type="checkbox" /> ${option}</label>`
                    ).join("\n");
                }
                return "";
              }).join("\n")}
            </form>
          </div>
        </body>
        </html>
        `.trim();

        navigate("/vista-generada", {
          state: {
            formFields: elements,
            generatedCode: code,
            imagePreview: preview
          }
        });

        setLoading(false);
      });
  };

  return (
    <>
      <Navbar />
      <div style={{ textAlign: "center" }}>
        <h3>Sube tu imagen dibujada</h3>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {loading && <p>Procesando imagen...</p>}
      </div>
    </>
  );
};

export default ImageToFormView2;