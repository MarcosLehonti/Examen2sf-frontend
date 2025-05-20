export default function Label({ id, x, y, text, fontSize, width, height, onMouseDown }) {
  return (
    <label
      onMouseDown={onMouseDown(id)}
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        border: "1px dashed gray",
        cursor: "move",
        fontSize: `${fontSize}px`
      }}
    >
      {text}
    </label>
  );
}
