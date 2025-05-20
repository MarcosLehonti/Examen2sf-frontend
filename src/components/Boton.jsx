export default function Boton({ id, x, y, text, color, onMouseDown }) {
  return (
    <button
      onMouseDown={onMouseDown(id)}
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        cursor: "move",
        padding: "8px 16px",
        backgroundColor: color,   // 🔹 Aquí usamos la prop correctamente
        color: "#fff",
        border: "none",
        borderRadius: "4px",
      }}
    >
      {text}
    </button>
  );
}
