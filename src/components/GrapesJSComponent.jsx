/ src/components/GrapesJSComponent.jsx
import React, { useEffect } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

const GrapesJSComponent = () => {
  useEffect(() => {
    const editor = grapesjs.init({
      container: '#gjs',
      height: '100vh',
      width: '100%',
      fromElement: false,
      storageManager: false,
    });

    // Activar movimiento libre horizontal y vertical
    editor.on('component:add', (model) => {
      const style = model.get('style') || {};
      model.set({
        draggable: true,
        selectable: true,
        highlightable: true,
        resizable: true,
        removable: true,
        style: {
          ...style,
          position: 'absolute',
          top: style.top || '100px',
          left: style.left || '100px', // 👈 Aseguramos que se pueda mover en eje X
        },
      });
    });

    // Bloques
    editor.BlockManager.add('custom-button', {
      label: 'Botón arrastrable',
      content: `<button style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Botón</button>`,
      attributes: { class: 'fa fa-hand-pointer' },
      category: 'Componentes personalizados',
    });

    editor.BlockManager.add('custom-text', {
      label: 'Texto arrastrable',
      content: `<p style="font-size: 16px; color: #333;">Texto libre</p>`,
      attributes: { class: 'fa fa-font' },
      category: 'Componentes personalizados',
    });

    editor.BlockManager.add('custom-box', {
      label: 'Caja',
      content: `<div style="width: 100px; height: 100px; background-color: #ccc;"></div>`,
      attributes: { class: 'fa fa-square' },
      category: 'Componentes personalizados',
    });

    // Contenido inicial (debe ser relative)
    editor.setComponents(`
      <div style="position: relative; width: 100%; min-height: 100vh; background: #efefef;">
        <h1>Bienvenido</h1>
        <p>Arrastra y mueve libremente</p>
      </div>
    `);
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      {/* Lienzo de edición */}
      <div
        id="gjs"
        style={{
          flexGrow: 1,
          height: '100vh',
          border: '1px solid #ccc',
          overflow: 'visible', // 👈 Esto evita limitar el movimiento
        }}
      ></div>

      {/* Panel de bloques */}
      <div
        style={{
          width: '300px',
          overflowY: 'auto',
          background: '#f4f4f4',
          borderLeft: '1px solid #ddd',
          padding: '10px',
        }}
      ></div>
    </div>
  );
};

export default GrapesJSComponent;
