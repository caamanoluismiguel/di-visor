// D.I.Visor: el Edificio 106 dibujado en línea y explicado desde el diseño industrial.
// Piezas separadas del .blend v016 (modelo/edificio_piezas.glb) + entrada y tejas de main del visor.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { DETALLES } from './detalles.js';

const $ = (id) => document.getElementById(id);
const COL = () => {
  const s = getComputedStyle(document.documentElement);
  return {
    papel: new THREE.Color(s.getPropertyValue('--papel').trim()),
    tinta: new THREE.Color(s.getPropertyValue('--linea').trim()),
    enfasis: new THREE.Color(s.getPropertyValue('--enfasis').trim()),
    tenue: new THREE.Color(s.getPropertyValue('--tenue').trim()),
    poche: new THREE.Color(s.getPropertyValue('--poche').trim()),
  };
};
let C = COL();

// ---------------------------------------------------------------- escena
const lienzo = $('lienzo');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.localClippingEnabled = true;
renderer.setClearColor(0x000000, 0);
lienzo.appendChild(renderer.domElement);
const rotulos = new CSS2DRenderer();
Object.assign(rotulos.domElement.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });
rotulos.domElement.hidden = true;
lienzo.appendChild(rotulos.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 600);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.maxPolarAngle = Math.PI * 0.495;

const plano = new THREE.Plane(new THREE.Vector3(0, 0, -1), 1e4);
const planos = [plano];
const raiz = new THREE.Group();
scene.add(raiz);
const detalleRaiz = new THREE.Group();
detalleRaiz.visible = false;
scene.add(detalleRaiz);

// suelo de referencia: una sola línea de terreno y una rejilla tenue
const suelo = new THREE.GridHelper(120, 60);
suelo.material.transparent = true;
suelo.material.opacity = 0.08;
scene.add(suelo);

function tamano() {
  const r = lienzo.getBoundingClientRect();
  renderer.setSize(r.width, r.height);
  rotulos.setSize(r.width, r.height);
  camera.aspect = r.width / r.height;
  camera.updateProjectionMatrix();
}
addEventListener('resize', tamano);
tamano();

// ---------------------------------------------------------------- sistemas
// orden = de abajo hacia arriba en el despiece
const SISTEMAS = [
  { k: 'base', t: 'Base y suelo', d: [0, -3.2, 0],
    re: /Foundation|lattice|vent recess|plinth|drainage|rust brown vent slat|vent (central|cross) timber/i },
  { k: 'estructura', t: 'Losas y cartelas', d: [0, 0, 0],
    re: /Floor slab|haunch|open-bay pier|floor plane|ceiling plane|threshold|skirting|light strip/i },
  { k: 'muros', t: 'Muros', d: [0, 3.5, 0], re: /solid wall|sill band|eave wall band/i },
  { k: 'ventanas', t: 'Ventanas y lamas', d: [0, 7, 0], re: /window|pane/i },
  { k: 'cubierta', t: 'Cubierta', d: [0, 11, 0], re: /rafter|roof|sunshade|ridge|Monitor|^cubiertas:/i },
  { k: 'accesos', t: 'Accesos', d: [0, -1.6, 7],
    re: /^entrada:|stair|tread|riser|door|ramp|corridor|paving|apron|cheek|replacement step|handle/i },
  { k: 'servicios', t: 'Instalaciones', d: [0, -1.6, -7],
    re: /Condenser|transformer|Utility cabinet|pipe strap|antenna|wayfinding/i },
];
// el orden de prueba importa: puertas y escaleras antes que ventanas
const ORDEN_PRUEBA = ['accesos', 'servicios', 'base', 'estructura', 'cubierta', 'ventanas', 'muros'];
function sistemaDe(fam) {
  for (const k of ORDEN_PRUEBA) if (SISTEMAS.find((s) => s.k === k).re.test(fam)) return k;
  return 'estructura';
}
const grupos = {};
for (const s of SISTEMAS) {
  const g = new THREE.Group();
  g.userData = { s, base: new THREE.Vector3(), d: new THREE.Vector3(...s.d) };
  raiz.add(g);
  grupos[s.k] = g;
}

