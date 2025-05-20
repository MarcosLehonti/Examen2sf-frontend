import { XMLParser } from "fast-xml-parser";

export function parseClassesFromXML(xmlString) {
  const parser = new XMLParser();
  const json = parser.parse(xmlString);

  // Esto depende del formato UML exportado, este es un ejemplo genérico:
  const classes = [];

  const elements = json?.XMI?.Model?.Class || [];

  const classArray = Array.isArray(elements) ? elements : [elements];

  for (const cls of classArray) {
    const name = cls?.["@_name"] || "SinNombre";
    const attributes = cls?.Attribute?.map(attr => ({
      name: attr["@_name"],
      type: attr["@_type"] || "string"
    })) || [];

    classes.push({ name, attributes });
  }

  return classes;
}
