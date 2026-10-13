// Mecanismos del 106 en detalle (especificación en docs/DETALLES-SPEC.md).
// Cada detalle recibe { THREE, dibujar, linea, rotulo, C } y devuelve
// { objeto, actualizar(m, dt) -> texto de lectura, camara, etiqueta, escala, rotulo }.
// m va de 0 a 1 (control «Mecanismo»). Medidas en metros.

const num = (v, d = 0) => v.toFixed(d).replace('.', ',');
const rad = (g) => (g * Math.PI) / 180;
const tramo = (m, a, b) => Math.min(1, Math.max(0, (m - a) / (b - a)));

// caja centrada en (x, y, z)
function caja(k, w, h, d, x, y, z, op) {
  const m = k.dibujar(new k.THREE.BoxGeometry(w, h, d), op);
  m.position.set(x, y, z);
  return m;
}
// caja entre dos cotas: [x0,x1], [y0,y1], [z0,z1]
function cajaEntre(k, [x0, x1], [y0, y1], [z0, z1], op) {
  return caja(k, x1 - x0, y1 - y0, z1 - z0, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, op);
}
// posición sobre una polilínea según t de 0 a 1 (por longitud)
function sobre(puntos, t, V) {
  const largos = [];
  let total = 0;
  for (let i = 1; i < puntos.length; i++) { const l = puntos[i].distanceTo(puntos[i - 1]); largos.push(l); total += l; }
  let r = Math.min(Math.max(t, 0), 1) * total;
  for (let i = 0; i < largos.length; i++) {
    if (r <= largos[i] || i === largos.length - 1) return new V().lerpVectors(puntos[i], puntos[i + 1], largos[i] ? Math.min(r / largos[i], 1) : 0);
    r -= largos[i];
  }
  return puntos[0].clone();
}
const largo = (puntos) => puntos.reduce((s, p, i) => (i ? s + p.distanceTo(puntos[i - 1]) : 0), 0);

