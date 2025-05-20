import { useState } from "react";
import { xml2js } from "xml-js";
import Navbar from "./Navbar";
import "../styles/VisorDiagrama.css";
import angularLogo from '../assets/ilustracion.svg';
import { useNavigate } from "react-router-dom";


function VisorDiagramas() {
  const navigate = useNavigate();
  const [clases, setClases] = useState([]);
  const [conexiones, setConexiones] = useState([]);
  const [modo, setModo] = useState("drawio");
  const [formularios, setFormularios] = useState({});

  const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop();

    const reader = new FileReader();
    reader.onload = (e) => {
      const contenido = e.target.result;

      if (ext === "mdj") {
        setModo("staruml");
        const json = JSON.parse(contenido);
        procesarStarUML(json);
      } else {
        setModo("drawio");
        const xml = xml2js(contenido, { compact: true });
        procesarDrawio(xml);
      }
    };

    reader.readAsText(file);
  };

  const procesarDrawio = (xml) => {
    const root = xml?.mxfile?.diagram?.mxGraphModel?.root?.mxCell || [];
    const nodos = [];
    const edges = [];

    root.forEach((cell) => {
      const attr = cell?._attributes || {};
      const value = attr.value || "";

      if (attr.vertex === "1") {
        nodos.push({
          id: attr.id,
          name: value,
          x: cell.mxGeometry?._attributes?.x || 0,
          y: cell.mxGeometry?._attributes?.y || 0,
        });
      } else if (attr.edge === "1") {
        edges.push({
          source: attr.source,
          target: attr.target,
        });
      }
    });

    setClases(nodos);
    setConexiones(edges);
  };

  const procesarStarUML = (json) => {
    const clasesDetectadas = [];

    const buscarClases = (obj) => {
      if (obj._type === "UMLClass") {
        clasesDetectadas.push({
          id: obj._id,
          name: obj.name,
          atributos: (obj.attributes || []).map((a) => a.name),
          operaciones: (obj.operations || []).map((o) => o.name),
        });
      }

      if (Array.isArray(obj.ownedElements)) {
        obj.ownedElements.forEach((elem) => buscarClases(elem));
      }
    };

    buscarClases(json);
    setClases(clasesDetectadas);

    const nuevoFormularios = {};
    clasesDetectadas.forEach((clase) => {
      nuevoFormularios[clase.name] = {
        form: {},
        data: [],
        editIndex: null,
      };
    });
    setFormularios(nuevoFormularios);
    setConexiones([]);
  };

  const actualizarFormulario = (clase, cambios) => {
    setFormularios((prev) => ({
      ...prev,
      [clase]: {
        ...prev[clase],
        form: { ...prev[clase].form, ...cambios },
      },
    }));
  };

  const enviarFormulario = (clase) => {
    setFormularios((prev) => {
      const { form, data, editIndex } = prev[clase];
      const nuevaData = [...data];

      if (editIndex !== null) {
        nuevaData[editIndex] = form;
      } else {
        nuevaData.push(form);
      }

      return {
        ...prev,
        [clase]: {
          form: {},
          data: nuevaData,
          editIndex: null,
        },
      };
    });
  };

  const editarElemento = (clase, index) => {
    setFormularios((prev) => ({
      ...prev,
      [clase]: {
        ...prev[clase],
        form: prev[clase].data[index],
        editIndex: index,
      },
    }));
  };

  const eliminarElemento = (clase, index) => {
    setFormularios((prev) => {
      const nuevaData = prev[clase].data.filter((_, i) => i !== index);
      return {
        ...prev,
        [clase]: {
          ...prev[clase],
          data: nuevaData,
        },
      };
    });
  };

  const generarHTMLCrudCompleto = (clase) => {
    const formHTML = `
  <div style="background:#fff; padding:30px; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.1); max-width:600px; margin:auto; font-family:sans-serif">
    <form style="display:flex; flex-direction:column; gap:16px;">
      ${clase.atributos.map(attr => `
        <div>
          <label style="font-weight:bold; margin-bottom:4px; display:block">${attr}:</label>
          <input type="text" name="${attr}" style="padding:8px; border:1px solid #ccc; border-radius:5px; width:100%;" />
        </div>
      `).join('')}
      <button type="submit" style="background-color:#007bff; color:white; border:none; padding:10px; border-radius:5px; cursor:pointer;">
        Agregar
      </button>
    </form>
  
    <table style="margin-top:30px; width:100%; border-collapse:collapse; font-size:14px;">
      <thead>
        <tr style="background-color:#f0f0f0;">
          ${clase.atributos.map(attr => `<th style="border:1px solid #999; padding:8px;">${attr}</th>`).join('')}
          <th style="border:1px solid #999; padding:8px;">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          ${clase.atributos.map(() => `<td style="border:1px solid #ccc; padding:8px;">...</td>`).join('')}
          <td style="border:1px solid #ccc; padding:8px;">
            <button style="margin-right:4px;">Editar</button>
            <button>Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
    `.trim();
  
    return formHTML;
  };
  ;

  const copiarAlPortapapeles = (codigo) => {
    navigator.clipboard.writeText(codigo);
    alert('✅ Código copiado al portapapeles');
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <div className="generate-container">
          <div className="generate-card">
            <img src={angularLogo} alt="Upload Icon" className="generate-image" />
            <h2>Sube tu Diagrama</h2>
            <p>Admite archivos .drawio, .xml y .mdj</p>

            <input 
              type="file" 
              id="fileUpload"
              accept=".drawio,.xml,.mdj" 
              onChange={handleFile} 
              style={{ display: 'none' }}
            />

            <label htmlFor="fileUpload" className="generate-button">
              📂 Seleccionar Archivo
            </label>
          </div>
        </div>

        {modo === "staruml" && (
          <>
            <div style={{ marginTop: "20px" }}>
              <h2>🧾 Clases en StarUML:</h2>
              <ul>
                {clases.map((clase, idx) => {
                  const codigoHTML = generarHTMLCrudCompleto(clase);
                  return (
                    <li key={idx} style={{ marginBottom: "30px" }}>
                      📦 <strong>{clase.name}</strong>
                      <ul>
                        {clase.atributos.map((a, i) => (
                          <li key={i}>🔸 Atributo: {a}</li>
                        ))}
                        {clase.operaciones.map((o, i) => (
                          <li key={i}>⚙️ Operación: {o}</li>
                        ))}
                      </ul>

                      <h3>📝 Código HTML del CRUD:</h3>
                      <textarea
                        readOnly
                        rows={20}
                        style={{ width: "100%", fontFamily: "monospace" }}
                        value={codigoHTML}
                      ></textarea>
                      <div style={{ marginTop: "10px" }}>
                        <button
                          onClick={() => copiarAlPortapapeles(codigoHTML)}
                          style={{ marginRight: "10px" }}
                        >
                          📋 Copiar Código
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem("htmlGenerado", codigoHTML);
                            alert(`✅ Código de la clase "${clase.name}" guardado en LocalStorage`);
                            navigate('/generar-angular');   // Redirección automática
                          }}
                          style={{ padding: "6px 12px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                         Descargar Codigo en Angular
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* CRUD dinámico por clase */}
            <div style={{ marginTop: "40px" }}>
              <h2>🛠 CRUD dinámico por clase</h2>
              {clases.map((clase, idx) => {
                const formState = formularios[clase.name];
                if (!formState) return null;

                return (
                  <div key={idx} style={{ marginBottom: "40px", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
                    <h3>📦 {clase.name}</h3>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        enviarFormulario(clase.name);
                      }}
                    >
                      {clase.atributos.map((attr, i) => (
                        <div key={i} style={{ marginBottom: "10px" }}>
                          <label>
                            {attr}:{" "}
                            <input
                              type="text"
                              name={attr}
                              value={formState.form[attr] || ""}
                              onChange={(e) => actualizarFormulario(clase.name, { [attr]: e.target.value })}
                              style={{ padding: "5px", width: "200px" }}
                            />
                          </label>
                        </div>
                      ))}
                      <button type="submit" style={{ padding: "6px 12px", marginTop: "10px" }}>
                        {formState.editIndex !== null ? "Actualizar" : "Agregar"}
                      </button>
                    </form>

                    {formState.data.length > 0 && (
                      <table border="1" cellPadding="5" style={{ marginTop: "20px", width: "100%" }}>
                        <thead>
                          <tr>
                            {clase.atributos.map((attr, idx) => (
                              <th key={idx}>{attr}</th>
                            ))}
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formState.data.map((item, idx) => (
                            <tr key={idx}>
                              {clase.atributos.map((attr, i) => (
                                <td key={i}>{item[attr]}</td>
                              ))}
                              <td>
                                <button onClick={() => editarElemento(clase.name, idx)}>Editar</button>
                                <button onClick={() => eliminarElemento(clase.name, idx)}>Eliminar</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default VisorDiagramas;
