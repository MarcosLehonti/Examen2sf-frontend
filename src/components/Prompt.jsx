import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Navbar from './Navbar';

export default function CrearProyectoView() {
  const [inputValue, setInputValue] = useState('');
  const [resultado, setResultado] = useState('');
  const [loading, setLoading] = useState(false);

  // Inicializar Gemini
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  // Función para procesar el prompt con Gemini
  async function procesarConGemini(promptInput) {
  const ejemplosContexto = `
        Considerando los siguientes ejemplos y un diseño HTML como inspiración (no debe replicarse literalmente, sino adaptarse):
        HTML de referencia:
        - Un botón azul, un campo de texto, una etiqueta, un contenedor con un checklist de 3 opciones, y una tabla con columnas "Nombre", "Email", "Acciones".
        - Usa estos elementos como ideas para crear una interfaz similar pero optimizada para Flutter (por ejemplo, usa ListView en lugar de tabla, Column en lugar de posiciones absolutas).
        Ejemplos:
        - Crear interfaz con grid y checklist con opción 1 tomate, 2 lechuga y un cuadro de texto.
        - Crear interfaz con checklist de 3 opciones y un botón.
        - Crear una lista con un botón.
        Instrucciones:
        - Genera un código Flutter (Dart) para un archivo lib/main.dart.
        - Usa un tema oscuro (ThemeData.dark()).
        - Organiza los elementos de forma responsiva usando Column, Row, ListView, o GridView.
        - Asegúrate de que el código sea funcional y completo.
        Ahora, genera un código Flutter basado en el siguiente prompt: ${promptInput}
  `;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: ejemplosContexto,
    });

    const raw = result.text || '';
    const match = raw.match(/```(?:dart)?\s*([\s\S]*?)```/);

    if (match && match[1]) {
      return match[1].trim();
    } else {
      console.warn("No se encontró código Dart válido en la respuesta de Gemini.");
      return 'Error al generar el código con Gemini';
    }

  } catch (err) {
    console.error('Error llamando a Gemini:', err);
    return 'Error al generar el código con Gemini';
  }
}


  // Manejador del botón para crear el proyecto
  async function handleCrearProyecto() {
    if (!inputValue.trim()) {
      setResultado('Por favor, ingrese un prompt válido.');
      return;
    }

    setLoading(true);
    const geminiString = await procesarConGemini(inputValue);
    setResultado(geminiString);
    setLoading(false);
  }

  // Función para generar y descargar el archivo ZIP
 async function handleDescargarZip() {
  if (!resultado || resultado.includes('Error')) {
    alert('No hay código válido para descargar.');
    return;
  }

  const zip = new JSZip();
  const root = zip.folder('flutter_project');

  // Archivos raíz necesarios
  root.file('README.md', '# Proyecto Flutter\nGenerado automáticamente.');
  root.file('.gitignore', `
.dart_tool/
.packages
.pub/
build/
ios/Flutter/Flutter.framework
ios/Flutter/Flutter.podspec
*.iml
.idea/
*.log
  `.trim());

  root.file('pubspec.yaml', `
name: flutter_project
description: Proyecto generado automáticamente por IA.
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter

flutter:
  uses-material-design: true
  assets:
    - assets/
  `.trim());

  // Carpetas necesarias
  root.folder('test');
  root.folder('assets');

  // Código generado por Gemini
  const lib = root.folder('lib');
  lib.file('main.dart', resultado);  // 👈 aquí va el código generado dinámicamente

  // Generar y descargar ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'flutter_project.zip');
}


  return (
    <>
    <Navbar/>
    <div style={{ padding: '150px', fontFamily: 'Arial' }}>
      <h2>Crear nuevo proyecto Flutter</h2>

      {/* Input de texto */}
      <input
        type="text"
        placeholder="Describe la interfaz a generar"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ padding: '10px', width: '100%', maxWidth: '400px', marginBottom: '10px' }}
      />
      <br />

      {/* Botón para crear proyecto */}
      <button
        onClick={handleCrearProyecto}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginRight: '10px',
        }}
      >
        {loading ? 'Generando...' : 'Enviar'}
      </button>

      {/* Botón para descargar ZIP */}
      {resultado && !resultado.includes('Error') && (
        <button
          onClick={handleDescargarZip}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Descargar ZIP
        </button>

      )}

    {/* Mostrar solo si hay código válido */}
      {resultado && !resultado.includes('Error') && (
        <button
          onClick={() => {
            if (resultado.trim().length > 0) {
              localStorage.setItem('flutterGenerado', resultado);
              alert('Código almacenado en localStorage. Redirigiendo al lienzo...');
              window.location.href = '/flutter-guardado';
            } else {
              alert('No hay código válido para guardar.');
            }
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
        >
          Convierte tu codigo a compoenntes del lienzo
        </button>
      )}



      

      {/* Resultado */}
      {resultado && (
        <pre
          style={{
            marginTop: '20px',
            backgroundColor: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {resultado}
        </pre>
      )}
    </div>
     </>
  );
}