// ---------------------------------------------------------------- material de dibujo
const registro = []; // { relleno, lineas, fam, sistema }
const poches = [];
function materialRelleno() {
  return new THREE.MeshBasicMaterial({
    color: C.papel, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
    side: THREE.DoubleSide, clippingPlanes: planos, transparent: true, opacity: 1,
  });
}
function materialLinea() {
  return new THREE.LineBasicMaterial({ color: C.tinta, clippingPlanes: planos, transparent: true, opacity: 0.9 });
}
function dibujar(mesh, fam, umbral = 24) {
  const sistema = sistemaDe(fam);
  mesh.material = materialRelleno();
  mesh.userData.fam = fam;
  mesh.userData.sistema = sistema;
  const lineas = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, umbral), materialLinea());
  lineas.raycast = () => {};
  mesh.add(lineas);
  // poché: el interior de lo cortado se ve en tono, como la masa cortada en un plano
  const poche = new THREE.Mesh(mesh.geometry, new THREE.MeshBasicMaterial({ color: C.poche, side: THREE.BackSide, clippingPlanes: planos }));
  poche.raycast = () => {};
  poche.visible = false;
  poches.push(poche);
  mesh.add(poche);
  mesh.material.side = THREE.FrontSide;
  registro.push({ relleno: mesh, lineas, fam, sistema });
  return sistema;
}

// ---------------------------------------------------------------- carga
const draco = new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/');
const loader = new GLTFLoader().setDRACOLoader(draco).setMeshoptDecoder(MeshoptDecoder);
const cargar = (url) => new Promise((ok, mal) => loader.load(url, ok, undefined, mal));

async function cargarEdificio() {
  const [piezas, entrada] = await Promise.all([
    cargar('modelo/edificio_piezas.glb'),
    cargar('modelo/entrada.glb'),
  ]);
  const poner = (gltf, prefijo, umbral, filtro = () => true) => {
    gltf.scene.updateMatrixWorld(true);
    const mallas = [];
    gltf.scene.traverse((o) => { if (o.isMesh && filtro(o)) mallas.push(o); });
    for (const m of mallas) {
      // el nombre de la familia está en el nodo (piezas) o en el material (GLB del visor)
      const nombre = prefijo ? `${prefijo}:${(m.material?.name || m.name).replace(/\s\d+$/, '')}` : (m.name || m.parent?.name);
      const fam = nombre.replace(/_\d+$/, '').replace(/_/g, ' ').replace(/\d{3}$/, '')
        .replace(/^V01\d /, '').replace(/^(end|far end|rear|street) (window )?\d+-\d+ /, '$2').trim();
      const s = dibujar(m, fam, umbral);
      if (TEJADO.test(fam)) rayarTejas(m);
      grupos[s].attach(m);
    }
  };
  // en el .blend v016 el pórtico y la rampa aún no tienen las correcciones de main
  poner(piezas, '', 24, (m) => !/continuous.ramp.approach|ramp.wall.junction/i.test(m.name + (m.parent?.name || '')));
  poner(entrada, 'entrada', 30);
}

// Tejas: en vez de dibujar cada teja, una línea por canal siguiendo la pendiente, como en un plano.
// El paso de 0,5 m es un valor de dibujo, no una medida de la teja real.
const TEJADO = /substrate|outer eave|upper hip|Gabled roof monitor/i;
const PASO_TEJA = 0.5;
function rayarTejas(mesh) {
  mesh.updateMatrixWorld(true);
  const g = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry;
  const pos = g.attributes.position;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const n = new THREE.Vector3(), h = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const pts = [];
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
    b.fromBufferAttribute(pos, i + 1).applyMatrix4(mesh.matrixWorld);
    c.fromBufferAttribute(pos, i + 2).applyMatrix4(mesh.matrixWorld);
    n.subVectors(b, a).cross(c.clone().sub(a)).normalize();
    if (Math.abs(n.y) < 0.25 || Math.abs(n.y) > 0.985) continue; // muros y planos casi horizontales fuera
    h.crossVectors(n, up).normalize(); // horizontal dentro del faldón: las líneas lo cortan cada PASO_TEJA
    const da = a.dot(h), db = b.dot(h), dc = c.dot(h);
    const lo = Math.ceil(Math.min(da, db, dc) / PASO_TEJA), hi = Math.floor(Math.max(da, db, dc) / PASO_TEJA);
    for (let k = lo; k <= hi; k++) {
      const v = k * PASO_TEJA, cruces = [];
      for (const [p, q, dp, dq] of [[a, b, da, db], [b, c, db, dc], [c, a, dc, da]]) {
        if ((dp - v) * (dq - v) < 0) cruces.push(p.clone().lerp(q, (v - dp) / (dq - dp)));
      }
      if (cruces.length === 2) pts.push(...cruces);
    }
  }
  if (!pts.length) return;
  const inv = mesh.matrixWorld.clone().invert();
  const geo = new THREE.BufferGeometry().setFromPoints(pts.map((p) => p.applyMatrix4(inv)));
  const lineas = new THREE.LineSegments(geo, materialLinea());
  lineas.material.opacity = 0.45;
  lineas.raycast = () => {};
  mesh.add(lineas);
  registro.push({ relleno: mesh, lineas, fam: mesh.userData.fam, sistema: mesh.userData.sistema, rayado: true });
}