export const DETALLES = {
  // ------------------------------------------------------------ 1. celosía de lamas operables
  celosia(k) {
    const { THREE } = k;
    const V = THREE.Vector3;
    const g = new THREE.Group();
    const N = 8, PASO = 0.093, CUERDA = 0.095, LARGO = 1.02, BRAZO = 0.03, XB = -0.5;
    g.add(caja(k, 0.04, 0.74, 0.09, -0.53, 0, 0), caja(k, 0.04, 0.74, 0.09, 0.53, 0, 0));
    const vidrio = k.dibujar(new THREE.PlaneGeometry(1.08, 0.74), { vidrio: true });
    vidrio.position.z = -0.05;
    g.add(vidrio);
    const lamas = [], brazos = [];
    for (let i = 0; i < N; i++) {
      const y = -0.326 + i * PASO;
      const lama = k.dibujar(new THREE.BoxGeometry(LARGO, 0.006, CUERDA));
      lama.position.set(0, y, 0);
      lamas.push(lama);
      const brazo = k.dibujar(new THREE.BoxGeometry(0.006, BRAZO, 0.006), { enfasis: true });
      brazos.push(brazo);
      g.add(lama, brazo);
    }
    const varilla = k.dibujar(new THREE.BoxGeometry(0.008, 0.72, 0.008), { enfasis: true });
    const palanca = k.dibujar(new THREE.BoxGeometry(0.012, 0.1, 0.012), { enfasis: true });
    g.add(varilla, palanca);
    const rayos = [0, 1, 2].map(() => { const l = k.linea([new V(), new V()], { enfasis: true, opacidad: 0.7 }); g.add(l); return l; });
    g.add(k.rotulo('varilla de accionamiento', [-0.62, 0.42, 0.05], true));
    return {
      objeto: g,
      camara: { pos: [1.1, 0.55, 1.25], obj: [0, 0, 0] },
      etiqueta: 'Giro de las lamas',
      escala: '1:5 · PRINCIPIO GENERAL',
      rotulo: 'Principio general de una celosía de lamas operables. En el 106 no se sabe si las lamas giran.',
      actualizar(m) {
        const th = rad(80 * (1 - m)); // ángulo de la lama respecto a la horizontal
        const n = new V(0, Math.cos(th), Math.sin(th)); // normal a la cuerda: dirección del brazo
        lamas.forEach((l, i) => {
          l.rotation.x = th;
          const piv = new V(XB, l.position.y, 0);
          brazos[i].position.copy(piv).addScaledVector(n, BRAZO / 2);
          brazos[i].rotation.x = th;
        });
        // el paralelogramo: todas las puntas se corren igual, la varilla se traslada sin girar
        varilla.position.set(XB, n.y * BRAZO, n.z * BRAZO);
        palanca.position.set(XB, -0.36 - 0.05 + n.y * BRAZO, n.z * BRAZO);
        const c = new V(0, -Math.sin(th), Math.cos(th)); // dirección de la cuerda
        const abierta = th < rad(78);
        [1, 3, 5].forEach((j, r) => {
          const p = new V(-0.2 + r * 0.3, -0.326 + (j + 0.5) * PASO, 0);
          const pos = rayos[r].geometry.attributes.position;
          pos.setXYZ(0, ...p.clone().addScaledVector(c, -0.4).toArray());
          pos.setXYZ(1, ...p.clone().addScaledVector(c, 0.4).toArray());
          pos.needsUpdate = true;
          rayos[r].visible = abierta;
        });
        return `ángulo de las lamas: ${num(80 * (1 - m))}° · ${abierta ? 'pasan aire y luz' : 'lamas solapadas'}`;
      },
    };
  },

  // ------------------------------------------------------------ 2. teja canal y cobija
  teja(k) {
    const { THREE } = k;
    const V = THREE.Vector3;
    const g = new THREE.Group();
    const faldon = new THREE.Group();
    const PEND = rad(17.9); // mediagua SE del modelo
    faldon.rotation.x = PEND; // +z local baja por el faldón
    g.add(faldon);
    // arco de cilindro por cuerda y flecha, eje a lo largo de z
    const arco = (cuerda, flecha, largoT, arriba) => {
      const r = (cuerda * cuerda / 4 + flecha * flecha) / (2 * flecha);
      const medio = Math.asin(cuerda / 2 / r);
      const geo = new THREE.CylinderGeometry(r, r, largoT, 18, 1, true, arriba ? Math.PI - medio : -medio, 2 * medio);
      geo.rotateX(Math.PI / 2);
      return { geo, r, medio };
    };
    const FILAS = 4, AVANCE = 0.347, LT = 0.41, V0 = -0.75;
    faldon.add(cajaEntre(k, [-0.45, 0.45], [-0.02, 0], [-0.8, 0.8]));
    const canales = [-0.235, 0, 0.235], cobijas = [-0.1175, 0.1175];
    const ca = arco(0.235, 0.06, LT, false), co = arco(0.135, 0.04, LT, true);
    for (let f = 0; f < FILAS; f++) {
      const v = V0 + LT / 2 + f * AVANCE;
      const alza = (FILAS - 1 - f) * 0.012; // la fila de arriba se monta sobre la de abajo
      for (const x of canales) {
        const t = k.dibujar(ca.geo, { umbral: 30 });
        t.position.set(x, ca.r + alza, v);
        faldon.add(t);
      }
      for (const x of cobijas) {
        const t = k.dibujar(co.geo, { umbral: 30 });
        t.position.set(x, 0.06 - co.r * Math.cos(co.medio) + alza, v);
        faldon.add(t);
      }
    }
    // franjas de solape
    for (let f = 0; f < FILAS - 1; f++) {
      const v0 = V0 + (f + 1) * AVANCE, v1 = V0 + f * AVANCE + LT;
      const y = 0.075;
      faldon.add(k.linea([new V(-0.36, y, v0), new V(0.36, y, v0), new V(0.36, y, v1), new V(-0.36, y, v1)], { enfasis: true, cerrada: true }));
    }
    const vFin = V0 + (FILAS - 1) * AVANCE + LT;
    faldon.add(cajaEntre(k, [-0.45, 0.45], [-0.14, 0], [vFin, vFin + 0.1]));
    faldon.add(cajaEntre(k, [-0.035, 0.035], [-0.13, -0.02], [-0.8, 0.85]));
    g.updateMatrixWorld(true);
    // caminos del agua: cae en la cobija, resbala al canal y baja por los solapes
    const caminos = [[-0.1175, -0.235], [-0.1175, 0], [0.1175, 0], [0.1175, 0.235]].map(([xc, xk]) => {
      const loc = [];
      const vIni = V0 + 0.12;
      loc.push(new V(xc, 0.3, vIni), new V(xc, 0.06 + 0.04 + 0.036, vIni), new V(xk, 0.004 + 0.036, vIni + 0.05));
      for (let f = 0; f < FILAS; f++) {
        const alza = (FILAS - 1 - f) * 0.012 + 0.004;
        const vA = f === 0 ? vIni + 0.05 : V0 + f * AVANCE;
        const vB = f < FILAS - 1 ? V0 + (f + 1) * AVANCE : vFin;
        loc.push(new V(xk, alza, vA), new V(xk, alza, vB));
      }
      const mundo = loc.map((p) => faldon.localToWorld(p.clone()));
      const fin = mundo[mundo.length - 1];
      mundo.push(fin.clone().add(new V(0, -0.5, 0.04)));
      g.add(k.linea(mundo, { enfasis: true, opacidad: 0.5 }));
      const gota = k.dibujar(new THREE.SphereGeometry(0.0075, 10, 8), { enfasis: true, umbral: 80 });
      g.add(gota);
      return { mundo, gota };
    });
    g.add(k.rotulo('solape', faldon.localToWorld(new V(0.42, 0.08, V0 + AVANCE + 0.03)).toArray(), true));
    g.add(k.rotulo('canal', faldon.localToWorld(new V(0.235, 0.02, vFin - 0.05)).toArray()));
    g.add(k.rotulo('cobija', faldon.localToWorld(new V(-0.1175, 0.12, V0 + 0.2)).toArray()));
    return {
      objeto: g,
      camara: { pos: [1.2, 1.1, 1.4], obj: [0, 0, 0.2] },
      etiqueta: 'Recorrido del agua',
      escala: '1:5 · TEJA DEL MODELO',
      rotulo: 'Medidas de la teja del modelo, escala ±12 %. El material y el tamaño reales no están medidos.',
      actualizar(m) {
        // 0 a 0,15 cae · 0,15 a 0,25 resbala · 0,25 a 0,85 baja por el canal · 0,85 a 1 cae del borde
        for (const c of caminos) {
          const p = c.mundo;
          let pos;
          if (m < 0.15) pos = new V().lerpVectors(p[0], p[1], m / 0.15);
          else if (m < 0.25) pos = new V().lerpVectors(p[1], p[2], (m - 0.15) / 0.1);
          else if (m < 0.85) pos = sobre(p.slice(2, p.length - 1), (m - 0.25) / 0.6, V);
          else pos = new V().lerpVectors(p[p.length - 2], p[p.length - 1], (m - 0.85) / 0.15);
          c.gota.position.copy(pos);
        }
        return m < 0.15 ? 'la gota cae sobre la cobija' : m < 0.25 ? 'resbala de la cobija al canal'
          : m < 0.85 ? 'baja por el canal y pasa por encima de cada solape' : 'sale por el borde del alero';
      },
    };
  },

  // ------------------------------------------------------------ 3. alero, ménsula y sombra en el corte
  alero(k) {
    const { THREE } = k;
    const V = THREE.Vector3;
    const g = new THREE.Group();
    const X = [-0.6, 0.6];
    g.add(cajaEntre(k, X, [0.65, 1.74], [-0.3, 0]), cajaEntre(k, X, [3.41, 4.6], [-0.3, 0]));
    const vidrio = k.dibujar(new THREE.PlaneGeometry(1.2, 1.55), { vidrio: true });
    vidrio.position.set(0, 2.595, -0.095);
    g.add(vidrio);
    g.add(cajaEntre(k, X, [1.78, 1.82], [-0.14, -0.05]), cajaEntre(k, X, [3.37, 3.41], [-0.14, -0.05]));
    g.add(cajaEntre(k, X, [1.74, 1.79], [-0.1, 0.24]), cajaEntre(k, X, [1.66, 1.71], [0, 0.06]));
    // alero
    const al = [];
    const forma = new THREE.Shape([new THREE.Vector2(0, 3.02), new THREE.Vector2(0, 3.84), new THREE.Vector2(1.5, 3.84)]);
    const mg = new THREE.ExtrudeGeometry(forma, { depth: 0.26, bevelEnabled: false });
    mg.rotateY(-Math.PI / 2);
    mg.translate(0.13, 0, 0);
    al.push(k.dibujar(mg, { enfasis: true }));
    for (const x of [-0.325, 0.325]) al.push(caja(k, 0.07, 0.11, 1.65, x, 3.875, 0.825, { enfasis: true }));
    const PEND = rad(17.9);
    const largoT = 1.65 / Math.cos(PEND);
    const tab = caja(k, 1.2, 0.03, largoT, 0, 3.8 + Math.tan(PEND) * 1.65 / 2, 0.825, { enfasis: true });
    tab.rotation.x = PEND;
    al.push(tab);
    al.push(cajaEntre(k, X, [3.734, 3.874], [1.55, 1.65], { enfasis: true }));
    al.push(cajaEntre(k, X, [4.27, 4.54], [0, 0.03]));
    al.forEach((p) => g.add(p));
    // rayado de tejas sobre el tablero
    const ray = [];
    for (let x = -0.55; x <= 0.56; x += 0.1) ray.push(new V(x, 3.84, 1.65), new V(x, 3.84 + Math.tan(PEND) * 1.65, 0));
    g.add(k.linea(ray, { segmentos: true, opacidad: 0.5 }));
    // sombra sobre el vidrio
    const sombra = k.dibujar(new THREE.PlaneGeometry(1.2, 1), { enfasis: true });
    sombra.material.opacity = 0.0;
    sombra.position.z = -0.09;
    const hach = [];
    for (let i = -6; i <= 6; i++) hach.push(new V(i * 0.1 - 0.5, -0.5, 0), new V(i * 0.1 + 0.5, 0.5, 0));
    const hl = k.linea(hach, { segmentos: true, enfasis: true, opacidad: 0.6 });
    sombra.add(hl);
    g.add(sombra);
    const P = new V(0, 3.734, 1.65);
    const rayos = [0, 1, 2, 3, 4].map((i) => { const l = k.linea([new V(), new V()], { enfasis: i === 0, opacidad: i === 0 ? 1 : 0.45 }); g.add(l); return l; });
    g.add(k.rotulo('P · borde del alero', [0, 3.62, 1.9], true));
    g.add(k.rotulo('vidrio del piso 1', [0, 2.2, -0.1]));
    return {
      objeto: g,
      camara: { pos: [3.2, 3.0, 4.2], obj: [0, 2.8, 0.6] },
      etiqueta: 'Altura del sol en el corte',
      escala: '1:25 · CORTE DEL PISO 1',
      rotulo: 'Ángulo de perfil medido en el corte. Geometría del modelo, escala ±12 %.',
      actualizar(m) {
        const a = 5 + 85 * m;
        const ar = rad(a);
        const d = new V(0, -Math.sin(ar), -Math.cos(ar));
        const perp = new V(0, -Math.cos(ar), Math.sin(ar)); // hacia abajo y afuera
        rayos.forEach((l, i) => {
          const o = P.clone().addScaledVector(perp, i * 0.35);
          const t = (o.z + 0.095) / Math.cos(ar); // hasta el plano del vidrio
          const fin = o.clone().addScaledVector(d, t);
          if (fin.y < 0.65) fin.copy(o).addScaledVector(d, (o.y - 0.65) / Math.sin(ar));
          const p = l.geometry.attributes.position;
          p.setXYZ(0, ...o.clone().addScaledVector(d, -2.2).toArray());
          p.setXYZ(1, ...fin.toArray());
          p.needsUpdate = true;
        });
        const ys = 3.734 - Math.tan(ar) * 1.745;
        const bajo = Math.min(3.37, Math.max(1.82, ys));
        const frac = (3.37 - bajo) / 1.55;
        sombra.visible = frac > 0.001;
        sombra.scale.y = Math.max(frac * 1.55, 0.001);
        sombra.position.y = (3.37 + bajo) / 2;
        return `ángulo en el corte: ${num(a)}° · vidrio en sombra: ${num(frac * 100)} %`;
      },
    };
  },

  // ------------------------------------------------------------ 4. rampa contra escalera
  rampa(k) {
    const { THREE } = k;
    const V = THREE.Vector3;
    const g = new THREE.Group();
    g.add(cajaEntre(k, [-3.2, 7.6], [0.06, 0.16], [-0.2, 3.2]));
    g.add(cajaEntre(k, [-0.7, 7.3], [0.16, 1.96], [-0.15, 0]));
    // losas inclinadas como prismas por sus cuatro esquinas de arriba
    const losa = (x0, x1, z0, z1, y0, y1) => {
      const geo = new THREE.BufferGeometry();
      const e = 0.12;
      const p = [[x0, y0, z0], [x1, y1, z0], [x1, y1, z1], [x0, y0, z1]];
      const v = [...p.map(([x, y, z]) => [x, y, z]), ...p.map(([x, y, z]) => [x, y - e, z])].flat();
      const caras = [0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6, 0, 4, 5, 0, 5, 1, 1, 5, 6, 1, 6, 2, 2, 6, 7, 2, 7, 3, 3, 7, 4, 3, 4, 0];
      geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
      geo.setIndex(caras);
      geo.computeVertexNormals();
      return k.dibujar(geo, { umbral: 10 });
    };
    g.add(losa(0, 5.9, 1.42, 2.74, 0.16, 0.64));
    const descanso = cajaEntre(k, [5.9, 7.3], [0.52, 0.64], [0, 2.74], { enfasis: true });
    g.add(descanso);
    g.add(losa(0, 5.9, 0, 1.32, 1.12, 0.64));
    g.add(cajaEntre(k, [-0.7, 0], [0.16, 1.12], [0, 2.3]));
    // escalera de 7 peldaños de 0,137 m que llega al mismo porche
    for (let i = 0; i < 7; i++) g.add(cajaEntre(k, [-2.8 + i * 0.3, -0.7], [0.16, 0.16 + (i + 1) * 0.137], [0, 2.3]));
    // postes y pasamanos (altura de dibujo, sin cifra)
    const H = 0.9;
    const yRampa = (x, baja) => (baja ? 0.16 + (0.48 * x) / 5.9 : 1.12 - (0.48 * x) / 5.9);
    const postes = [];
    for (let i = 0; i < 7; i++) {
      const x = 0.1 + i * 0.98;
      postes.push([x, yRampa(x, true), 2.7], [x, yRampa(x, true), 1.46], [x, yRampa(x, false), 1.28]);
    }
    for (const [x, y, z] of postes) g.add(caja(k, 0.04, H, 0.04, x, y + H / 2, z));
    const fuera = [new V(0, yRampa(0, true) + H, 2.7), new V(5.9, 0.64 + H, 2.7), new V(7.26, 0.64 + H, 2.7), new V(7.26, 0.64 + H, 0.04)];
    const dentro = [new V(0, yRampa(0, true) + H, 1.46), new V(5.9, 0.64 + H, 1.46), new V(5.9, 0.64 + H, 1.28), new V(0, 1.12 + H, 1.28)];
    for (const camino of [fuera, dentro]) {
      g.add(k.dibujar(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(camino, false, 'catmullrom', 0.05), 60, 0.027, 6), { enfasis: true, umbral: 60 }));
      for (const f of [0.35, 0.65]) g.add(k.linea(camino.map((p) => p.clone().setY(p.y - H * (1 - f))), { opacidad: 0.6 }));
    }
    // marcadores
    const pr = [new V(0, 0.16, 2.08), new V(5.9, 0.64, 2.08), new V(6.6, 0.64, 2.08), new V(6.6, 0.64, 0.66), new V(5.9, 0.64, 0.66), new V(0, 1.12, 0.66)];
    const largoRampa = largo(pr.map((p) => new V(p.x, 0, p.z))); // en planta, como la escalera
    const marcador = () => {
      const c = k.dibujar(new THREE.CylinderGeometry(0.225, 0.225, 1.2, 16), { enfasis: true, umbral: 60 });
      g.add(c);
      return c;
    };
    const mr = marcador(), me = marcador();
    g.add(k.rotulo('descanso', [6.6, 0.9, 2.4], true));
    g.add(k.rotulo('escalera de 7 peldaños', [-1.75, 1.5, 2.6]));
    const pend = (0.48 / 5.9) * 100;
    return {
      objeto: g,
      camara: { pos: [-2.0, 6.5, 13.0], obj: [2.5, 0.6, 1.0] },
      etiqueta: 'Subida por la rampa',
      escala: '1:50 · ENTRADA SE',
      rotulo: `Pendiente de cada tramo en el modelo: ${num(pend, 1)} % (0,48 m en 5,90 m). Cotas inferidas y escala ±12 %: no se puede decir si cumple una norma.`,
      actualizar(m) {
        const p = sobre(pr, m, V);
        mr.position.set(p.x, p.y + 0.6, p.z);
        const xe = -2.8 + 2.1 * m;
        const peld = Math.min(7, Math.floor(m * 7 + 1e-6) + (m > 0 ? 1 : 0));
        const ye = m >= 1 ? 1.12 : 0.16 + Math.min(peld, 7) * 0.137 * (m > 0 ? 1 : 0);
        me.position.set(xe, ye + 0.6, 1.15);
        return [`rampa · altura ${num(p.y, 2)} m · recorrido ${num(largoRampa * m, 1)} m`,
          `escalera · altura ${num(ye, 2)} m · recorrido ${num(2.1 * m, 1)} m`];
      },
    };
  },

  // ------------------------------------------------------------ 5. condensadora split
  condensadora(k) {
    const { THREE } = k;
    const V = THREE.Vector3;
    const g = new THREE.Group();
    g.add(cajaEntre(k, [-0.455, 0.455], [0.09, 0.71], [-0.22, 0.22], { vidrio: true }));
    const cx = -0.16, cy = 0.4, zf = 0.22; // hueco del ventilador corrido 0,16 m del centro, como en el modelo
    const circulo = (r, z, op) => {
      const p = [];
      for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; p.push(new V(cx + r * Math.cos(a), cy + r * Math.sin(a), z)); }
      return k.linea(p, { cerrada: true, ...op });
    };
    g.add(circulo(0.25, zf));
    for (const d of [0.48, 0.42, 0.32, 0.22, 0.14]) g.add(circulo(d / 2, zf + 0.002, { enfasis: true }));
    const aspa = new THREE.Group();
    aspa.position.set(cx, cy, zf - 0.05);
    const cubo = k.dibujar(new THREE.CylinderGeometry(0.04, 0.04, 0.05, 16).rotateX(Math.PI / 2), { enfasis: true });
    aspa.add(cubo);
    for (let i = 0; i < 3; i++) {
      const b = new THREE.Group();
      b.rotation.z = (i / 3) * Math.PI * 2;
      const hoja = k.dibujar(new THREE.BoxGeometry(0.19, 0.09, 0.004), { enfasis: true });
      hoja.position.x = 0.135;
      hoja.rotation.x = rad(28);
      b.add(hoja);
      aspa.add(b);
    }
    g.add(aspa);
    g.add(caja(k, 0.1, 0.1, 0.08, cx, cy, zf - 0.12));
    // serpentín en L con aletas
    g.add(cajaEntre(k, [-0.43, 0.43], [0.13, 0.67], [-0.215, -0.165]), cajaEntre(k, [-0.45, -0.4], [0.13, 0.67], [-0.2, 0.15]));
    const aletas = [];
    for (let i = 0; i < 20; i++) { const x = -0.42 + (i / 19) * 0.84; aletas.push(new V(x, 0.13, -0.163), new V(x, 0.67, -0.163)); }
    g.add(k.linea(aletas, { segmentos: true, opacidad: 0.5 }));
    // rejilla del frente, junto al ventilador (en el modelo: 0,15 × 0,36 m a +0,325 m del centro)
    g.add(cajaEntre(k, [0.25, 0.4], [0.22, 0.58], [0.22, 0.226]));
    const lamas = [];
    for (let y = 0.25; y < 0.58; y += 0.04) lamas.push(new V(0.26, y, 0.227), new V(0.39, y, 0.227));
    g.add(k.linea(lamas, { segmentos: true, opacidad: 0.6 }));
    g.add(k.dibujar(new THREE.CylinderGeometry(0.09, 0.09, 0.3, 18), {}).translateX(0.2).translateY(0.24).translateZ(-0.02));
    g.add(cajaEntre(k, [-0.79, -0.5], [0.38, 2.1], [-0.215, 0.215], { vidrio: true }));
    // circuito: compresor → serpentín → tubo fino arriba → vuelve por el grueso → compresor
    const circ = [
      new V(0.2, 0.39, -0.02), new V(0.2, 0.6, -0.12), new V(-0.4, 0.6, -0.19), new V(0.4, 0.6, -0.19),
      new V(0.4, 0.4, -0.19), new V(-0.4, 0.4, -0.19), new V(-0.4, 0.2, -0.19), new V(0.3, 0.2, -0.19), new V(0.3, 0.16, 0),
      new V(-0.6, 0.16, 0), new V(-0.6, 2.05, 0), new V(-0.69, 2.05, 0), new V(-0.69, 0.3, 0), new V(0.2, 0.3, -0.02),
    ];
    g.add(k.linea(circ, { cerrada: true, opacidad: 0.55 }));
    const L = largo([...circ, circ[0]]);
    const iLiq = largo(circ.slice(0, 8)) / L, iSube = largo(circ.slice(0, 11)) / L;
    const puntos = Array.from({ length: 12 }, (_, i) => {
      const s = k.dibujar(new THREE.SphereGeometry(0.014, 10, 8), { enfasis: true, umbral: 80 });
      g.add(s);
      return { s, u: i / 12 };
    });
    const flechas = Array.from({ length: 6 }, () => { const l = k.linea([new V(), new V()], { enfasis: true, opacidad: 0.6 }); g.add(l); return l; });
    g.add(k.rotulo('ventilador (confirmado en foto)', [cx, cy + 0.33, zf], true));
    g.add(k.rotulo('serpentín', [-0.1, 0.72, -0.25]));
    g.add(k.rotulo('compresor', [0.2, 0.05, 0.1]));
    g.add(k.rotulo('rejilla del frente', [0.33, 0.66, 0.24]));
    g.add(k.rotulo('a la unidad interior', [-0.65, 2.2, 0]));
    let giro = 0, fase = 0;
    return {
      objeto: g,
      camara: { pos: [1.5, 1.1, 1.7], obj: [0, 0.55, 0] },
      caja: [[-0.8, 0.05, -0.25], [0.5, 1.0, 0.25]],
      etiqueta: 'Giro del ventilador y ciclo',
      escala: '1:10 · UNIDAD DEL MODELO',
      rotulo: 'Confirmado en foto: que son condensadoras y tienen ventilador. Compresor, serpentín y ciclo: principio general del aparato.',
      actualizar(m, dt) {
        giro += m * Math.PI * 2 * 3 * dt;
        aspa.rotation.z = -giro;
        fase = (fase + m * 0.12 * dt) % 1;
        for (const p of puntos) {
          const u = (p.u + fase) % 1;
          p.s.position.copy(sobre([...circ, circ[0]], u, V));
          p.s.scale.setScalar(u < iLiq ? 1.2 : u < iSube ? 0.7 : 0.95);
        }
        flechas.forEach((l, i) => {
          const x = -0.3 + (i % 3) * 0.3, y = 0.3 + Math.floor(i / 3) * 0.2;
          const pos = l.geometry.attributes.position;
          pos.setXYZ(0, x, y, -0.45);
          pos.setXYZ(1, x, y, -0.45 + 0.95 * m);
          pos.needsUpdate = true;
          l.visible = m > 0.02;
        });
        return m < 0.02 ? 'unidad detenida' : 'gas caliente al serpentín, líquido a la unidad interior, gas frío de regreso';
      },
    };
  },

  // ------------------------------------------------------------ 6. ático y gabletes
  atico(k) {
    const { THREE } = k;
    const V = THREE.Vector3;
    const g = new THREE.Group();
    const YE = 11.148, YR = 15.643, YG = 14.61, XE = 24.4, XR = 14.35, ZE = 13.1, ZG = 3.1;
    const cara = (pts, op) => {
      const geo = new THREE.BufferGeometry();
      const v = [];
      for (let i = 1; i < pts.length - 1; i++) v.push(...pts[0], ...pts[i], ...pts[i + 1]);
      geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
      geo.computeVertexNormals();
      return k.dibujar(geo, { umbral: 5, vidrio: true, ...op });
    };
    // mitad −z (corte longitudinal en z = 0)
    g.add(cara([[-XE, YE, -ZE], [XE, YE, -ZE], [XR, YG, -ZG], [XR, YR, 0], [-XR, YR, 0], [-XR, YG, -ZG]]));
    for (const s of [1, -1]) g.add(cara([[s * XE, YE, -ZE], [s * XE, YE, 0], [s * XR, YG, 0], [s * XR, YG, -ZG]]));
    // remate del muro y faja
    const rect = (y, ins) => [new V(-22.75 + ins, y, 0), new V(-22.75 + ins, y, -11.5 + ins), new V(22.75 - ins, y, -11.5 + ins), new V(22.75 - ins, y, 0)];
    g.add(k.linea(rect(11.6, 0)), k.linea(rect(11.78, 0.38), { opacidad: 0.5 }), k.linea(rect(12.04, 0.38), { opacidad: 0.5 }));
    // limas y cumbrera, para leer la forma a través del faldón translúcido
    g.add(k.linea([new V(-XE, YE, -ZE), new V(-XR, YG, -ZG), new V(-XR, YR, 0), new V(XR, YR, 0), new V(XR, YG, -ZG), new V(XE, YE, -ZE)]));
    g.add(k.linea([new V(-XE, YE, 0), new V(-XE, YE, -ZE), new V(XE, YE, -ZE), new V(XE, YE, 0)]));
    g.add(k.linea([new V(-XE, YE, 0), new V(-XR, YG, 0), new V(-XR, YR, 0)], { opacidad: 0.6 }), k.linea([new V(XE, YE, 0), new V(XR, YG, 0), new V(XR, YR, 0)], { opacidad: 0.6 }));
    // gabletes: NE (+x) en foto, SO (−x) extrapolado
    for (const s of [1, -1]) {
      const tri = [new V(s * XR, YG, -ZG), new V(s * XR, YG, 0), new V(s * XR, 15.6, 0), new V(s * XR, YG, -ZG)];
      g.add(k.linea(tri, { enfasis: true, discontinua: s < 0, guion: 0.4 }));
      g.add(k.linea([new V(s * XR, YG, 0), new V(s * XR, 15.53, 0)], { discontinua: s < 0 }));
    }
    g.add(k.rotulo('gablete NE (en foto)', [XR + 1, 16.4, -1.5], true));
    g.add(k.rotulo('gablete SO (extrapolado)', [-XR - 1, 16.4, -1.5]));
    g.add(k.rotulo('cumbrera 15,64 m', [0, 16.3, 0]));
    // partículas de aire caliente
    const N = 40;
    const azar = (i, s) => { const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x); };
    const parts = Array.from({ length: N }, (_, i) => ({
      x0: (azar(i, 1) * 2 - 1) * 20, z0: -1 - azar(i, 2) * 9, y0: 11.9 + azar(i, 3) * 1.2, u: azar(i, 4), r: azar(i, 5),
    }));
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
    const puntos = new THREE.Points(geo, new THREE.PointsMaterial({ color: k.C.enfasis, size: 5, sizeAttenuation: false }));
    g.add(puntos);
    const viento = [0, 1, 2].map(() => { const l = k.linea([new V(), new V()], { enfasis: true }); g.add(l); return l; });
    return {
      objeto: g,
      camara: { pos: [8, 52, 46], obj: [0, 13, 0] },
      caja: [[-25, 11, -13], [25, 16, 0]],
      etiqueta: 'Calor en el ático',
      escala: '1:200 · CUBIERTA',
      rotulo: 'Gablete NE en foto; SO extrapolado. El modelo no tiene ventilación de cumbrera. Por dónde entra el aire nuevo no está documentado.',
      actualizar(m, dt) {
        const w = tramo(m, 0.6, 1);
        const pos = geo.attributes.position;
        parts.forEach((p, i) => {
          p.u = (p.u + dt * Math.min(m, 0.6) * 0.35) % 1;
          const lado = p.x0 > 0 && p.r > w ? 1 : -1;
          const camino = [new V(p.x0, p.y0, p.z0), new V(p.x0, 14.9, -0.8), new V(lado * XR, 15.0, -0.8), new V(lado * (XR + 4), 15.3, -0.8)];
          const q = sobre(camino, p.u, V);
          pos.setXYZ(i, q.x, q.y, q.z);
        });
        pos.needsUpdate = true;
        puntos.visible = m > 0.01;
        viento.forEach((l, i) => {
          const a = l.geometry.attributes.position;
          const y = 14.9 + i * 0.2, z = -0.6 - i * 0.5;
          a.setXYZ(0, XR + 6, y, z);
          a.setXYZ(1, XR + 6 - w * 34, y, z);
          a.needsUpdate = true;
          l.visible = w > 0.01;
        });
        return m <= 0.01 ? 'sin movimiento de aire' : m < 0.6 ? 'tiro térmico: el aire caliente sube y sale por los gabletes'
          : 'con viento: entra por un gablete y sale por el otro (dirección ilustrativa)';
      },
    };
  },
};
