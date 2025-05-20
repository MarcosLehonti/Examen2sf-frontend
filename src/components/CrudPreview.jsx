export default function CrudPreview({ classData }) {
    return (
      <div className="crud-preview">
        <h2>{classData.name}</h2>
        <form>
          {classData.attributes.map(attr => (
            <div key={attr.name}>
              <label>{attr.name}</label>
              <input type="text" name={attr.name} />
            </div>
          ))}
          <button type="submit">Guardar</button>
        </form>
      </div>
    );
  }
  