// ---------------------------------------------------------------- contenido
let DATOS = { edificio: {}, sistemas: {}, piezas: {}, lecciones: [] };
async function cargarContenido() {
  try {
    const r = await fetch('contenido/lecciones.json', { cache: 'no-cache' });
    if (r.ok) DATOS = await r.json();
  } catch (e) { console.warn('Sin contenido', e); }
}

// ---------------------------------------------------------------- ficha
const CERTEZA = {
  foto: 'Confirmado en foto del 106',
  medido: 'Medido en el modelo',
  modelo: 'Supuesto del modelo 3D',
  general: 'Principio general del tipo de pieza',
};
function ficha(f = {}) {
  $('f-codigo').textContent = f.codigo || 'Sistema completo';
  $('f-titulo').textContent = f.titulo || '';
  $('f-texto').textContent = f.texto || '';
  const dl = $('f-datos');
  dl.innerHTML = '';
  for (const [k, v] of f.datos || []) {
    const d = document.createElement('div');
    d.innerHTML = '<dt></dt><dd></dd>';
    d.firstChild.textContent = k;
    d.lastChild.textContent = v;
    dl.appendChild(d);
  }
  $('f-principio-b').hidden = !f.principio;
  $('f-principio').textContent = f.principio || '';
  $('f-mira-b').hidden = !f.mira;
  $('f-mira').textContent = f.mira || '';
  const sello = $('f-sello');
  sello.innerHTML = '';
  if (f.certeza || f.fuente) {
    const b = document.createElement('b');
    b.textContent = (CERTEZA[f.certeza] || f.certeza || '') + (f.fuente ? '. ' : '');
    sello.append(b, f.fuente || '');
  }
}

// ---------------------------------------------------------------- resaltado
let seleccion = null; // { prueba: (reg) => bool }
function resaltar(prueba) {
  seleccion = prueba;
  for (const r of registro) {
    const on = !prueba || prueba(r);
    r.relleno.material.opacity = !prueba || on ? 1 : 0.1;
    r.relleno.material.depthWrite = !prueba || on;
    r.lineas.material.color.copy(prueba && on ? C.enfasis : prueba ? C.tenue : C.tinta);
    r.lineas.material.opacity = (!prueba ? 0.9 : on ? 1 : 0.14) * (r.rayado ? 0.5 : 1);
    r.lineas.renderOrder = on ? 2 : 0;
  }
}
const coincide = (patrones) => {
  const res = (patrones || []).map((p) => new RegExp(p, 'i'));
  return (r) => res.some((re) => re.test(r.fam));
};

// ---------------------------------------------------------------- cámara
let vuelo = null;
function volar(pos, obj, ms = 900) {
  vuelo = { p0: camera.position.clone(), o0: controls.target.clone(), p1: new THREE.Vector3(...pos), o1: new THREE.Vector3(...obj), t0: performance.now(), ms };
}
// distancia para que una esfera de radio r quepa en el área libre entre los paneles
function distanciaPara(r) {
  const w = renderer.domElement.clientWidth, h = renderer.domElement.clientHeight;
  const libre = w > 900 ? Math.max(w - 760, w * 0.4) / w : 1;
  const mediaV = THREE.MathUtils.degToRad(camera.fov / 2);
  const mediaH = Math.atan(Math.tan(mediaV) * (w / h) * libre);
  return r / Math.sin(Math.min(mediaV, mediaH));
}
function encuadrar(prueba) {
  const caja = new THREE.Box3();
  for (const r of registro) if (!r.rayado && (!prueba || prueba(r))) caja.expandByObject(r.relleno, true);
  if (caja.isEmpty()) return;
  const c = caja.getCenter(new THREE.Vector3());
  const rad = Math.max(caja.getSize(new THREE.Vector3()).length() * 0.5, 2.5);
  const dist = distanciaPara(rad) * 0.9;
  const dir = new THREE.Vector3(0.62, 0.5, 0.6).normalize();
  volar(c.clone().addScaledVector(dir, dist).toArray(), c.toArray());
}

