import React from 'react';
import '../styles/Manual.css';
import creacionProyectoImg from '../assets/opcionesproyecto.png';
import usoLienzoImg from '../assets/uso-lienzo.jpg'; 

import configuracionSalaImg from '../assets/configuracionsala.jpg'; 
import promptpng from '../assets/prompt.png'; 
import img from '../assets/foto-boceto.jpg'; 
import flutteralienzo from '../assets/flutteralienzo.png'; 




const Manual = () => {
    return (
      <div className="manual-container">
        <h1 className="title">📘 Manual del Usuario</h1>
  
        {/* Sección 1 */}
        <section className="manual-section">
          <img src={creacionProyectoImg} alt="Creación de Proyecto" className="section-image" />
          <h2 className="section-title">1️⃣ Creación de Proyecto</h2>
          <p className="section-description">
            Para comenzar, puedes crear un nuevo proyecto de tres maneras:
          </p>
  
          <div className="options-container">
            <div className="option-card">
              <h3>📥 Utilizar el Prompt</h3>
              <p>Seleciona el tex area que sale y especifica lo que quieres en codigo flutter, ejemplo: hazme un login en flutter</p>
            </div>
            <div className="option-card">
              <h3>🖼️ Subir una imagen</h3>
              <p>Sube una imagen con tu diseño o boceto. El sistema lo interpretará visualmente.</p>
            </div>
            <div className="option-card">
              <h3>🎨 Crear un lienzo vacío</h3>
              <p>Comienza desde cero arrastrando y soltando componentes visuales.</p>
            </div>
          </div>
        </section>
  
        {/* Sección 2 */}
        <section className="manual-section">
          <img src={usoLienzoImg} alt="Uso del Lienzo" className="section-image" />
          <h2 className="section-title">2️⃣ Cómo usar el lienzo</h2>
          <p className="section-description">
            Para la parte del lienzo tenemos tres áreas:
          </p>
  
          <div className="option-card">
            <ul>
              <li>
                Parte Izquierda: aquí se encuentran los componentes. Presiona uno para su creación. También podrás eliminarlos o editarlos.
              </li>
              <li>
               Parte Central:  en esta área se visualizan los componentes que arrastres o crees.
              </li>
              <li>
               Parte Derecha: se genera el código HTML basado en los componentes del lienzo.
              </li>
            </ul>
          </div>
        </section>


        {/* Sección 3: Configuración de la sala */}
        <section className="manual-section">
        <img
            src={configuracionSalaImg}
            alt="Configuración de la sala"
            className="section-image"
        />
        <h2 className="section-title">3️⃣ Configuración de la sala</h2>
        <p className="section-description">
            En esta vista podrás copiar el enlace de la sala para compartir con otros usuarios y así permitir la colaboración en tiempo real.
        </p>

        <div className="option-card">
            <ul>
            <li>
                Copiar enlace: comparte el link único de la sala con otros usuarios para que se unan.
            </li>
            <li>
                Nombre de la sala: puedes asignar un nombre identificativo a tu sala colaborativa.
            </li>
            <li>
                Descripción: añade un texto que explique de qué trata la sala o su propósito.
            </li>
            </ul>
        </div>
        </section>




        {/* Sección 4: Generar proyecto Angular y descargar */}
        <section className="manual-section">
        <img
            src={promptpng}
            alt="Como usar el Prompt"
            className="section-image"
        />
        <h2 className="section-title">4️⃣ Usa el Prompt</h2>
        <p className="section-description">
            Puedes especififcar como quieres que se vea tu vista en flutter.
        </p>

        <div className="option-card">
            <ul>
            <li>
               Ingresa lo que deseas generar.
            </li>
            <li>
              presiona el boton enviar.
            </li>
            <li>
              abajo aparecera el codigo solicitado en formato flutter
            </li>
            <li>
              Listo, ahora puedes llevar tu codigo al lienzo o descargarlo como proyecto flutter
            </li>
            </ul>
        </div>
        </section>


        {/* Sección 5: Generar mediante fotos */}
      <section className="manual-section">
        <img
          src={img}
          alt="Generar mediante fotos"
          className="section-image"
        />
        <h2 className="section-title">5️⃣ Generar mediante fotos</h2>
        <p className="section-description">
          En este apartado encontrarás los pasos a seguir para dibujar tu boceto correctamente y que el sistema lo interprete de forma automática.
        </p>

        <div className="option-card">
          <ul>
            <li>
              ✏️ Usa texto claro y legible en tu imagen o dibujo. El sistema puede reconocer palabras clave.
            </li>
            <li>
              🧠 Las siguientes palabras son detectadas automáticamente (ejemplo):
              <ul style={{ marginTop: "10px" }}>
                <li><strong>Nombre</strong>, <strong>Correo</strong>: genera campos de entrada de texto.</li>
                <li><strong>Guardar</strong>, <strong>Cancelar</strong>: genera botones funcionales.</li>
                <li><strong>Tabla</strong>: genera automáticamente una tabla visual con tres columnas y tres filas.</li>
              </ul>
            </li>
            <li>
              📷 Puedes subir fotos escaneadas o imágenes dibujadas a mano, siempre que el texto sea legible.
            </li>
            <li>
              🚀 Una vez cargada la imagen, se mostrará una vista previa y el formulario generado al instante.
            </li>
          </ul>
        </div>
      </section>



       {/* Sección 6: Convertir a compoenentes del Lienzo */}
      <section className="manual-section">
        <img
          src={flutteralienzo}
          alt="Componentes a Lienzo"
          className="section-image"
        />
        <h2 className="section-title">6️⃣ Componentes a Lienzo</h2>
        <p className="section-description">
          En este apartado encontrarás los pasos a seguir para llevar tu codigo del prompt o del boceto a componentes en el lienzo.
        </p>

        <div className="option-card">
          <ul>
            <li>
              🧠 Presiona el boton de convertir a componentes en el lienzo 
            </li>
            <li>
              🧠 Primero copia el codigo generado en el segundo tex area 
            </li>
             <li>
               
              🧠 Segundo presiona el boton de ir a lienzo 

             </li>
            <li>
              🚀 Una vez cargada la pagina pega el codigo en el lienzo en la parte de HTML Generado
            </li>
          </ul>
        </div>
      </section>




      </div>
    );
  };
  
  export default Manual;