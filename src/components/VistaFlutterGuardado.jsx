import React, { useEffect, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Navbar from './Navbar';

export default function VistaFlutterGuardado() {
  const [flutterCode, setFlutterCode] = useState('');
  const [htmlResult, setHtmlResult] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  const ejemploHTML =`
Convierte el siguiente código Flutter a HTML.

Pero NO generes un formulario común ni CSS en el encabezado.

 Usa este formato específico para cada componente, con estilos inline y posiciones absolutas:

- Un botón debe verse así:
  <button style="position:absolute; left:112px; top:338px; background-color:#007bff;">Texto</button>

- Un label:
  <label style="position:absolute; left:129px; top:214px; font-size:14px; width:100px; height:30px; display:flex; align-items:center; justify-content:center; border:1px dashed gray;">Texto</label>

- Un input:
  <input style="position:absolute; left:96px; top:281px; padding:4px;" placeholder="Texto" />

- Una tarjeta:
  <div style="position:absolute; left:16px; top:444px; width:350px; height:275px; background-color:#90bdc6; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center;"></div>

- Un checklist:
  <div style="position:absolute; left:228px; top:313px; padding:10px; background-color:#f9f9f9; border:1px solid #ccc; border-radius:6px;">
    <label><input type="checkbox" /> Opción 1</label>
    <label><input type="checkbox" /> Opción 2</label>
    <label><input type="checkbox" /> Opción 3</label>
  </div>

- Una tabla:
  <table style="position:absolute; left:35px; top:502px; width:100%; border-collapse:collapse; font-size:14px;">
    <thead>
      <tr><th>Nombre</th><th>Email</th><th>Acciones</th></tr>
    </thead>
    <tbody>
      <tr><td>Juan</td><td>juan@mail.com</td><td>Editar</td></tr>
      <tr><td>Ana</td><td>ana@mail.com</td><td>Editar</td></tr>
    </tbody>
  </table>

 Asegúrate de que todos los elementos generados tengan atributos styl con position:absolute y coordenadas left y top. 
 Y tambien eliminame estas etiquetas: <html>
<head>
<title>Login App</title>
</head>
<body> que solo haya las que te pase

Ahora convierte este código Flutter al formato especificado:
\n\n${flutterCode}
`;


  async function convertirFlutterAHtml() {
    if (!flutterCode || flutterCode.includes('No se encontró')) {
      alert('No hay código Flutter válido en localStorage');
      return;
    }

    setLoading(true);
    const prompt = `
Convierte este código Flutter al equivalente en HTML5. El HTML debe seguir este estilo de referencia:

${ejemploHTML}

Ahora convierte este código Flutter a HTML:

${flutterCode}
`;

    try {
      const result = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
      });

      const raw = result.text || '';
      const match = raw.match(/<html[\s\S]*<\/html>/i) || raw.match(/```html\s*([\s\S]*?)```/);
      if (match) {
        setHtmlResult(match[1] || match[0]);
      } else {
        setHtmlResult(raw);
      }
    } catch (err) {
      console.error('Error con Gemini:', err);
      setHtmlResult('Error al convertir el código.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const guardado = localStorage.getItem('flutterGenerado');
    setFlutterCode(guardado || 'No se encontró ningún código Flutter guardado.');
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: '40px', fontFamily: 'Arial' }}>
        <h2>Código Flutter guardado</h2>

        <textarea
          style={{
            width: '100%',
            height: '300px',
            fontFamily: 'monospace',
            fontSize: '14px',
            whiteSpace: 'pre',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9',
          }}
          value={flutterCode}
          readOnly
        />

        <button
          onClick={convertirFlutterAHtml}
          disabled={loading}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Convirtiendo...' : 'Convertir a HTML'}
        </button>


        <button
  onClick={() => {
    localStorage.setItem('htmlGenerado', htmlResult);
    alert('HTML guardado correctamente. Redirigiendo al lienzo...');
    window.location.href = '/lienzo'; // ajusta la ruta si es diferente
  }}
  style={{
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }}
>
  Llevar al Lienzo
</button>


        {htmlResult && (
          <>
            <h3 style={{ marginTop: '30px' }}>HTML generado</h3>
            <textarea
              style={{
                width: '100%',
                height: '400px',
                fontFamily: 'monospace',
                fontSize: '14px',
                whiteSpace: 'pre',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '4px',
                backgroundColor: '#f1f1f1',
              }}
              value={htmlResult}
              readOnly
            />
          </>
        )}
      </div>
    </>
  );
}