// ---------------------------------------------------------------- lecciones
let actual = -1;
let detalleActivo = null;
let vivoPrevio = null;
function pintarLecciones() {
  const ol = $('lecciones');
  ol.innerHTML = '';
  let nivel = null;
  DATOS.lecciones.forEach((l, i) => {
    if (l.nivel !== nivel) {
      nivel = l.nivel;
      const h = document.createElement('li');
      h.className = 'nivel';
      h.textContent = (DATOS.niveles && DATOS.niveles[nivel]) || nivel;
      ol.appendChild(h);
    }
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.className = 'leccion';
    b.dataset.i = i;
    b.innerHTML = '<span class="num"></span><span><b></b><small></small></span>';
    b.querySelector('.num').textContent = String(i + 1).padStart(2, '0');
    b.querySelector('b').textContent = l.titulo;
    b.querySelector('small').textContent = l.sub || '';
    if (l.detalle) {
      const m = document.createElement('span');
      m.className = 'mec';
      m.textContent = 'Mecanismo en detalle';
      b.lastChild.appendChild(m);
    }
    b.addEventListener('click', () => abrirLeccion(i));
    li.appendChild(b);
    ol.appendChild(li);
  });
  $('avance').textContent = `00 / ${String(DATOS.lecciones.length).padStart(2, '0')}`;
}

const angosto = matchMedia('(max-width: 900px)');
function abrirLeccion(i) {
  actual = i;
  const l = DATOS.lecciones[i];
  document.querySelectorAll('.leccion').forEach((b) => b.classList.toggle('activo', +b.dataset.i === i));
  $('avance').textContent = `${String(i + 1).padStart(2, '0')} / ${String(DATOS.lecciones.length).padStart(2, '0')}`;
  marcarSistema(null);
  ficha({ ...l, codigo: `Lección ${String(i + 1).padStart(2, '0')}` });
  $('btn-detalle').disabled = !l.detalle;
  if (l.detalle && DETALLES[l.detalle]) {
    verDetalle(l.detalle);
  } else {
    verEdificio();
    const p = coincide(l.piezas);
    resaltar(l.piezas?.length ? p : null);
    if (l.camara) volar(l.camara.pos, l.camara.obj);
    else encuadrar(l.piezas?.length ? p : null);
  }
  if (angosto.matches && !restaurando) ($('lectura').hidden ? lienzo : $('lectura')).scrollIntoView({ behavior: 'smooth', block: 'start' });
  estado.sistema = null;
  estado.pieza = null;
  escribirURL();
}

