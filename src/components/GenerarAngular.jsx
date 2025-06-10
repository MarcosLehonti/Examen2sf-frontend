import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import '../styles/GenerarAngular.css';
import flutterLogo from '../assets/ilustracion.svg'; // Asegúrate de tener un logo Flutter
import Navbar from './Navbar';

const GenerarAngular = () => {
  const generarZip = async () => {
    const zip = new JSZip();
    const root = zip.folder('flutter_project');

    // Archivos raíz
    root.file('README.md', '# Flutter Project\nProyecto generado automáticamente.');
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
description: A new Flutter project.
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

    // Carpetas vacías
    root.folder('test');
    root.folder('assets');

    // lib/main.dart
    const lib = root.folder('lib');
    lib.file('main.dart', `
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.teal,
      ),
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
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text('You have pushed the button this many times:'),
            Text(
              '\$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
    `.trim());

    // Generar el zip
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'flutter_project.zip');
  };

  return (
    <>
      <Navbar />
      <div className="generate-container">
        <div className="generate-card">
          <img src={flutterLogo} alt="Flutter Logo" className="generate-image" />
          <h2>Generar Proyecto Flutter</h2>
          <p>Descarga automáticamente un proyecto Flutter listo para ejecutar.</p>
          <button onClick={generarZip} className="generate-button">
            Descargar Proyecto Flutter
          </button>
        </div>
      </div>
    </>
  );
};

export default GenerarAngular;
