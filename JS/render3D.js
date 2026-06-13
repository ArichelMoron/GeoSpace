let scene, camera, primaryMesh, edgeLines;
let labelMeshes = [];
let meshMaterial;

let config = {
  faceColor: new BABYLON.Color3(0.23, 0.51, 0.96),
  edgeColor: new BABYLON.Color3(0.39, 0.45, 0.55),
  labelColor: "#f59e0b",
  alpha: 0.25
};

window.loadSolidViewer = (solidId, solidTitle, iconName) => {
  const titleIcon = document.getElementById("solidTitleIcon");
  titleIcon.setAttribute("data-lucide", iconName);
  document.getElementById("solidTitle").textContent = solidTitle;
  
  setupDynamicInputs(solidId);
  initBabylon();
  updateSolid(solidId);
  lucide.createIcons();
};

// ✅ Correção: Função que zera completamente o pipeline de renderização e remove artefatos fantasmas
window.clearCurrentScene = () => {
  if (primaryMesh) { primaryMesh.dispose(); primaryMesh = null; }
  if (edgeLines) { edgeLines.dispose(); edgeLines = null; }
  labelMeshes.forEach(l => l.mesh.dispose());
  labelMeshes = [];
  if (scene) {
    scene.dispose();
    scene = null;
  }
  if (window.geoEngine) {
    window.geoEngine.dispose();
    window.geoEngine = null;
  }
};

function setupDynamicInputs(solidId) {
  const container = document.getElementById("dynamicInputs");
  container.innerHTML = "";
  
  const def = window.SolidDefinitions[solidId];
  def.inputs.forEach(input => {
    const div = document.createElement("div");
    div.className = `input-field ${input.type === 'checkbox' ? 'checkbox-field' : ''}`;
    
    const label = document.createElement("label");
    label.setAttribute("for", input.id);
    label.textContent = input.label;
    
    const el = document.createElement("input");
    el.id = input.id;
    el.type = input.type;
    
    if (input.type === 'checkbox') {
      el.checked = input.value;
      div.appendChild(el);
      div.appendChild(label);
    } else {
      el.value = input.value;
      if (input.min !== undefined) el.min = input.min;
      if (input.max !== undefined) el.max = input.max;
      el.step = input.step || 1;
      div.appendChild(label);
      div.appendChild(el);
    }
    
    el.addEventListener("input", () => { updateSolid(solidId); });
    container.appendChild(div);
  });
}

function initBabylon() {
  const canvas = document.getElementById("renderCanvas");
  if (window.geoEngine) return; 

  window.geoEngine = new BABYLON.Engine(canvas, true);
  scene = new BABYLON.Scene(window.geoEngine);
  scene.clearColor = new BABYLON.Color4(0.06, 0.09, 0.16, 1);

  camera = new BABYLON.ArcRotateCamera("camera", Math.PI/4, Math.PI/3, 12, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
  light1.intensity = 0.8;
  const light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(-1, -1, 0), scene);
  light2.intensity = 0.4;
  
  meshMaterial = new BABYLON.StandardMaterial("meshMat", scene);
  meshMaterial.diffuseColor = config.faceColor;
  meshMaterial.alpha = config.alpha;
  meshMaterial.backFaceCulling = false; // Garante renderização das duas faces internas

  window.geoEngine.runRenderLoop(() => {
    if (scene) scene.render();
  });
  
  setupVisualListeners();
}

function setupVisualListeners() {
  document.getElementById("zoom").oninput = (e) => camera.radius = parseFloat(e.target.value);
  document.getElementById("faceAlpha").oninput = (e) => meshMaterial.alpha = parseFloat(e.target.value);
  
  document.getElementById("faceColor").oninput = (e) => {
    config.faceColor = BABYLON.Color3.FromHexString(e.target.value);
    meshMaterial.diffuseColor = config.faceColor;
  };
  
  document.getElementById("edgeColor").oninput = (e) => {
    config.edgeColor = BABYLON.Color3.FromHexString(e.target.value);
    if (edgeLines) edgeLines.color = config.edgeColor;
  };

  document.getElementById("labelColor").oninput = (e) => {
    config.labelColor = e.target.value;
    labelMeshes.forEach(l => l.textBlock.color = config.labelColor);
  };

  document.getElementById("bgColor").oninput = (e) => {
    const c = BABYLON.Color3.FromHexString(e.target.value);
    if (scene) scene.clearColor = new BABYLON.Color4(c.r, c.g, c.b, 1);
  };
}

