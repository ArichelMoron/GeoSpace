const SolidDefinitions = {
  cube: {
    inputs: [{ id: 'edge', label: 'Aresta (a)', type: 'number', value: 2, min: 0.1, step: 0.1 }],
    calculate: (inputs) => {
      const a = inputs.edge;
      return `<strong>Volume:</strong> ${Math.pow(a, 3).toFixed(2)} m³<br>` +
             `<strong>Área Total:</strong> ${(6 * Math.pow(a, 2)).toFixed(2)} m²<br>` +
             `<strong>Diagonal Espacial:</strong> ${(a * Math.sqrt(3)).toFixed(2)} m`;
    }
  },
  parallelepiped: {
    inputs: [
      { id: 'width', label: 'Largura (X)', type: 'number', value: 3, min: 0.1, step: 0.1 },
      { id: 'height', label: 'Altura (Y)', type: 'number', value: 1.5, min: 0.1, step: 0.1 },
      { id: 'depth', label: 'Profundidade (Z)', type: 'number', value: 2, min: 0.1, step: 0.1 }
    ],
    calculate: (inputs) => {
      const w = inputs.width, h = inputs.height, d = inputs.depth;
      return `<strong>Volume:</strong> ${(w * h * d).toFixed(2)} m³<br>` +
             `<strong>Área Superficial:</strong> ${(2 * (w * h + w * d + h * d)).toFixed(2)} m²<br>` +
             `<strong>Diagonal Espacial:</strong> ${(Math.sqrt(w*w + h*h + d*d)).toFixed(2)} m`;
    }
  },
  pyramid: {
    inputs: [
      { id: 'width', label: 'Largura Base (X)', type: 'number', value: 2, min: 0.1, step: 0.1 },
      { id: 'height', label: 'Altura (Y)', type: 'number', value: 2, min: 0.1, step: 0.1 },
      { id: 'depth', label: 'Profun. Base (Z)', type: 'number', value: 2, min: 0.1, step: 0.1 },
      { id: 'sides', label: 'Lados da Base', type: 'number', value: 4, min: 3, max: 20, step: 1 }
    ],
    calculate: (inputs) => {
      const w = inputs.width, h = inputs.height, d = inputs.depth, s = inputs.sides;
      let baseArea = w * d;
      if (s !== 4) {
        const r = (w + d) / 4;
        baseArea = 0.5 * s * r * r * Math.sin((2 * Math.PI) / s);
      }
      return `<strong>Área da Base:</strong> ${baseArea.toFixed(2)} m²<br>` +
             `<strong>Volume:</strong> ${((baseArea * h) / 3).toFixed(2)} m³`;
    }
  },
  sphere: {
    inputs: [{ id: 'radius', label: 'Raio (r)', type: 'number', value: 1.5, min: 0.1, step: 0.1 }],
    calculate: (inputs) => {
      const r = inputs.radius;
      return `<strong>Área Superficial:</strong> ${(4 * Math.PI * r * r).toFixed(2)} m²<br>` +
             `<strong>Volume:</strong> ${((4 / 3) * Math.PI * Math.pow(r, 3)).toFixed(2)} m³`;
    }
  },
  cylinder: {
    inputs: [
      { id: 'radius', label: 'Raio (r)', type: 'number', value: 1.2, min: 0.1, step: 0.1 },
      { id: 'height', label: 'Altura (h)', type: 'number', value: 3, min: 0.1, step: 0.1 },
      { id: 'showDiameter', label: 'Mostrar Diâmetro', type: 'checkbox', value: false }
    ],
    calculate: (inputs) => {
      const r = inputs.radius, h = inputs.height;
      return `<strong>Área Lateral:</strong> ${(2 * Math.PI * r * h).toFixed(2)} m²<br>` +
             `<strong>Área Total:</strong> ${(2 * Math.PI * r * (h + r)).toFixed(2)} m²<br>` +
             `<strong>Volume:</strong> ${(Math.PI * r * r * h).toFixed(2)} m³`;
    }
  },
  cone: {
    inputs: [
      { id: 'radius', label: 'Raio (r)', type: 'number', value: 1.2, min: 0.1, step: 0.1 },
      { id: 'height', label: 'Altura (h)', type: 'number', value: 3, min: 0.1, step: 0.1 },
      { id: 'showDiameter', label: 'Mostrar Diâmetro', type: 'checkbox', value: false }
    ],
    calculate: (inputs) => {
      const r = inputs.radius, h = inputs.height;
      const g = Math.sqrt(r*r + h*h);
      return `<strong>Área Total:</strong> ${(Math.PI * r * (r + g)).toFixed(2)} m²<br>` +
             `<strong>Volume:</strong> ${((Math.PI * r * r * h) / 3).toFixed(2)} m³<br>` +
             `<strong>Geratriz:</strong> ${g.toFixed(2)} m`;
    }
  }
};

window.SolidDefinitions = SolidDefinitions;