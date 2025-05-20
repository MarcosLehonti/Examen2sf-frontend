import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import proyectosSVG from "../assets/proyecto1.svg"; // Asegúrate que esté bien la ruta
import "../styles/MisProyectos.css";

export default function MisProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Debes iniciar sesión');
          return;
        }

        const response = await axios.get('http://localhost:4000/api/projects', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProyectos(response.data);
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
        alert('Error al cargar tus proyectos');
      } finally {
        setLoading(false);
      }
    };

    fetchProyectos();
  }, []);

  if (loading) {
    return <div className="loading-container">Cargando proyectos...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="misproyectos-container">
        <div className="svg-only-container">
          <img src={proyectosSVG} alt="Proyectos" className="svg-only" />
        </div>

        {proyectos.length === 0 ? (
          <p className="no-projects-text">No tienes proyectos guardados todavía.</p>
        ) : (
          <div className="projects-list">
            {proyectos.map((proyecto) => (
              <div key={proyecto.id} className="project-item">
                <h3 className="project-name">{proyecto.nombre}</h3>
                <pre className="code-block">
                  <code>{proyecto.codigo}</code>
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