// ---------------------------------------------------------------- detalle (mecanismos)
function verDetalle(clave) {
  if (detalleActivo?.clave !== clave) {
    detalleRaiz.clear();
    const d = DETALLES[clave]({ THREE, dibujar: dibujarDetalle, linea: lineaDetalle, rotulo: rotuloDetalle, C, planos });
    detalleActivo = { clave, ...d };
    detalleRaiz.add(d.objeto);
  }
  raiz.visible = false;
  suelo.visible = false;
  detalleRaiz.visible = true;
  document.querySelector('[data-vista="todo"]').classList.remove('activo');
  $('btn-detalle').classList.add('activo');
  $('c-mec').hidden = false;
  $('t-mec').textContent = detalleActivo.etiqueta || 'Mecanismo';
  $('lectura').hidden = false;
  marcoCorte.visible = false;
  $('lec-rotulo').textContent = detalleActivo.rotulo || '';
  rotulos.domElement.hidden = false;
  vivoPrevio = null;
  // encuadre por la caja del detalle, con la dirección de vista que pidió el panel
  const caja = detalleActivo.caja
    ? new THREE.Box3(new THREE.Vector3(...detalleActivo.caja[0]), new THREE.Vector3(...detalleActivo.caja[1]))
    : new THREE.Box3().setFromObject(detalleActivo.objeto);
  const centro = caja.getCenter(new THREE.Vector3());
  const radio = caja.getSize(new THREE.Vector3()).length() / 2;
  const dir = new THREE.Vector3(...detalleActivo.camara.pos).sub(new THREE.Vector3(...detalleActivo.camara.obj)).normalize();
  const dist = distanciaPara(radio) * 1.02;
  volar(centro.clone().addScaledVector(dir, dist).toArray(), centro.toArray());
  $('marco-escala').textContent = `DETALLE · ${detalleActivo.escala || 'SIN ESCALA'}`;
}
function verEdificio() {
  raiz.visible = true;
  suelo.visible = true;
  detalleRaiz.visible = false;
  document.querySelector('[data-vista="todo"]').classList.add('activo');
  $('btn-detalle').classList.remove('activo');
  $('c-mec').hidden = true;
  $('lectura').hidden = true;
  aplicarCorte();
  rotulos.domElement.hidden = true;
  $('marco-escala').textContent = 'PERSPECTIVA · METROS';
}
// líneas sueltas (rayos, caminos, contornos) y rótulos para los detalles
function lineaDetalle(puntos, opciones = {}) {
  const geo = new THREE.BufferGeometry().setFromPoints(puntos);
  const mat = opciones.discontinua
    ? new THREE.LineDashedMaterial({ color: opciones.enfasis ? C.enfasis : C.tinta, dashSize: opciones.guion || 0.3, gapSize: (opciones.guion || 0.3) * 0.6, clippingPlanes: planos, transparent: true, opacity: opciones.opacidad ?? 1 })
    : new THREE.LineBasicMaterial({ color: opciones.enfasis ? C.enfasis : C.tinta, clippingPlanes: planos, transparent: true, opacity: opciones.opacidad ?? 1 });
  const l = new (opciones.segmentos ? THREE.LineSegments : opciones.cerrada ? THREE.LineLoop : THREE.Line)(geo, mat);
  if (opciones.discontinua) l.computeLineDistances();
  return l;
}
function rotuloDetalle(texto, pos, enfasis = false) {
  const el = document.createElement('span');
  el.className = 'rotulo-3d' + (enfasis ? ' enfasis' : '');
  el.textContent = texto;
  const o = new CSS2DObject(el);
  o.position.set(...pos);
  return o;
}
// las piezas de un detalle se dibujan igual, pero no entran al registro del edificio
function dibujarDetalle(geo, opciones = {}) {
  const m = new THREE.Mesh(geo, materialRelleno());
  if (opciones.vidrio) { m.material.opacity = 0.18; m.material.depthWrite = false; }
  const lm = materialLinea();
  if (opciones.enfasis) lm.color.copy(C.enfasis);
  const ls = new THREE.LineSegments(new THREE.EdgesGeometry(geo, opciones.umbral || 20), lm);
  m.add(ls);
  return m;
}

document.querySelector('[data-vista="todo"]').addEventListener('click', () => {
  verEdificio();
  escribirURL();
  if (actual >= 0 && !DATOS.lecciones[actual].detalle) return;
  resaltar(null);
  encuadrar(null);
});
$('btn-detalle').addEventListener('click', () => {
  const l = DATOS.lecciones[actual];
  if (l?.detalle) verDetalle(l.detalle);
  escribirURL();
});

// ---------------------------------------------------------------- sistemas (barra inferior)
function pintarSistemas() {
  const nav = $('sistemas');
  for (const s of SISTEMAS) {
    const b = document.createElement('button');
    b.textContent = s.t;
    b.dataset.s = s.k;
    b.addEventListener('click', () => abrirSistema(s.k));
    nav.appendChild(b);
  }
}
function abrirSistema(k) {
  const s = SISTEMAS.find((x) => x.k === k);
  if (!s) return false;
  verEdificio();
  marcarSistema(s.k);
  const p = (r) => r.sistema === s.k;
  resaltar(p);
  encuadrar(p);
  const f = DATOS.sistemas?.[s.k] || {};
  ficha({ titulo: s.t, ...f, codigo: `Sistema · ${s.t}` });
  estado.sistema = s.k;
  estado.pieza = null;
  escribirURL();
  return true;
}
function marcarSistema(k) {
  document.querySelectorAll('.sistemas button').forEach((b) => b.classList.toggle('activo', b.dataset.s === k));
}
$('f-todo').addEventListener('click', () => {
  verEdificio();
  marcarSistema(null);
  document.querySelectorAll('.leccion').forEach((b) => b.classList.remove('activo'));
  resaltar(null);
  ficha({ codigo: 'Sistema completo', ...DATOS.edificio });
  encuadrar(null);
  actual = -1;
  estado.sistema = null;
  estado.pieza = null;
  $('btn-detalle').disabled = true;
  $('avance').textContent = `00 / ${String(DATOS.lecciones.length).padStart(2, '0')}`;
  escribirURL();
});