function updateSolid(solidId) {
  if (!scene) return;
  const def = window.SolidDefinitions[solidId];
  const inputs = {};
  def.inputs.forEach(inp => {
    const el = document.getElementById(inp.id);
    inputs[inp.id] = inp.type === 'checkbox' ? el.checked : parseFloat(el.value) || 0.001;
  });

  if (primaryMesh) primaryMesh.dispose();
  if (edgeLines) edgeLines.dispose();
  labelMeshes.forEach(l => l.mesh.dispose());
  labelMeshes = [];

  buildMeshGeometry(solidId, inputs);

  if (primaryMesh) primaryMesh.material = meshMaterial;
  if (edgeLines) edgeLines.color = config.edgeColor;

  document.getElementById("volume").innerHTML = def.calculate(inputs);
}

// ✅ Correção: Modelagem geométrica e preenchimento 100% eficientes e corretos
function buildMeshGeometry(id, inputs) {
  if (id === 'cube') {
    const s = inputs.edge;
    primaryMesh = BABYLON.MeshBuilder.CreateBox("mesh", { size: s }, scene);
    
    const pts = [
      new BABYLON.Vector3(-s/2, -s/2, -s/2), new BABYLON.Vector3(s/2, -s/2, -s/2),
      new BABYLON.Vector3(s/2, s/2, -s/2), new BABYLON.Vector3(-s/2, s/2, -s/2),
      new BABYLON.Vector3(-s/2, -s/2, s/2), new BABYLON.Vector3(s/2, -s/2, s/2),
      new BABYLON.Vector3(s/2, s/2, s/2), new BABYLON.Vector3(-s/2, s/2, s/2)
    ];
    const paths = [
      [pts[0], pts[1], pts[2], pts[3], pts[0]], [pts[4], pts[5], pts[6], pts[7], pts[4]],
      [pts[0], pts[4]], [pts[1], pts[5]], [pts[2], pts[6]], [pts[3], pts[7]]
    ];
    edgeLines = BABYLON.MeshBuilder.CreateLineSystem("lines", { lines: paths }, scene);
    create3DLabel(`${s}`, new BABYLON.Vector3(0, -s/2 - 0.4, -s/2));
    
  } else if (id === 'parallelepiped') {
    const w = inputs.width, h = inputs.height, d = inputs.depth;
    primaryMesh = BABYLON.MeshBuilder.CreateBox("mesh", { width: w, height: h, depth: d }, scene);
    
    const pts = [
      new BABYLON.Vector3(-w/2, -h/2, -d/2), new BABYLON.Vector3(w/2, -h/2, -d/2),
      new BABYLON.Vector3(w/2, h/2, -d/2), new BABYLON.Vector3(-w/2, h/2, -d/2),
      new BABYLON.Vector3(-w/2, -h/2, d/2), new BABYLON.Vector3(w/2, -h/2, d/2),
      new BABYLON.Vector3(w/2, h/2, d/2), new BABYLON.Vector3(-w/2, h/2, d/2)
    ];
    const paths = [
      [pts[0], pts[1], pts[2], pts[3], pts[0]], [pts[4], pts[5], pts[6], pts[7], pts[4]],
      [pts[0], pts[4]], [pts[1], pts[5]], [pts[2], pts[6]], [pts[3], pts[7]]
    ];
    edgeLines = BABYLON.MeshBuilder.CreateLineSystem("lines", { lines: paths }, scene);
    create3DLabel(`X: ${w}`, new BABYLON.Vector3(0, -h/2 - 0.4, -d/2));
    create3DLabel(`Y: ${h}`, new BABYLON.Vector3(-w/2 - 0.4, 0, -d/2));

  } else if (id === 'sphere') {
    const r = inputs.radius;
    primaryMesh = BABYLON.MeshBuilder.CreateSphere("mesh", { diameter: r * 2, segments: 32 }, scene);
    
    const circlePoints = [];
    for (let i = 0; i <= 64; i++) {
      let angle = (i * 2 * Math.PI) / 64;
      circlePoints.push(new BABYLON.Vector3(r * Math.cos(angle), 0, r * Math.sin(angle)));
    }
    edgeLines = BABYLON.MeshBuilder.CreateLines("lines", { points: circlePoints }, scene);
    create3DLabel(`r = ${r}`, new BABYLON.Vector3(r / 2, 0.3, 0));

  } else if (id === 'cylinder') {
    const r = inputs.radius, h = inputs.height;
    primaryMesh = BABYLON.MeshBuilder.CreateCylinder("mesh", { diameterTop: r * 2, diameterBottom: r * 2, height: h, tessellation: 32 }, scene);
    
    const linePaths = [];
    const topCircle = [], botCircle = [];
    for (let i = 0; i <= 32; i++) {
      let angle = (i * 2 * Math.PI) / 32;
      let x = r * Math.cos(angle), z = r * Math.sin(angle);
      topCircle.push(new BABYLON.Vector3(x, h/2, z));
      botCircle.push(new BABYLON.Vector3(x, -h/2, z));
    }
    linePaths.push(topCircle, botCircle);
    linePaths.push([new BABYLON.Vector3(-r, -h/2, 0), new BABYLON.Vector3(-r, h/2, 0)]);
    linePaths.push([new BABYLON.Vector3(r, -h/2, 0), new BABYLON.Vector3(r, h/2, 0)]);
    
    if (inputs.showDiameter) {
      linePaths.push([new BABYLON.Vector3(-r, -h/2, 0), new BABYLON.Vector3(r, -h/2, 0)]);
      create3DLabel(`d = ${(r*2).toFixed(1)}`, new BABYLON.Vector3(0, -h/2 - 0.4, 0));
    }
    edgeLines = BABYLON.MeshBuilder.CreateLineSystem("lines", { lines: linePaths }, scene);
    create3DLabel(`h = ${h}`, new BABYLON.Vector3(r + 0.4, 0, 0));

  } else if (id === 'cone') {
    const r = inputs.radius, h = inputs.height;
    primaryMesh = BABYLON.MeshBuilder.CreateCylinder("mesh", { diameterTop: 0, diameterBottom: r * 2, height: h, tessellation: 32 }, scene);
    
    const linePaths = [];
    const botCircle = [];
    for (let i = 0; i <= 32; i++) {
      let angle = (i * 2 * Math.PI) / 32;
      botCircle.push(new BABYLON.Vector3(r * Math.cos(angle), -h/2, r * Math.sin(angle)));
    }
    linePaths.push(botCircle);
    linePaths.push([new BABYLON.Vector3(0, h/2, 0), new BABYLON.Vector3(-r, -h/2, 0)]);
    linePaths.push([new BABYLON.Vector3(0, h/2, 0), new BABYLON.Vector3(r, -h/2, 0)]);
    
    if (inputs.showDiameter) {
      linePaths.push([new BABYLON.Vector3(-r, -h/2, 0), new BABYLON.Vector3(r, -h/2, 0)]);
    }
    edgeLines = BABYLON.MeshBuilder.CreateLineSystem("lines", { lines: linePaths }, scene);
    create3DLabel(`r = ${r}`, new BABYLON.Vector3(r/2, -h/2 - 0.4, 0));
    create3DLabel(`h = ${h}`, new BABYLON.Vector3(r + 0.4, 0, 0));

  } else if (id === 'pyramid') {
    const w = inputs.width, h = inputs.height, d = inputs.depth, s = inputs.sides;
    
    // Construção correta e precisa da malha sólida da pirâmide (Preenchimento Real)
    const apex = new BABYLON.Vector3(0, h/2, 0);
    const basePts = [];
    for (let i = 0; i < s; i++) {
      let angle = (2 * Math.PI * i) / s;
      basePts.push(new BABYLON.Vector3((w/2) * Math.cos(angle), -h/2, (d/2) * Math.sin(angle)));
    }

    const positions = [];
    const indices = [];

    // Triangulação da Base
    for (let i = 1; i < s - 1; i++) {
      positions.push(basePts[0].x, basePts[0].y, basePts[0].z);
      positions.push(basePts[i].x, basePts[i].y, basePts[i].z);
      positions.push(basePts[i+1].x, basePts[i+1].y, basePts[i+1].z);
    }
    // Triangulação das Laterais
    for (let i = 0; i < s; i++) {
      const v1 = basePts[i];
      const v2 = basePts[(i + 1) % s];
      positions.push(apex.x, apex.y, apex.z);
      positions.push(v1.x, v1.y, v1.z);
      positions.push(v2.x, v2.y, v2.z);
    }

    for (let i = 0; i < positions.length / 3; i++) indices.push(i);

    const normals = [];
    BABYLON.VertexData.ComputeNormals(positions, indices, normals);

    const vertexData = new BABYLON.VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals;

    primaryMesh = new BABYLON.Mesh("pyramidMesh", scene);
    vertexData.applyToMesh(primaryMesh);

    // Wireframe estrutural
    const paths = [[...basePts, basePts[0]]];
    basePts.forEach(pt => paths.push([pt, apex]));
    edgeLines = BABYLON.MeshBuilder.CreateLineSystem("lines", { lines: paths }, scene);
    
    create3DLabel(`H: ${h}`, new BABYLON.Vector3(w/2 + 0.4, 0, 0));
  }
}

function create3DLabel(text, position) {
  const plane = BABYLON.MeshBuilder.CreatePlane("labelPlane", { size: 0.75 }, scene);
  plane.position = position;
  plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
  
  const texture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
  const tb = new BABYLON.GUI.TextBlock();
  tb.text = text;
  tb.color = config.labelColor;
  tb.fontSize = 200;
  tb.fontWeight = "bold";
  texture.addControl(tb);
  
  labelMeshes.push({ mesh: plane, textBlock: tb });
}