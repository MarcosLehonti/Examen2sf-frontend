import React, { useEffect, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Navbar from './Navbar';

const htmlToFlutterWidgets = () => {
  const htmlString = localStorage.getItem("htmlGenerado") || "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${htmlString}</body>`, 'text/html');
  const elements = Array.from(doc.body.querySelectorAll('form > *'));

  const parseStyle = (styleStr) =>
    Object.fromEntries(
      styleStr
        .split(';')
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => {
          const [key, val] = s.split(':');
          return [key.trim(), val.trim()];
        })
    );

  const styleToFlutter = (styles) => {
    const width = styles['width']?.replace('px', '');
    const height = styles['height']?.replace('px', '');
    const bg = styles['background-color']?.replace('#', '0xFF');
    const borderRadius = styles['border-radius']?.replace('px', '');
    const padding = styles['padding']?.replace('px', '') || '0';

    const decorationParts = [];
    if (bg) decorationParts.push(`color: Color(0xFF${bg.slice(-6)})`);
    if (borderRadius) decorationParts.push(`borderRadius: BorderRadius.circular(${borderRadius})`);

    const containerProps = [];
    if (width && height) containerProps.push(`width: ${width}, height: ${height}`);
    if (decorationParts.length) containerProps.push(`decoration: BoxDecoration(${decorationParts.join(', ')})`);
    if (padding) containerProps.push(`padding: EdgeInsets.all(${padding})`);

    return { containerProps };
  };

  const convertElement = (el) => {
    const tag = el.tagName.toLowerCase();
    const styles = parseStyle(el.getAttribute('style') || '');
    const { containerProps } = styleToFlutter(styles);
    let flutterChild = '';

    if (tag === 'label') {
      const input = el.querySelector('input[type="checkbox"]');
      const labelText = el.textContent.trim();
      flutterChild = input
        ? `Row(children: [Checkbox(value: false, onChanged: (v) {}), Text('${labelText}')])`
        : `Text('${labelText}')`;
    } else if (tag === 'input') {
      const type = el.getAttribute('type') || 'text';
      const placeholder = el.getAttribute('placeholder') || '';
      flutterChild = `TextField(decoration: InputDecoration(hintText: '${placeholder}'))`;
    } else if (tag === 'button') {
      flutterChild = `ElevatedButton(onPressed: () {}, child: Text('${el.textContent.trim()}'))`;
    } else if (tag === 'table') {
      const headers = Array.from(el.querySelectorAll('th')).map(th => `DataColumn(label: Text('${th.textContent.trim()}'))`);
      const rows = Array.from(el.querySelectorAll('tbody tr')).map(tr => {
        const cells = Array.from(tr.querySelectorAll('td')).map(td => `DataCell(Text('${td.textContent.trim()}'))`);
        return `DataRow(cells: [${cells.join(', ')}])`;
      });
      flutterChild = `DataTable(columns: [${headers.join(', ')}], rows: [${rows.join(', ')}])`;
    } else {
      return null;
    }

    return flutterChild;
  };

  const flutterWidgets = elements.map(convertElement).filter(Boolean);
  return flutterWidgets.join(',\n  ');
};

export default function GenerarFlutterBoceto() {
  const [flutterCode, setFlutterCode] = useState('');
  const [mejorado, setMejorado] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  useEffect(() => {
    const generatedWidgets = htmlToFlutterWidgets();

    const template = `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData.dark(),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ${generatedWidgets}
          ],
        ),
      ),
    );
  }
}`;

    setFlutterCode(template);
  }, []);

  async function mejorarCodigo() {
    setLoading(true);
    const prompt = `mejora este código y soluciona errores para que funcione mejor en Flutter, organizalo de forma que todo se vea y no se tapen los compoenntes entre si:\n\n${flutterCode}`;

    try {
      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });
      const raw = result.text || '';
      const match = raw.match(/```(?:dart)?\s*([\s\S]*?)```/);
      if (match && match[1]) {
        setMejorado(match[1].trim());
      } else {
        setMejorado(raw);
      }
    } catch (err) {
      console.error('Error llamando a Gemini:', err);
      setMejorado('Error al llamar a la API de Gemini.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDescargarZip() {
    if (!mejorado || mejorado.includes('Error')) {
      alert('No hay código válido para descargar.');
      return;
    }

    const zip = new JSZip();
    const root = zip.folder('flutter_project');

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

    root.folder('test');
    root.folder('assets');

    const lib = root.folder('lib');
    lib.file('main.dart', mejorado);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'flutter_project.zip');
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '50px' }}>
        <h2>Código Flutter generado</h2>
        <textarea
          style={{
            width: '100%',
            height: '300px',
            fontFamily: 'monospace',
            fontSize: '14px',
            whiteSpace: 'pre',
          }}
          value={flutterCode}
          readOnly
        />

        <button onClick={mejorarCodigo} disabled={loading} style={{ margin: '10px 0', padding: '10px 20px' }}>
          {loading ? 'Mejorando...' : 'Mejorar con IA'}
        </button>

        {mejorado && (
          <>
            <h3>Código mejorado por Gemini</h3>
            <textarea
              style={{
                width: '100%',
                height: '300px',
                fontFamily: 'monospace',
                fontSize: '14px',
                whiteSpace: 'pre',
              }}
              value={mejorado}
              readOnly
            />

            <button
              onClick={handleDescargarZip}
              style={{
                marginTop: '10px',
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
          </>
        )}
      </div>
    </>
  );
}