// ---------------------------------------------------------------- tocar una pieza
const ray = new THREE.Raycaster();
const pt = new THREE.Vector2();
let abajo = null;
renderer.domElement.addEventListener('pointerdown', (e) => { abajo = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!abajo || Math.hypot(e.clientX - abajo[0], e.clientY - abajo[1]) > 5) return;
  if (!raiz.visible) return;
  const r = renderer.domElement.getBoundingClientRect();
  pt.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(pt, camera);
  const hits = ray.intersectObjects(registro.filter((x) => x.relleno.material.opacity > 0.5).map((x) => x.relleno), false)
    .filter((h) => plano.distanceToPoint(h.point) >= 0);
  if (!hits.length) return;
  abrirPieza(hits[0].object.userData.fam);
});
function abrirPieza(fam, encuadre = false) {
  const reg = registro.find((x) => x.fam === fam);
  if (!reg) return false;
  if (!raiz.visible) verEdificio();
  const p = DATOS.piezas?.[fam] || {};
  const prueba = (x) => x.fam === fam;
  resaltar(prueba);
  if (encuadre) encuadrar(prueba);
  marcarSistema(reg.sistema);
  ficha({ titulo: fam, texto: 'Esta pieza todavía no tiene ficha.', ...p, codigo: `Pieza · ${fam.replace(/^entrada:/, '').replace(/\s—\s/g, ', ')}` });
  estado.pieza = fam;
  estado.sistema = null;
  escribirURL();
  return true;
}

// ---------------------------------------------------------------- despiece y corte
let despiece = 0;
let eje = 'z';
let corte = 1;
let caja = new THREE.Box3();
function ponerDespiece(v) {
  despiece = v;
  $('r-desp').value = v;
  $('v-desp').textContent = `${Math.round(despiece * 100)} %`;
}
$('r-desp').addEventListener('input', (e) => { ponerDespiece(+e.target.value); escribirURL(); });
// el plano de corte se dibuja como un rectángulo discontinuo, como en un plano
const marcoCorte = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.PlaneGeometry(1, 1)),
  new THREE.LineDashedMaterial({ color: C.enfasis, dashSize: 0.6, gapSize: 0.35 }),
);
marcoCorte.visible = false;
scene.add(marcoCorte);
function aplicarCorte() {
  const n = { x: [-1, 0, 0], y: [0, -1, 0], z: [0, 0, -1] }[eje];
  plano.normal.set(...n);
  const i = { x: 0, y: 1, z: 2 }[eje];
  const lo = caja.min.getComponent(i) - 0.5;
  const hi = caja.max.getComponent(i) + 0.5;
  const v = lo + (hi - lo) * corte;
  plano.constant = corte >= 0.999 ? 1e4 : v;
  for (const p of poches) p.visible = corte < 0.999;
  marcoCorte.visible = corte < 0.999 && raiz.visible;
  if (marcoCorte.visible) {
    const c = caja.getCenter(new THREE.Vector3()), t = caja.getSize(new THREE.Vector3()).addScalar(2);
    marcoCorte.geometry.dispose();
    marcoCorte.geometry = new THREE.EdgesGeometry(new THREE.PlaneGeometry(eje === 'x' ? t.z : t.x, eje === 'y' ? t.z : t.y));
    marcoCorte.rotation.set(eje === 'y' ? -Math.PI / 2 : 0, eje === 'x' ? Math.PI / 2 : 0, 0);
    marcoCorte.position.copy(c).setComponent(i, v);
    marcoCorte.computeLineDistances();
  }
  $('v-corte').textContent = corte >= 0.999 ? 'sin corte' : `${eje === 'y' ? 'h' : eje} = ${v.toFixed(2).replace('.', ',')} m`;
}
$('r-corte').addEventListener('input', (e) => { corte = +e.target.value; aplicarCorte(); escribirURL(); });
function ponerEje(e) {
  eje = e;
  document.querySelectorAll('.ejes button').forEach((x) => x.classList.toggle('activo', x.dataset.eje === e));
}
document.querySelectorAll('.ejes button').forEach((b) => b.addEventListener('click', () => {
  ponerEje(b.dataset.eje);
  // elegir un plano abre el edificio por la mitad (en planta, a media altura del primer piso)
  if (corte >= 0.999) {
    corte = eje === 'y' ? 0.17 : 0.5;
    $('r-corte').value = corte;
  }
  aplicarCorte();
  escribirURL();
}));
let mec = 0;
function ponerMec(v) {
  mec = v;
  $('r-mec').value = v;
  $('v-mec').textContent = `${Math.round(mec * 100)} %`;
}
$('r-mec').addEventListener('input', (e) => { ponerMec(+e.target.value); escribirURL(); });

