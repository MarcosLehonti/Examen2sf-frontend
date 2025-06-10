export function htmlToFlutterDartFromLocalStorage() {
  const htmlString = localStorage.getItem("htmlGenerado") || "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${htmlString}</body>`, 'text/html');
  const elements = Array.from(doc.body.children);

  function parseStyle(styleStr) {
    return Object.fromEntries(
      styleStr
        .split(';')
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => {
          const [key, val] = s.split(':');
          return [key.trim(), val.trim()];
        })
    );
  }

  function styleToFlutter(styles) {
    const left = styles['left']?.replace('px', '') || '0';
    const top = styles['top']?.replace('px', '') || '0';
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

    return { left, top, containerProps };
  }

  function convertElement(el) {
    const tag = el.tagName.toLowerCase();
    const styles = parseStyle(el.getAttribute('style') || '');
    const { left, top, containerProps } = styleToFlutter(styles);
    let flutterChild = '';

    if (tag === 'button') {
      flutterChild = `ElevatedButton(onPressed: () {}, child: Text('${el.textContent.trim()}'))`;
    } else if (tag === 'label') {
      const input = el.querySelector('input[type="checkbox"]');
      const labelText = el.textContent.trim();
      flutterChild = input
        ? `Row(children: [Checkbox(value: false, onChanged: (v) {}), Text('${labelText}')])`
        : `Text('${labelText}')`;
    } else if (tag === 'input') {
      const type = el.getAttribute('type') || 'text';
      if (type === 'checkbox') return null;
      const placeholder = el.getAttribute('placeholder') || '';
      flutterChild = `TextField(decoration: InputDecoration(hintText: '${placeholder}'))`;
    } else if (tag === 'div') {
      const childWidgets = Array.from(el.children).map(convertElement).filter(Boolean);
      flutterChild = `Container(${containerProps.join(', ')}, child: Column(children: [${childWidgets.join(', ')}]))`;
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

    return `Positioned(left: ${left}, top: ${top}, child: ${flutterChild})`;
  }

  const flutterWidgets = elements.map(convertElement).filter(Boolean);
  return `Stack(children: [\n  ${flutterWidgets.join(',\n  ')}\n]);`;
}