// ---------------------------------------------------------------- URL con estado
// ?leccion=l12 &sistema=cubierta &pieza=<familia> &corte=z:0.5 &desp=0.4 &mec=0.6 (y ?prueba se conserva).
// Se lee al cargar (también desde #leccion=…, la forma del 106) y se reescribe con replaceState al cambiar.
const CLAVES = ['leccion', 'sistema', 'pieza', 'corte', 'desp', 'mec', 'meca'];
const estado = { sistema: null, pieza: null };
let restaurando = false;
// una familia del visor en minúsculas y sin acentos: «Photo-matched white haunch» → photo_matched_white_haunch
const clave = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
// nombres cortos para enlazar desde el 106 (sus PARTES) y los de uso común. Una lección cuando la parte es un conjunto.
// «lateral» (las caras cortas NE y SO) no tiene lección propia: sin alias, abre el edificio completo.
const ALIAS = {
  techo: { sistema: 'cubierta' }, alero: { leccion: 'l12' }, mensula: { fam: 'Photo-matched white haunch' },
  vano: { leccion: 'l07' }, modulo: { leccion: 'l08' }, principal: { leccion: 'l08' },
  zocalo: { leccion: 'l06' }, cabio: { fam: 'Exposed timber rafter' }, alfeizar: { fam: 'window sill' },
  moldura: { fam: 'continuous sill band' }, teja: { leccion: 'l11' }, celosia: { leccion: 'l13' },
  rampa: { leccion: 'l15' }, condensadora: { leccion: 'l18' }, atico: { leccion: 'l19' }, porton: { leccion: 'l14' },
};
const num = (v) => { const n = parseFloat(String(v ?? '').replace(',', '.')); return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : null; };
const corto = (v) => String(Math.round(v * 1000) / 1000);
function leerURL() {
  const q = new URLSearchParams(location.search);
  const h = new URLSearchParams(location.hash.replace(/^#/, ''));
  const v = (k) => q.get(k) ?? h.get(k);
  return { leccion: v('leccion'), sistema: v('sistema'), pieza: v('pieza'), corte: v('corte'), desp: v('desp'), mec: v('mec') ?? v('meca') };
}
function famDe(valor) {
  if (!valor) return null;
  const fams = [...new Set(registro.map((r) => r.fam))];
  return fams.find((f) => f === valor) || fams.find((f) => clave(f) === clave(valor)) || null;
}
function indiceLeccion(valor) {
  if (!valor) return -1;
  const id = /^\d+$/.test(valor) ? `l${valor.padStart(2, '0')}` : valor.toLowerCase();
  return DATOS.lecciones.findIndex((l) => l.id === id);
}
function restaurarURL() {
  const u = leerURL();
  restaurando = true;
  try {
    const alias = ALIAS[clave(u.pieza || '')] || {};
    const i = indiceLeccion(u.leccion || alias.leccion);
    if (i >= 0) abrirLeccion(i);
    if (u.sistema || alias.sistema) abrirSistema(u.sistema || alias.sistema);
    const fam = famDe(u.pieza) || alias.fam;
    if (fam) abrirPieza(fam, i < 0);
    const d = num(u.desp);
    if (d !== null) ponerDespiece(d);
    const c = /^([xyz])(?::([\d.,]+))?$/i.exec(u.corte || '');
    if (c) {
      ponerEje(c[1].toLowerCase());
      corte = num(c[2]) ?? (eje === 'y' ? 0.17 : 0.5);
      $('r-corte').value = corte;
      aplicarCorte();
    }
    const m = num(u.mec);
    if (m !== null) ponerMec(m);
  } finally {
    restaurando = false;
  }
  escribirURL();
}
function escribirURL() {
  if (restaurando || !DATOS.lecciones.length) return;
  const q = new URLSearchParams(location.search);
  for (const k of CLAVES) q.delete(k);
  const l = DATOS.lecciones[actual];
  if (l) q.set('leccion', l.id);
  if (estado.sistema) q.set('sistema', estado.sistema);
  if (estado.pieza) q.set('pieza', clave(estado.pieza));
  if (corte < 0.999) q.set('corte', `${eje}:${corto(corte)}`);
  if (despiece > 0) q.set('desp', corto(despiece));
  if (detalleRaiz.visible && mec > 0) q.set('mec', corto(mec));
  // ?prueba va sin «=», como se escribe a mano, y los dos puntos de corte=z:0.5 sin codificar
  const texto = q.toString().replace(/(^|&)prueba=(?=&|$)/, '$1prueba').replace(/%3A/gi, ':');
  // el estado que vino en el hash ya pasó a la búsqueda; el resto del hash se respeta
  const hash = /(^#|&)(leccion|pieza|sistema|corte|desp|mec|meca)=/.test(location.hash) ? '' : location.hash;
  try { history.replaceState(null, '', location.pathname + (texto ? `?${texto}` : '') + hash); } catch (e) { /* sin historial */ }
}
$('copiar-enlace').addEventListener('click', async () => {
  const b = $('copiar-enlace');
  let ok = false;
  try { await navigator.clipboard.writeText(location.href); ok = true; } catch (e) {
    const t = document.createElement('textarea');
    t.value = location.href;
    document.body.appendChild(t);
    t.select();
    try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
    t.remove();
  }
  b.textContent = ok ? 'Enlace copiado' : 'No se pudo copiar';
  clearTimeout(b.t);
  b.t = setTimeout(() => { b.textContent = 'Copiar enlace'; }, 2000);
});

// ---------------------------------------------------------------- tema
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  C = COL();
  for (const r of registro) r.relleno.material.color.copy(C.papel);
  for (const p of poches) p.material.color.copy(C.poche);
  resaltar(seleccion);
});

// ---------------------------------------------------------------- bucle
const reloj = new THREE.Clock();
function bucle() {
  requestAnimationFrame(bucle);
  const dt = Math.min(reloj.getDelta(), 0.05);
  for (const g of Object.values(grupos)) {
    const meta = g.userData.base.clone().addScaledVector(g.userData.d, despiece);
    g.position.lerp(meta, 0.12);
  }
  if (vuelo) {
    let t = (performance.now() - vuelo.t0) / vuelo.ms;
    if (t >= 1) t = 1;
    const k = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    camera.position.lerpVectors(vuelo.p0, vuelo.p1, k);
    controls.target.lerpVectors(vuelo.o0, vuelo.o1, k);
    if (t === 1) vuelo = null;
  }
  if (detalleRaiz.visible && detalleActivo?.actualizar) {
    const vivo = detalleActivo.actualizar(mec, dt);
    const txt = Array.isArray(vivo) ? vivo.join('\n') : vivo || '';
    if (txt !== vivoPrevio) { $('lec-vivo').textContent = txt; vivoPrevio = txt; }
  }
  controls.update();
  renderer.render(scene, camera);
  if (detalleRaiz.visible) rotulos.render(scene, camera);
}

// ---------------------------------------------------------------- arranque
(async () => {
  camera.position.set(48, 30, 52);
  controls.target.set(0, 5, 0);
  bucle();
  await Promise.all([cargarEdificio(), cargarContenido()]);
  caja = new THREE.Box3().setFromObject(raiz, true);
  pintarSistemas();
  pintarLecciones();
  ficha({ codigo: 'Sistema completo', ...DATOS.edificio });
  aplicarCorte();
  restaurarURL();
  $('carga').classList.add('fuera');
  if (new URLSearchParams(location.search).has('prueba')) {
    window.__divisor = {
      registro, grupos, abrirLeccion, abrirSistema, abrirPieza, DATOS, camera, controls,
      estado: () => ({ leccion: DATOS.lecciones[actual]?.id ?? null, ...estado, eje, corte, despiece, mec, detalle: detalleRaiz.visible ? detalleActivo?.clave : null }),
    };
  }
})().catch((e) => {
  $('carga').innerHTML = '<span class="mono">No se pudo cargar el dibujo. Abre la página desde un servidor local.</span>';
  console.error(e);
});
