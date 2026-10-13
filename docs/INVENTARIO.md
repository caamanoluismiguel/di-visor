# Inventario físico del Edificio 106 (Isthmus, Ciudad del Saber)

Versión pública del inventario que usa D.I.Visor, hecha el 13 de octubre de 2026 y corregida con la verificación de ese mismo día. Las citas «INVENTARIO §x» de `contenido/lecciones.json` remiten a las secciones de este documento.

**Alcance.** Todo lo que sigue describe el modelo 3D del proyecto edificio-106 y lo que se ve en fotos; nada es un levantamiento. La escala del modelo tiene ±12 %, porque la planta salió de una vista de satélite. Además, la planta baja tiene un desfase de cota sin resolver: la losa interior del modelo está a 0,65 m, mientras que el rellano de la entrada llega a 1,12 m y la galería del SO a 1,28 m (§1, §7).

## 0. Cómo leer este documento

**Fuentes y versión del modelo**

- Los archivos del repo público edificio-106 (github.com/caamanoluismiguel/edificio-106, rama `main`, commit 95ef3bb) se citan por su ruta en ese repo, por ejemplo `modelo/cubiertas.glb`, `fuente/portico.mjs` o `docs/ciudad/espiga/kit-medidas.json`.
- Los GLB que usa D.I.Visor en su carpeta `modelo/` son copias byte a byte de los de `modelo/` en edificio-106 (`modelo/ORIGEN.txt`), salvo `edificio_piezas.glb`, que separa las piezas por familia.
- La «foto» pieza por pieza del modelo es `fuente/estado/estado.json` de edificio-106 (tomada el 5 de octubre de 2026 en el commit 1326f96). Cada pieza es una componente conexa de triángulos de un mismo material, con su caja en centímetros. Aquí todo va en metros.
- **Cómo conté y medí:** cargué las piezas de los GLB y las agrupé por material, tamaño de caja y posición. Una cantidad es el número de piezas con la misma forma; una medida es la diferencia entre las esquinas de su caja; un paso es la diferencia más repetida entre posiciones vecinas. Cuando una cifra sale de un archivo del repo, va citado.
- Limitación del método: dos piezas del mismo material que se tocan forman una sola pieza. Eso pasa con las tejas (dos canales vecinos se funden) y en algunas ventanas contiguas. Donde importa, lo digo y explico cómo lo corregí.
- **Fotos:** las fotos reales del 106 se citan como «foto del 106 (archivo de LM, no publicado)», con lo que muestra cada una cuando importa (§6).
- **Notas de modelado:** lo que viene de las notas de trabajo con que se armó el modelo se cita como «notas de modelado de LM (no publicadas)».

**Ejes y norte** (de `fuente/src/sol.js`, función `vectorSol`, y de los comentarios de `fuente/entrada.mjs`, `fuente/portico.mjs` y `fuente/src/main.js`)

- `y` es la altura, con el suelo del sitio en y = 0 (el pasto tiene la cara de arriba a −0,015 m, según `fuente/ciudad-datos.mjs`).
- `+x` apunta al **noreste**: `EJE_LARGO = 56`, «rumbo del eje largo (+X de Blender) medido en satélite, grados desde el norte».
- `+z` apunta al **sureste** (rumbo 146°) y `−z` al noroeste (326°). El norte verdadero queda entre −z y +x.
- Fachadas (`FACHADAS` en `fuente/src/sol.js`): **SE** en z = +11,50, larga, «hacia la calle, con la entrada 106»; **NO** en z = −11,50, larga, «hacia el cuadrángulo»; **NE** en x = +22,75, corta, «el jardín de la esquina»; **SO** en x = −22,75, corta, «el extremo opuesto al jardín».
- Ubicación: 8,9993° N, 79,5827° O (`LAT`, `LON` en `fuente/src/sol.js`).

**Grados de certeza que uso**

- **CONFIRMADO**: se ve en una foto real del 106 o lo dice un documento con fuente. Digo cuál.
- **MODELO**: es lo que tiene el GLB. La forma general sale de fotos, pero la medida no es un levantamiento. El `README.md` de edificio-106: «La escala del modelo tiene ±12 % y las ventanas de los pisos 2 y 3 son inferidas».
- **SUPUESTO**: el propio proyecto lo declara inventado o inferido, o no hay ninguna foto que lo respalde.

**Reglas de honestidad del proyecto** (`.claude/CLAUDE.md` de edificio-106): no afirmar el año de construcción, el uso original ni el autor del 106. Nada de este inventario debe leerse como historia del edificio.

## 1. Dimensiones generales

| Dato | Valor | Origen |
|---|---|---|
| Planta del muro | 45,50 × 23,00 m (x −22,75 a 22,75; z −11,50 a 11,50) | caja de «Warm lime-painted plaster» en `modelo/arquitectura.glb`. Igual que `docs/ciudad/espiga/INFORME.md` («Planta del 106: 45,50 × 23,00 m»). La planta salió de una vista aérea de Google Maps: unos 48 × 26 m de cubierta, con la barra de 10 m de unos 68 px (notas de modelado de LM, no publicadas). No es un levantamiento |
| Planta con aleros | 48,80 × 26,30 m (tablas de frente y tejas hasta x ±24,40 y z ±13,15; el tablero llega a x ±24,35 y z ±13,10, o sea 48,70 × 26,20 m) | caja de las tejas «Clay terracotta 00 a 08» en `modelo/cubiertas.glb` y de las tablas de frente. Vuelo de 1,65 m en las dos direcciones: 45,50 + 3,30 y 23,00 + 3,30 |
| Vuelo de los aleros | 1,65 m en las cuatro caras (1,647 en las cortas) | `docs/ciudad/espiga/kit-medidas.json`; PARTES en `fuente/src/main.js`: «Los tres salen 1,65 m del muro» |
| Plantas | 3 | losas de «V014 muted interior floor» |
| Cara superior de las losas | 0,65 · 4,30 · 7,95 m | «V014 muted interior floor» |
| Altura de entrepiso | 3,65 m (3,649 en `kit-medidas.json`) | diferencia entre losas; `ROTULOS` de `fuente/src/main.js`: «3 pisos de 3,65 m». Los aleros siguen ese paso; ventanas y molduras suben 3,80 m del piso 1 al 2 y 3,65 del 2 al 3 (§4.12) |
| Cielorraso del modelo (cara de abajo) | 3,71 · 7,36 · 11,01 m, unos 3,06 m sobre cada losa | «V014 shaded neutral ceiling». Ojo: el sombreador de interiores usa otro valor, `CIELO = 2.95` (`fuente/src/interiores.js`) |
| Remate del muro | 11,60 m | «Warm lime-painted plaster» |
| Base o zócalo | 0,65 m (bloque macizo de 0 a 0,68) | PARTES › zócalo: «0,65 m de alto, en todo el perímetro» |
| Aleros (cara de abajo, sofito) | 3,734 · 7,386 · 11,035 m | `kit-medidas.json`. `fuente/src/main.js` los redondea a 3,74 · 7,40 · 11,10 |
| Canto de la teja de cada alero | 3,851 · 7,499 · 11,148 m | `kit-medidas.json` |
| Cumbrera | 15,64 m (plano del tablero) a 15,73 m (lomo de las tejas). La pieza de remate («Main ridge cap») va de 15,54 a 15,73 m | `kit-medidas.json` («cumbrera a 15,643 m»); `COTAS` de `fuente/src/main.js`: «cumbrera · 15,7 m». Google Open Buildings da alrededor de 1 m menos (`README.md`) |
| Largo de la cumbrera | unos 28,7 m (x −14,35 a 14,35) | posición de los gabletes de ventilación (§2). PARTES › techo dice «unos 29 m» |
| Punto más alto | 17,00 m: punta de los dos mástiles | «Galvanized guardrail», de 12,50 a 17,00 en `modelo/detalles.glb` (§4.20) |
| Muros | 0,30 m de grueso | paños de «Warm lime-painted plaster» entre ventanas (z 11,20 a 11,50) |

**Incertidumbre grande: el nivel real de la planta baja.** En el modelo, la losa interior del piso 1 está a 0,65 m. En cambio, el rellano de la puerta principal y la rampa llegan a 1,12 m (siete contrahuellas contadas en una foto del 106, `fuente/entrada.mjs`), y las galerías elevadas del SO y del NO están a 1,24 a 1,28 m. El modelo deja esa diferencia sin resolver: la puerta principal tiene el vidrio desde 1,14 m, pero el piso interior detrás está a 0,65. Antes de construir piezas que dependan del piso de la planta baja, hay que medirlo en sitio.

## 2. Sistema de cubierta

- **Forma:** techo a cuatro aguas con un **gablete de ventilación** (remate triangular vertical) en lo alto de cada extremo corto. El cuerpo es escalonado: tres aleros corridos en las cuatro caras. Los dos de abajo son **mediaguas** («tejaroces corridos», PARTES › alero en `fuente/src/main.js`) y el de arriba es el alero del techo principal. Lo CONFIRMAN varias fotos del 106 (archivo de LM, no publicado): el testero NE, la esquina NE y NO, el testero SO y la fachada NO.
- **Pendiente:**
  - techo principal: 17,8° (32 %), con el canto a 11,148 m y la cumbrera a 15,643 m;
  - mediaguas: 17,9° (17,86° y 17,94°);
  - estas dos cifras salen de `docs/ciudad/espiga/kit-medidas.json`, como «media ponderada por área» de las caras de madera;
  - comprobación propia con los centros de las filas de tejas: 0,32 de subida por metro en las caras largas (unos 17,5°) y 0,34 en los extremos bajo el gablete (unos 18,7°). La cifra depende del método; por eso se dice «del modelo»;
  - la pendiente real no se midió.
- **Capas en el modelo** (`modelo/cubiertas.glb`, de abajo hacia arriba en cada alero):
  - el sofito y el tablero: «Dark stained roof timber», una pieza de 48 triángulos por alero, de 48,70 × 26,20 m en planta, con cajas a 3,80 a 4,48, 7,45 a 8,13 y 11,10 a 11,79 m. La caja incluye el grueso y el tramo sobre el muro: el plano inclinado del tablero, a 17,9°, sube 0,53 m en los 1,65 m de vuelo (en el alero 1, de y 3,80 a y 4,33);
  - la tabla de frente: «Dark stained roof timber», 4 tablas por alero (12 en total), de 0,14 m de alto y 0,10 de grueso, en x ±24,30 a 24,40 y z ±13,05 a 13,15;
  - las tejas.
- **Ático:**
  - Volumen bajo la cubierta principal: «Dark stained roof timber», 44,74 × 22,24 m, de 11,99 a 14,61 m.
  - Faja vertical: «Clay-colored vertical attic fascia», de 11,78 a 12,04 m, a 0,38 m hacia adentro del muro (x ±22,37, z ±11,12). En una foto del 106 del testero NE se ve como una franja terracota bajo el techo alto (CONFIRMADO).
- **Ventilación del ático:** los dos gabletes de los extremos (§4.18). No hay ventilación de cumbrera en el modelo. En una foto del 106 de la fachada NO se ven sobre el techo varias piezas pequeñas que sobresalen, quizá ventilaciones o tubos. No están modeladas y no sé qué son.
- **Canales y bajantes:** el modelo no tiene canalones. Tiene 12 tubos verticales en las fachadas (§4.19) cuya función no está documentada.
- **Versiones livianas** (no son elementos físicos):
  - `modelo/cubiertas_sombra.glb`: 5.466 piezas, solo para la sombra en el escritorio; también es el techo de la realidad aumentada;
  - `modelo/cubiertas_movil.glb`: para el teléfono (`fuente/tejas-movil.mjs`); no está en la carpeta `modelo/` de D.I.Visor.

## 3. Cómo se apoya en el terreno

- **En el modelo**, el terreno es plano alrededor del 106 (`README.md`, «Junto al sitio el terreno es plano»). El edificio se apoya en un zócalo macizo:
  - «Warm lime-painted plaster», una pieza de 45,50 × 23,00 m y 0 a 0,68 m de alto;
  - en su frente hay una franja de **bloques calados** (§4.8) en las caras SE y NO;
  - y hay 15 condensadoras al pie del muro (§4.27).
- **Extremo SO:** una **galería elevada** a 1,24 a 1,28 m rodea la esquina oeste. Corre por la cara SO (x −24,45 a −22,75, de z −11,60 a 8,40) y por la NO (z −12,80 a −11,50, de x −24,55 a −2,10).
  - Lo que hay debajo no es igual en todo el largo. El tramo NO se apoya en una base maciza («V013 restrained splash on plinth», en `modelo/sitio.glb`, de x −23,00 a −2,10 y de 0 a 1,15 m, en todo su ancho). Bajo el tramo SO hay un frente cerrado con 3 **rejillas** (de z −6,60 a 8,40). El único hueco abierto queda entre los 3 **pilares expuestos**, cerca de la esquina oeste (de z −11,6 a −6,6).
  - Se sube por tres escaleras (§4.22). El tramo SO tiene dos: la paralela al muro y la perpendicular.
  - En lo real lo CONFIRMAN fotos del 106 del testero SO y de la fachada NO: una galería elevada con barandas pardas, huecos abiertos bajo el descanso, pilares y tres rejillas empotradas en el zócalo (notas de modelado de LM, no publicadas).
  - Su altura (1,28 m) es inferida: la altura del corredor, las anchuras, las posiciones y el número de peldaños son aproximados (notas de modelado de LM, no publicadas).
- **Lo que no se sabe:**
  - Si debajo del piso de la planta baja hay un espacio ventilado. Los bloques calados lo sugieren, pero no está confirmado.
  - El tipo de cimentación.
  - Si el terreno real baja hacia el SO. La galería y las ventanas altas de esa cara lo sugieren; el modelo no.

## 4. Inventario por elemento

De lo más simple a lo más complejo. Para cada uno doy cinco cosas: (1) el material y el GLB, (2) la cantidad y la medida, (3) qué se sabe de lo real, (4) dónde está y (5) si tiene un mecanismo.

### 4.1 Teja (canal y cobija)

1. «Clay terracotta 00» a «Clay terracotta 08»: nueve tonos de la misma teja, repartidos al azar. Están en `modelo/cubiertas.glb` y, las del pórtico, en `modelo/entrada.glb`.
2. Hay dos tipos de pieza:
   - el **canal**, de 23 a 24 cm de ancho y 39 cm de largo en planta (30 cm en la primera y la última fila);
   - la **cobija**, de 13 a 14 × 39 cm, montada sobre la junta de dos canales.
   - El paso a lo ancho es de 23,5 cm (un canal y una cobija) y el de las filas, de unos 33 cm en planta (se solapan unos 6 cm). Lo medí en el tramo central de la mediagua SE, cuya pendiente en el modelo es de 17,9°.
   - **Cuántas hay:** conté las cobijas una por una, y los canales por su ancho dividido entre 23,5 cm, porque los canales vecinos se funden en una sola pieza:

     | Dónde | Canales | Cobijas | Total aprox. |
     |---|---|---|---|
     | Mediagua 1 (alero a 3,85 m) | ~3.600 | ~3.580 | ~7.200 |
     | Mediagua 2 (7,50 m) | ~3.600 | ~3.590 | ~7.200 |
     | Techo principal | ~16.100 | ~16.100 | ~33.200 (más unos 990 recortes en limas y cumbrera) |
     | Pórtico | | | ~460 (menos fiable: `fuente/portico.mjs` angostó y deformó esas tejas; en `modelo/entrada.glb` hay 448 piezas, algunas fundidas) |
     | **Todo** | | | **~48.000** |

   - En `modelo/cubiertas.glb` son 45.033 piezas de teja y 454.780 triángulos en todo el archivo (`fuente/estado/ESTADO.md`).
3. Lo real:
   - Es teja curva tipo canal y cobija, roja (fotos del 106, archivo de LM, no publicado; CONFIRMADO).
   - Su color se midió contra fotos: tejas ≈ (125, 63, 50) en el commit 225645c («Los colores de tejas, muros y aleros se midieron contra fotos del edificio», `docs/HISTORIA.md`).
   - El material (barro o concreto), el tamaño real y el número de tejas: NO medidos.
   - Una versión del modelo cambió «tiras continuas simplificadas por canales y cobijas individuales con solapes» (notas de modelado de LM, no publicadas).
4. Las tres cubiertas, en las cuatro caras, más el pórtico de entrada.
5. Mecanismo: ninguno.

### 4.2 Cabio o vigueta del alero

1. «Dark stained roof timber», en `modelo/detalles.glb`.
2. Son **624 viguetas** de 7 × 11 cm de sección y 1,65 m de largo, una cada 0,65 m:
   - por cada alero, 70 en cada cara larga y 34 en cada cara corta (208 por alero, 3 aleros);
   - van horizontales, a 3,82 a 3,93 m, 7,47 a 7,58 m y 11,12 a 11,23 m;
   - en las caras SE y NO van de z ±11,41 a ±13,06.
   - Hay una medida anterior que estaba mal: «cada 1,625 m (29 en la SE, piso 1)», corregida en una versión posterior a «viguetas horizontales cada 0,65 m» (`docs/ciudad/espiga/INFORME.md`).
3. Lo real: en fotos del 106 (archivo de LM, no publicado) se ven maderos oscuros bajo los aleros (CONFIRMADO). Su número, paso y sección: NO medidos. Según las notas de modelado de LM (no publicadas), antes eran crema en el modelo y «en las fotos se leen oscuros».
4. Bajo los tres aleros, en las cuatro caras.
5. Mecanismo: ninguno.

### 4.3 Tabla de frente, sofito y faja de madera

1. Todo en «Dark stained roof timber»:
   - en `modelo/cubiertas.glb`: las tablas de frente y el sofito o tablero (§2);
   - en `modelo/detalles.glb`: **8 fajas** contra el muro, de 0,27 m de alto y 0,03 de grueso, 4 por mediagua. Van a 4,27 a 4,54 y 7,91 a 8,18 m, a lo largo de las cuatro caras (45,50 y 22,40 m). El alero del techo principal no tiene esta faja; arriba está la faja del ático (§4.17).
2. Las medidas están en §2 y aquí arriba.
3. Lo real: la banda parda oscura sobre el arranque de cada mediagua se ve en todas las fotos del 106 (archivo de LM, no publicado; CONFIRMADO). El material (madera o pintura) no está confirmado.
4. En todo el perímetro, en cada mediagua.
5. Mecanismo: ninguno.

### 4.4 Muro con repello

1. «Warm lime-painted plaster», en `modelo/arquitectura.glb` (92 piezas):
   - el cuerpo, de 45,50 × 23,00 × 10,95 m (de 0,65 a 11,60);
   - el zócalo (§4.7);
   - y paños de 0,30 m de grueso entre las ventanas.
   - En `modelo/sitio.glb` hay más del mismo material: el muro de la planta baja SO y las losas de la galería.
2. Las medidas están en §1.
3. Lo real:
   - Muros blancos (CONFIRMADO en todas las fotos del 106). El color se midió en fotos: «blanco neutro (no crema)» (commit 225645c).
   - **De qué está hecho el muro (bloque, concreto o ladrillo) no lo dice ninguna fuente del 106.** El nombre del material es solo apariencia.
4. Las cuatro fachadas.
5. Mecanismo: ninguno.

### 4.5 Moldura o imposta

1. «Fresh cream trim», en `modelo/detalles.glb`.
2. Son **11 molduras** de 5 × 6 cm de sección a lo largo del muro:
   - a 1,66 a 1,71 m en las caras SE, NO y NE;
   - a 5,46 a 5,51 y 9,11 a 9,16 m en las cuatro caras;
   - es decir, justo bajo los alféizares de cada piso. Del piso 1 al 2 suben 3,80 m y del 2 al 3, 3,65 m, como las ventanas (§4.12).
3. Lo real: en fotos del 106 (archivo de LM, no publicado) se ve una línea fina bajo las ventanas. Su perfil no está medido.
4. Todo el perímetro.
5. Mecanismo: ninguno.

### 4.6 Alféizar

1. «Fresh cream trim»:
   - 106 en `modelo/ventanas.glb`;
   - 7 en `modelo/sitio.glb` (ventanas de la planta baja SO).
2. Son **113 alféizares**, uno por ventana, de 5 cm de alto y 34 cm de fondo. Son de 2 a 4 cm más anchos que su ventana, según cuál: 4 cm en las típicas de la SE (2,32 contra 2,28 m) y 2 cm en las de las puntas de la SE (1,62 contra 1,60) y en varias de la NE (2,07 contra 2,05; 1,21 contra 1,19). Salen 0,19 m del muro (z 11,35 a 11,69 en la SE).
3. Lo real: la forma no está confirmada en detalle.
4. Bajo cada ventana.
5. Mecanismo: ninguno.

### 4.7 Base o zócalo

1. «Warm lime-painted plaster» en `modelo/arquitectura.glb`: una pieza de 220 triángulos de 45,50 × 23,00 × 0,68 m. En el extremo SO se suman las caras de la galería, con el material «V013 restrained splash on plinth» (salpicadura) en `modelo/sitio.glb`.
2. Mide 0,65 m según la ficha del visor (el muro arranca a 0,65); la caja llega a 0,68.
3. Lo real:
   - Hay una base más alta que el terreno (fotos del 106, archivo de LM, no publicado; CONFIRMADO).
   - Las marcas de salpicadura sobre el zócalo y los pilares se pusieron siguiendo las fotos del testero SO (notas de modelado de LM, no publicadas).
   - La altura real: NO medida.
4. Todo el perímetro.
5. Mecanismo: ninguno.

### 4.8 Bloque calado (ventilación del zócalo)

1. Cada bloque tiene dos materiales en `modelo/detalles.glb`:
   - un hueco «Dark ventilation recess» de 0,32 × 0,28 m;
   - y 4 cuadros «Fresh cream trim» de 12 × 12 cm delante, a 0,27 a 0,39 y 0,45 a 0,56 m.
2. Son **77 bloques** en franjas continuas, uno cada 0,36 m:
   - 50 en la cara SE, de x −10,48 a 7,48 (18,0 m);
   - 27 en la cara NO, de x −0,98 a 8,70 (9,7 m);
   - a una altura de 0,28 a 0,56 m.
   - (Los 308 cuadros crema se reparten 200 en la SE y 108 en la NO, 4 por bloque.)
3. Lo real:
   - Se ven bloques calados en la base en fotos del 106 (archivo de LM, no publicado): a la izquierda de la entrada, en la fachada SE y en la NO. CONFIRMADO.
   - El dibujo del calado, el número de bloques y si ventilan un espacio bajo el piso: NO confirmados.
4. Al pie de las caras SE y NO.
5. Mecanismo: ninguno. Es una abertura fija.

### 4.9 Rejillas del frente de la galería SO

1. En `modelo/sitio.glb`:
   - el hueco: «Dark ventilation recess», de 0,54 × 0,44 m;
   - el marco: «V013 restrained splash on plinth»;
   - los barrotes: «Brown painted service access», 7 por rejilla, de 0,06 × 0,02 × 0,50 m.
2. Son **3 rejillas** en x −24,21, centradas en z 4,30, 5,55 y 6,80, de 0,37 a 0,81 m de altura.
3. Lo real: tres rejillas empotradas en el zócalo, inferidas de las fotos del testero SO (notas de modelado de LM, no publicadas). Su medida: NO confirmada.
4. Frente de la galería SO, al norte de su escalera.
5. Mecanismo: ninguno modelado. Si se abren o se pueden quitar: no se sabe.

### 4.10 Pilar expuesto

1. «V013 weathered exposed support piers», en `modelo/sitio.glb`.
2. Son **3 pilares** de 0,38 × 0,30 m y 1,14 m de alto, en x −24,45 a −24,07 y z −11,38, −9,06 y −6,76 (centros; unos 2,3 m entre sí).
3. Lo real: pilares bajo la galería, vistos en las fotos del testero SO (notas de modelado de LM, no publicadas). Su sección: NO medida.
4. Bajo el borde exterior de la galería SO, cerca de la esquina oeste.
5. Mecanismo: ninguno.

### 4.11 Losas, pisos y cielorrasos interiores

1. En `modelo/arquitectura.glb`:
   - «V014 muted interior floor» (16 piezas): los pisos y sus bordes;
   - «V014 shaded neutral ceiling» (3): los cielorrasos;
   - «Unlit interior walls» (4): placas de 45,30 × 22,80 m y 0,22 de grueso a 0,54 a 0,76, 4,19 a 4,41, 7,84 a 8,06 y 11,49 a 11,71 m. Las tres primeras marcan los cantos de las losas; la cuarta está a la altura del remate del muro y no es una losa de piso;
   - y una tarima de 2,90 × 22,34 m a 1,21 a 1,28 m en el extremo SO (x −22,45 a −19,55).
2. Las medidas están en §1.
3. Lo real: no hay ninguna medida interior en metros.
4. En el interior.
5. Mecanismo: ninguno.

### 4.12 Ventana (marco y vidrio)

1. Tres materiales:
   - los marcos: «Aged aluminium window frames», en `modelo/ventanas.glb` (618 piezas) y en `modelo/sitio.glb` (las 7 de la planta baja SO, 38 piezas);
   - el vidrio: «V014 physical clear glass 0», en `modelo/arquitectura.glb` (400 paños);
   - el alféizar (§4.6).
2. **113 ventanas.** Las conté por sus marcos agrupados por fachada y piso, y por sus alféizares:

   | Fachada | Piso 1 | Piso 2 | Piso 3 | Total |
   |---|---|---|---|---|
   | SE (calle) | 12 | 14 | 14 | 40 |
   | NO (cuadrángulo) | 10 | 12 | 10 | 32 |
   | NE (jardín) | 5 | 8 | 7 | 20 |
   | SO | 7 | 8 | 6 | 21 |
   | **Total** | 34 | 42 | 37 | **113** |

   - Con los 5 vanos de puerta (§4.21), el modelo tiene 118 aberturas. Un conteo por piezas sueltas da una ventana menos: en la NE, piso 3, dos ventanas pegadas, a 3 cm una de otra, se funden en una sola pieza.
   - **Ventana típica de la fachada SE:**
     - marco de 2,28 × 1,63 m (1,60 × 1,63 en las de las puntas), con perfiles de 4 × 9 cm;
     - dividido en 4 paños (2 × 2) por un parteluz y un travesaño a media altura;
     - paños de 1,08 × 0,74 m;
     - vidrio 9 a 10 cm hacia adentro del muro.
   - **En las caras NE y SO** hay muchas sueltas, de 1,05 a 1,15 m de ancho, con 2 paños. Los pares son de las fachadas largas.
   - **Alturas:**
     - piso 1: marco de 1,78 a 3,41 m (vidrio de 1,82 a 3,37);
     - piso 2: de 5,58 a 7,16 (vidrio de 5,62 a 7,12);
     - piso 3: de 9,23 a 10,81 (vidrio desde 9,27);
     - las de la planta baja SO, de 2,01 a 3,41 (por la galería);
     - dos ventanas altas y pequeñas en la NE, piso 1, de 2,84 a 3,41 m.
   - **Antepecho del vidrio:** 1,17 m en el piso 1 y 1,32 en los pisos 2 y 3. Por eso ventanas y molduras suben 3,80 m del piso 1 al 2 y 3,65 del 2 al 3, mientras los aleros suben siempre 3,65. «Ventana 1,55 m de alto» (`docs/ciudad/espiga/kit-medidas.json`).
   - **Ritmo de la fachada SE:** módulo de vanos de 6,69 m, con 42 bordes que calzan y un error medio de 1,2 cm (`kit-medidas.json`). Medido en el modelo: ventanas de 2,28 m, 0,34 m de muro entre las dos del par y 1,80 m entre pares, o sea 2,28 + 0,34 + 2,28 + 1,80 = 6,70 m. Por el vidrio: 2,19 + 0,43 + 2,19 + 1,89.
3. Lo real:
   - Ventanas de aluminio con marco claro, en pares en las fachadas largas, divididas en paños (fotos del 106, archivo de LM, no publicado; CONFIRMADO). En la fachada larga de arriba se cuentan catorce ventanas, entre ellas las de las puntas y seis pares juntos (notas de modelado de LM, no publicadas), lo que coincide con las 14 del modelo.
   - **Las ventanas de los pisos 2 y 3 son inferidas** (`README.md`). Las alturas salen de una proporción de las fotos (notas de modelado de LM, no publicadas).
   - El testero SO tiene dimensiones menos seguras por la perspectiva oblicua de las fotos (notas de modelado de LM, no publicadas).
   - El tipo de hoja (fija, corrediza o proyectante): NO confirmado.
4. Las cuatro fachadas, los tres pisos.
5. Mecanismo: **si las hojas abren y cómo: NO confirmado.** El modelo no distingue entre hoja fija y hoja móvil. En varias fotos del 106 se ven persianas de lamas por dentro del vidrio. Es mi lectura de la imagen, sin confirmar. El sombreador de interiores dibuja «la persiana» de forma procedural (`fuente/src/interiores.js`).

### 4.13 Lama de celosía (panel de lamas)

1. «V011 photographed blue grey louvres», en `modelo/ventanas.glb` (281 piezas) y en `modelo/sitio.glb` (21 piezas).
2. **38 paneles con 301 lamas en total**, más un tablero liso:
   - 35 paneles de **8 lamas** en `modelo/ventanas.glb` (280 lamas). Cada lama mide el ancho del paño (2,16, 2,07, 1,99, 1,48, 1,39 o 1,02 m, según la ventana), 9 a 10 cm de alto y 7 cm de fondo, y van una cada 9,3 cm. El panel mide unos 0,74 m de alto y tapa la mitad de abajo o la de arriba de la ventana, unos 5 cm por fuera del vidrio;
   - 3 paneles de **7 lamas** en `modelo/sitio.glb` (21 lamas), en la planta baja SO, de 2,08 a 2,70 m;
   - y 1 tablero liso del mismo material en la NE, piso 2 (z 9,66 a 10,68, de 5,62 a 6,34 m).
   - Por fachada (de `modelo/ventanas.glb`): SE 7 paneles, NO 9, NE 12 y SO 7; más los 3 de la SO en `modelo/sitio.glb`.
3. Lo real:
   - En fotos del 106 (archivo de LM, no publicado) hay paños con lamas horizontales en algunas ventanas: en la entrada, en el testero NE y en la esquina NE y NO, donde se leen como lamas pequeñas de vidrio (notas de modelado de LM, no publicadas).
   - El nombre del material dice que el color se tomó de fotos («photographed»).
   - **Si son celosías de vidrio o de aluminio, si van por fuera o por dentro del vidrio y en qué ventanas exactas están: NO confirmado.**
4. Ventanas sueltas en las cuatro fachadas (posiciones en el GLB).
5. Mecanismo: **es probable que sean celosías de lamas que giran (tipo «jalousie»), pero NO está confirmado.** En el modelo las lamas son fijas. Si el visor las va a mover, el eje de giro iría a lo largo de cada lama, a media altura de los 9 a 10 cm.

### 4.14 Panel de madera con un hueco (NE, piso 2)

1. Dos materiales en `modelo/ventanas.glb`:
   - el tablero: «V011 small weathered infill board», de 0,02 × 0,72 × 0,95 m, en x 22,73 a 22,75 y z 7,51 a 8,46, de 5,62 a 6,34 m;
   - el hueco: «Dark ventilation recess», de 0,16 × 0,16 m, en z 7,91 a 8,07, de 5,72 a 5,88 m.
2. Es **1** panel.
3. Lo real: panel de madera con un hueco; qué hay detrás no está confirmado.
4. Fachada NE, piso 2, cerca de la esquina con la SE.
5. Mecanismo: ninguno modelado.

### 4.15 Ménsula

1. «Fresh cream trim», en `modelo/detalles.glb`, con 24 triángulos cada una.
2. **78 ménsulas**: 26 por alero (8 en la SE, 8 en la NO, 5 en la NE y 5 en la SO).
   - Cada una tiene 0,26 m de ancho, 0,82 de alto y 1,50 de vuelo según su caja (el perfil llega a 1,47 m del muro según `docs/ciudad/espiga/kit-medidas.json`).
   - Van a 3,02 a 3,84, 6,67 a 7,49 y 10,32 a 11,14 m, bajo cada alero.
   - **En la SE**, sus centros están en x −22,45, −16,75, −10,05, −3,35, 3,35, 10,05, 16,75 y 22,45. Las seis del centro van cada 6,70 m, sobre el muro angosto entre las dos ventanas de un par. Las de las puntas (±22,45) están a 5,70 m de su vecina y a 0,30 m de la esquina.
   - **En la NO** no son regulares: x −22,65, −16,77, −11,08, −4,52, 1,87, 8,61, 15,90 y 22,65.
   - **En la NE**: z −11,25, −7,54, −0,21, 7,26 y 11,23.
   - **En la SO**: z ±11,23, ±7,26 (±6,85 en el alero 1) y 0.
   - En cada esquina hay dos ménsulas perpendiculares.
3. Lo real:
   - Ménsulas blancas en escuadra bajo cada alero (fotos del 106, archivo de LM, no publicado; CONFIRMADO). En las esquinas se ven en pareja, formando una V.
   - En las fotos, las ménsulas van sobre todo entre pares de ventanas juntas, no una por cada vano (notas de modelado de LM, no publicadas).
   - **«El modelo no dice si cargan de verdad o son decorativas»** (PARTES › ménsula en `fuente/src/main.js`).
   - El perfil exacto: NO medido.
4. Bajo los tres aleros, en las cuatro caras.
5. Mecanismo: ninguno.

### 4.16 Alero y mediagua (el conjunto)

1. Cinco piezas en los tres aleros: las tejas (§4.1), el tablero y la tabla de frente (§2), las viguetas (§4.2) y las ménsulas (§4.15). En los dos de abajo se suma la faja contra el muro (§4.3).
2. Son **3 aleros corridos** de 1,65 m de vuelo:
   - el sofito a 3,734, 7,386 y 11,035 m;
   - el canto de la teja a 3,851, 7,499 y 11,148 m;
   - la pendiente, unos 17,9° en las mediaguas y 17,8° en el techo principal;
   - el frente de la teja de la mediagua mide 12,4 cm (`kit-medidas.json`).
3. Lo real: CONFIRMADO en todas las fotos del 106. El vuelo real: NO medido. La cifra de 1,6 m viene de la planta aérea (notas de modelado de LM, no publicadas).
4. Todo el perímetro, en los pisos 1, 2 y 3.
5. Mecanismo: ninguno.

### 4.17 Faja del ático

Ver §2: «Clay-colored vertical attic fascia», 1 pieza en `modelo/cubiertas.glb`, de 0,26 m de alto, de 11,78 a 12,04 m. CONFIRMADO como franja terracota en una foto del 106 (archivo de LM, no publicado). Sin mecanismo.

### 4.18 Gablete de ventilación del ático

1. En `modelo/cubiertas.glb`:
   - el hueco: «Dark ventilation recess», 2 piezas planas en x ±14,35, de 6,20 m de ancho (z −3,10 a 3,10) y de 14,61 a 15,60 m de alto;
   - el marco del triángulo: «Dark stained roof timber», 4 maderos inclinados. La caja de cada uno es de 0,10 × 1,08 × 3,13 m, pero 1,08 es lo que baja el madero en sus 3,11 m de recorrido, no su canto, que es de unos 0,09 m. Cada madero mide unos 3,3 m de largo.
   - En `modelo/sitio.glb`, por cada gablete, un montante vertical de 8 × 8 cm (14,61 a 15,53 m) y un travesaño de 3,40 m (14,92 a 14,99 m), también en «Dark stained roof timber».
2. Son **2 gabletes** (NE y SO). Cada uno es un triángulo de unos 6,2 m de base y 1,0 m de alto (unos 3,1 m²).
3. Lo real: el remate triangular oscuro con montante y travesaño de madera se ve en una foto del 106 del testero NE (archivo de LM, no publicado; CONFIRMADO). El del extremo SO está extrapolado de esa foto, es decir, no confirmado (notas de modelado de LM, no publicadas). Si el hueco tiene malla o rejilla: NO se sabe.
4. Arriba de cada extremo corto, en el eje de la cumbrera.
5. Mecanismo: ninguno modelado. Es una abertura fija.

### 4.19 Tubos verticales y sus abrazaderas

1. Los tubos son «Fresh cream trim» y las abrazaderas, «Galvanized guardrail», todo en `modelo/detalles.glb`.
2. Son **12 tubos** de 10,68 m (de 0,12 a 10,80 m):
   - 3 en la SE (x −19,00, −6,50 y 6,80);
   - 6 en la NO (x −12,80, 7,10 y 16,80, y tres más gruesos juntos en el centro, de 0,16 × 0,28 m, en x −0,10, 0,00 y 0,55);
   - 3 en la NE (z −8,80, −3,50 y 4,50);
   - los demás tubos miden unos 6 × 20 cm de caja, contando los codos.
   - Hay **48 abrazaderas**, 4 por tubo, centradas a 0,80, 2,60, 5,50 y 9,20 m.
3. Lo real:
   - En el centro de la NO, una foto del 106 (archivo de LM, no publicado) muestra tubos de servicio a la vista (CONFIRMADO).
   - Las fotos muestran además muchos conductos y cables oscuros delgados que no están modelados.
   - **Si son bajantes de lluvia, desagües o ductos de servicio: NO confirmado.**
4. Sobre las fachadas SE, NO y NE.
5. Mecanismo: ninguno.

### 4.20 Mástiles de antena

1. «Galvanized guardrail», en `modelo/detalles.glb`.
2. Son **2 mástiles** de unos 5 a 6 cm de diámetro, de 12,50 a 17,00 m (4,5 m sobre el techo), en x −20,0 y 20,0, z −2,0.
3. Lo real: se ven mástiles sobre el techo en varias fotos del 106 (archivo de LM, no publicado; CONFIRMADO). Se quitaron unas crucetas que no tenían respaldo en las fotos y se mantuvieron los tubos verticales (notas de modelado de LM, no publicadas). Su altura y su posición exacta: NO medidas.
4. Sobre la cubierta, cerca de cada extremo.
5. Mecanismo: ninguno.

### 4.21 Puertas

**a) Puerta principal (SE)**

1. Materiales:
   - el vidrio: «Window glass», en `modelo/entrada.glb`, 2 hojas de 0,94 × 2,00 m (de 1,14 a 3,14 m, x 11,82 a 13,78);
   - el marco: «Aged aluminium window frames», en `modelo/ventanas.glb`, con tres montantes en x 11,76, 12,80 y 13,84, de 0,70 a 3,24 m;
   - el fondo oscuro: «Unlit interior walls», de 2,08 × 2,54 m;
   - los tiradores: «Galvanized guardrail», en `modelo/entrada.glb`, 2 tiradores verticales de 0,46 m (de 1,90 a 2,36 m) en x 12,59 y 13,61.
2. Es 1 puerta doble.
3. Lo real: una entrada de vidrio tras el pórtico (foto del 106 de la entrada, archivo de LM, no publicado; CONFIRMADO). Medidas: NO tomadas. `fuente/portico.mjs` dice: «la puerta del modelo mide 2,12 m con su marco».
4. Fachada SE, x 11,7 a 13,9, centrada en x 12,80 bajo el pórtico.
5. Mecanismo: **bisagra, pivote o corrediza: NO confirmado.** Los tiradores modelados sugieren hojas batientes, pero es una suposición. Cerradura: no se sabe.

**b) Puertas de servicio pardas**

1. «Brown painted service access», en `modelo/ventanas.glb`. Cada una es una hoja de 108 triángulos con 3 listones verticales (en los bordes y al centro).
2. Son **3 puertas** de 2,54 m de alto (de 0,70 a 3,24):
   - SE, x −13,75 a −12,25 (1,50 m);
   - NO, x −4,15 a −2,45 (1,70 m);
   - NO, x 11,25 a 13,05 (1,80 m).
3. Lo real:
   - En una foto del 106 de la fachada NO se ven dos puertas pardas.
   - En una foto de la fachada SE se ve una puerta parda con su escalera, y en esa foto se ve **una sola hoja**, mientras que el listón central del modelo sugiere dos. CONFIRMADO que existen; el ancho y el número de hojas, NO. (Fotos del 106, archivo de LM, no publicado.)
4. Fachadas SE y NO.
5. Mecanismo: hoja batiente probable, con bisagras y cerradura. NO confirmado.

**c) Puerta de la galería SO**

1. «Brown painted service access», en `modelo/sitio.glb`: una hoja de 1,26 × 2,07 m, de 1,28 a 3,35 m, en x −22,75 y z −5,33 a −4,07, con el dintel a 3,31 a 3,39. La manija está a 2,22 a 2,24 m, 0,94 m sobre la galería.
2. Es **1** puerta.
3. Lo real: puerta parda en el testero SO, vista en las fotos de ese testero (notas de modelado de LM, no publicadas). Su medida: NO confirmada.
4. Fachada SO, a nivel de la galería, frente a la escalera perpendicular.
5. Mecanismo: como en b), NO confirmado.

**Cuenta total:** 5 vanos de puerta en el modelo: la entrada principal y 4 con puerta parda (las 3 de servicio de las fachadas SE y NO y la de la galería SO). Con las 113 ventanas (§4.12), son 118 aberturas.

**Otra inconsistencia:** la puerta NO de x −4,15 a −2,45 arranca a 0,70 m, pero la escalera trasera que llega a ella sube a 1,28 m (§4.22 c). El modelo no lo resuelve.

### 4.22 Peldaños y escaleras

| Escalera | Material y GLB | Dónde | Medidas (de las cajas) | Lo real |
|---|---|---|---|---|
| a) Entrada principal | «Pale cast concrete — entrance», `modelo/entrada.glb` | SE, x 11,65 a 13,95, z 11,50 a 13,64 | **7 peldaños** de 2,30 m de ancho, contrahuella de 0,137 m, huella de unos 0,30; de la losa (0,16) al rellano (1,12); descanso de 0,41 m ante la puerta | 7 contrahuellas contadas en una foto del 106 de la entrada (CONFIRMADO el número; hay un recorte de esa foto en `fuente/verificacion/entrada/comparativa-entrada.png`). Las notas de modelado de LM (no publicadas) adoptaron 0,16 m por peldaño, con lo que el rellano queda a 1,12 m; `fuente/entrada.mjs` las repartió en 0,137. Las medidas son inferidas |
| b) Dos escalones de servicio | «Brown painted service access», `modelo/detalles.glb` (540 triángulos cada uno) | SE: x −13,95 a −12,05, z 11,87 a 13,44. NO: x 11,05 a 13,25, z −13,44 a −11,87 | bloques escalonados de 1,90 y 2,20 m de ancho, 1,57 m de fondo y 0,80 m de alto, con pasamanos inclinados de 4 cm (de 0,15 a 1,74 m) | la escalera parda frente a la puerta SE se ve en fotos del 106; el número de peldaños, NO medido |
| c) Escalera trasera NO | peldaños «V012 aged reddish access paving», `modelo/sitio.glb` | x −4,37 a −2,22, z −15,20 a −12,80 | **8 peldaños** de 2,15 m de ancho, contrahuella de 0,16 y huella de 0,30 a 0,32, de 0 a 1,28 m en 2,41 m | escaleras traseras en una foto del 106 de la fachada NO (CONFIRMADO que existe). `fuente/arbustos.mjs` quitó un seto que la tapaba |
| d) Escalera SO, paralela al muro | «V012 aged reddish access paving», `modelo/sitio.glb` | x −24,45 a −22,75, z 8,40 a 11,19 | **9 peldaños** de 1,70 m de ancho, contrahuella de unos 0,14 y huella de 0,31, de 0 a 1,28 m | escalera paralela al muro, vista en las fotos del testero SO (notas de modelado de LM, no publicadas) |
| e) Escalera SO, perpendicular | contrahuellas «Warm lime-painted plaster» con huellas «V013 aged access concrete», `modelo/sitio.glb` | x −26,85 a −24,45, z −5,50 a −3,90 | **8 peldaños** de 1,60 m de ancho, contrahuella de 0,16 y huella de 0,30, de 0 a 1,28 m, frente a la puerta SO | escalera que sale hacia fuera del testero desde la puerta, según las fotos del testero SO (notas de modelado de LM, no publicadas) |

En las cinco, el ancho, la cota y el número de peldaños son inferidos, salvo los 7 de la entrada. Ninguna tiene mecanismo.

### 4.23 Galería elevada y sus barandas pardas

1. Materiales:
   - el piso: «V012 aged reddish access paving», a 1,24 a 1,28 m;
   - la losa: «Warm lime-painted plaster», a 1,14 a 1,24;
   - el frente: «V013 restrained splash on plinth»;
   - la baranda: «Brown painted service access»;
   - todo en `modelo/sitio.glb`.
2. Medidas:
   - el tramo NO tiene 1,30 m de ancho y va de x −24,55 a −2,10 (22,45 m), sobre una base maciza (§3);
   - el tramo SO tiene 1,70 m de ancho y va de z −11,60 a 8,40 (20,0 m), con un frente cerrado y 3 rejillas y un hueco abierto entre pilares cerca de la esquina (§3);
   - la baranda tiene postes de 4 × 4 cm, 12 en la NO (uno cada 1,99 m) y 12 en la SO (uno cada 1,7 a 2,05 m), más el de la esquina, y 3 tubos a 0,13, 0,49 y 0,93 m sobre el piso (de 1,39 a 2,23 m de altura absoluta).
3. Lo real: galería elevada con barandas pardas delgadas, en fotos del 106 de la fachada NO y del testero SO (archivo de LM, no publicado; CONFIRMADO). La cota y el paso de los postes: NO medidos.
4. Esquina oeste del edificio, en las caras NO y SO.
5. Mecanismo: ninguno.

En el modelo, solo la puerta SO está a la cota de la galería. La puerta NO arranca a 0,70 m (§4.21) y el piso interior está a 0,65 m (§1).

### 4.24 Rampa y sus barandas galvanizadas

1. Materiales:
   - la rampa: «Pale cast concrete — entrance», en `modelo/entrada.glb`;
   - los bordillos laterales: «Fresh cream trim», de 0,10 × 0,73 m;
   - los tubos: «Galvanized guardrail»;
   - los postes de 4 × 4 cm están, por un artefacto del modelo, en el material del concreto.
2. Medidas:
   - **Tramo bajo:** de x 15,60 a 21,50 (5,90 m) en z 12,92 a 14,24. Sube de 0,16 a 0,64 m.
   - **Descanso:** de x 21,50 a 22,90 (1,40 m), z 11,50 a 14,24 (2,74 m), a 0,64 m.
   - **Tramo alto:** de x 21,50 a 15,60 (5,90 m) en z 11,50 a 12,82, pegado al muro. Sube de 0,64 a 1,12 m y llega al porche de x 14,90 a 15,60.
   - **Pendiente: 8,1 %** en cada tramo (0,48 m en 5,90 m = 8,14 %). Según qué se mida en `modelo/entrada.glb` sale de 8,1 a 8,3 %: la base de los postes del tramo bajo va de 0,15 a 0,64 (8,3 %), la del alto de 0,64 a 1,12 (8,1 %) y el pasamanos sube 0,486 en 5,90 (8,2 %). Las notas de modelado de LM (no publicadas) dan un 8,22 % inferido. Se usa 8,1 %, coherente con las cotas que se publican.
   - **Recorrido por la línea central: unos 14,6 m.** Del centro del tramo bajo (z 13,58) al centro del descanso (x 22,20): 6,60 m; a lo ancho del descanso, de z 13,58 a 12,16: 1,42 m; y de vuelta por el centro del tramo alto hasta x 15,60: 6,60 m.
   - **Barandas:** 7 postes por lado y por tramo, uno cada 0,98 m. Tres tubos: el pasamanos de Ø 5,4 cm y dos travesaños de Ø 3,6 cm (`fuente/barandas.mjs`, para el rellano: «a z 1,565 (Ø 5,4 cm), 1,145 y 0,805 (Ø 3,6 cm)»).
3. Lo real:
   - La rampa de dos tramos con giro, a la derecha del pórtico y adosada a la fachada, se ve en fotos del 106 de la entrada (archivo de LM, no publicado; CONFIRMADO).
   - Las cotas y la pendiente son inferidas, y no se certifica conformidad normativa (notas de modelado de LM, no publicadas).
   - La baranda se ve metálica y clara en la foto.
4. Fachada SE, al NE de la entrada (de x 14,9 a 22,9).
5. Mecanismo: ninguno.

### 4.25 Pórtico de entrada

1. Todo en `modelo/entrada.glb`:
   - las columnas: «Fresh cream trim»;
   - las maderas: «Dark stained roof timber»;
   - la cubierta: «Clay terracotta 00 a 08»;
   - la losa: «Pale cast concrete — entrance slab»;
   - los muretes: «Warm lime-painted plaster».
2. Medidas, tomadas de `fuente/portico.mjs --medir` (lista `portico` de `fuente/estado/estado.json`) y de su encabezado:
   - **Columnas:** 3. Dos al frente, en x 11,70 y 13,90 y z 16,40 (2,20 m entre ejes), y una detrás, en x 11,46 y z 14,00. Cada una tiene una basa de 0,52 × 0,52 m (de 0 a 0,62), un fuste de 0,38 × 0,38 (de 0,18 a 2,32) y un capitel de 0,47 × 0,47 (de 2,14 a 2,40).
   - **Maderas:**
     - 2 zapatas de 1,00 m (de 2,40 a 2,58);
     - una viga al frente de 2,90 × 0,30 m (x 11,35 a 14,25, de 2,58 a 2,88);
     - una viga trasera de 0,24 m (z 13,40 a 16,20);
     - **5 cabios** de 8 × 10 cm, uno cada 0,60 m (x 11,60 a 14,00);
     - una viga perimetral de 20 cm bajo el alero.
   - **Cubierta:** de 3,85 × 6,00 m (x 10,875 a 14,725, z 11,30 a 17,30), con el alero a 2,70 y la cumbrera a 3,72 m. La pendiente es de 0,352 al frente (19,4°) y de 0,494 a los lados (26,3°).
   - **Losa:** de 5,70 × 3,95 m (x 9,90 a 15,60, z 12,82 a 16,77), de −0,05 a 0,16 m.
   - **Muretes:** el oeste de x 10,00 a 11,65 y el este de x 13,95 a 14,90, de 1,12 m de alto.
   - **Pasamanos de la escalera:** en x 11,70 y 13,90, con 3 postes por lado.
3. Lo real:
   - Pórtico angosto y bajo, con columnas blancas cuadradas y una banda de madera oscura (foto del 106 de la entrada, archivo de LM, no publicado; CONFIRMADO).
   - **Las medidas son proporciones calibradas sobre la foto**, no un levantamiento. Según `fuente/portico.mjs`, al ajustar una cámara a los siete peldaños y a la losa (residuos < 0,5 px), la distancia entre ejes dio de 2,10 a 2,16 m, y «se toma 2,20 m». El 2,20 es un valor adoptado.
   - La regla del proyecto lo deja fijo: «columnas en x 11,70 y 13,90 (2,20 m entre ejes), columna trasera en 11,46, capitel a 2,40 m, viga, zapatas y cinco cabios» (`.claude/CLAUDE.md` de edificio-106).
4. Fachada SE, en x 10,9 a 14,7, delante de la puerta principal.
5. Mecanismo: ninguno.

### 4.26 Letreros «106»

**a) Letrero de la entrada**

1. En `modelo/entrada.glb`:
   - el panel: «106 sign grey», de 1,64 × 0,14 m y de 0,49 a 2,79 m de alto, sobre una base de 1,30 × 0,54 × 0,18 m;
   - la franja: «106 sign blue», de 1,66 × 0,52 m arriba (de 2,27 a 2,79), en la cara que mira al SE;
   - las letras, como pequeñas piezas planas de «Fresh cream trim» (de 1,74 a 2,60 m; los dígitos «106», de 2,33 a 2,60).
2. Es **1** letrero, en x 21,67 a 23,32 y z 16,06 a 16,24.
3. Lo real: es un tótem curvo gris con la parte de arriba azul que dice «106 / ISTHMUS», con el nombre de la escuela y un logotipo (fotos del 106 de la entrada, archivo de LM, no publicado; CONFIRMADO). El real es curvo y el modelo casi plano. Medidas: NO tomadas.
4. Junto a la rampa, entre el pie de la rampa y la acera SE.
5. Mecanismo: ninguno.

**b) Poste de señalización**

1. En `modelo/detalles.glb`:
   - el panel: «106 sign grey», de 1,02 × 0,12 m y de 0,65 a 3,20 m de alto, sobre una base de 0,76 × 0,48;
   - la franja: «106 sign blue», de 1,04 × 0,66 m (de 2,54 a 3,20), en la cara que mira al NE;
   - las letras, en «Fresh cream trim».
2. Es **1**, en x 44,34 a 44,48 y z −2,31 a −1,28.
3. Lo real: en una foto del 106 del testero NE (archivo de LM, no publicado) se ve un tótem gris y azul con flechas, más hacia la calle (CONFIRMADO que existe). Su posición es inferida: el retiro de 25,05 m hasta el bordillo lateral no está medido (notas de modelado de LM, no publicadas).
4. Jardín NE, junto a la calle lateral.
5. Mecanismo: ninguno.

### 4.27 Condensadoras de aire acondicionado («cajas de ventilación» en el repo)

1. En `modelo/detalles.glb`:
   - la caja: «Fresh cream trim», de 0,91 × 0,62 × 0,44 m (de 0,09 a 0,71 m de alto), con 108 triángulos;
   - el hueco del ventilador: «Dark ventilation recess», de 0,50 × 0,50 m, en el frente, corrido 0,16 m del centro de la caja hacia −x;
   - la rejilla redonda: «Galvanized guardrail», 5 anillos concéntricos de 0,48, 0,42, 0,32, 0,22 y 0,14 m;
   - la celosía («Weathered blue-grey louvre», familia «Condenser side grille»), de 0,15 × 0,36 m: pese a su nombre, está en el frente de la caja, junto al hueco del ventilador, centrada a +0,325 m del centro (en la unidad de x −15,66, las dos en z 12,11 a 12,13);
   - el cubretubos vertical: «Fresh cream trim», de 0,29 × 1,71 × 0,43 m (de 0,38 a 2,10 m).
2. Son **15 unidades**, con 15 cubretubos:
   - 4 en la SE (x −20,96 a −14,75, z 11,67 a 12,11);
   - 7 en la NO (x −8,95, 4,25, 6,35, 8,05, 9,65, 16,24 y 17,54);
   - 4 en la NE (x 22,92 a 23,36; z −9,36, −3,95, −0,65 y 0,75).
3. Lo real: hay condensadoras de aire acondicionado tipo split al pie del muro, con el logotipo de la marca visible, en varias fotos del 106 (archivo de LM, no publicado; CONFIRMADO). **Su número y su posición reales no coinciden con certeza.** En las fotos de la fachada SE y de la NO se ven más unidades, y de varios tamaños, que en el modelo. El repo las llama «cajas de ventilación» (`fuente/arbustos.mjs`). Por dónde entra el aire en las unidades reales no está documentado; como principio general del aparato, entra por el serpentín de aletas y sale por el ventilador.
4. Al pie de las caras SE, NO y NE.
5. Mecanismo: **un ventilador que gira detrás de la rejilla redonda.** Que existe es CONFIRMADO, porque las fotos muestran condensadoras; el ventilador no está modelado. Las tuberías de refrigerante suben por el cubretubos.

### 4.28 Gabinete de servicio

1. «Utility cabinet enamel», en `modelo/detalles.glb`:
   - un cuerpo de 1,54 × 1,70 × 1,10 m (de 0,03 a 1,73 m);
   - una tapa de 1,66 × 0,07 × 1,16 m (de 1,72 a 1,79 m);
   - **17 aletas verticales** de 2 a 3 cm × 1,26 m, una cada 7,5 cm, en la cara NO.
2. Es **1**, en x 0,87 a 2,53 y z −13,29 a −12,12.
3. Lo real: es un gabinete verde grande con aletas en un costado (fotos del 106 de la fachada NO, archivo de LM, no publicado; CONFIRMADO). Por su forma, con aletas de radiador, parece un transformador tipo pedestal, pero **es mi lectura de la foto y NO está confirmado.** Medidas: NO tomadas.
4. Delante de la fachada NO, cerca del centro.
5. Mecanismo: puertas con cerradura, probables. NO confirmado y no modelado.

### 4.29 Difusor o luminaria interior

1. «V014 subdued interior diffuser», en `modelo/detalles.glb`.
2. Son **3 piezas** de 1,20 × 0,04 × 0,12 m:
   - en x −10,10 a −8,90 y 16,40 a 17,60, a 7,27 m;
   - en x 5,10 a 6,30, a 10,92 m;
   - todas en z 10,04 a 10,16, detrás del vidrio SE.
3. Lo real: es un SUPUESTO. Las luminarias se pusieron cerca del techo y con poca emisión, sin inventar mobiliario ni distribución de cuartos (notas de modelado de LM, no publicadas). No hay fotos de esas luminarias en concreto.
4. En el interior, junto a la fachada SE, pisos 2 y 3.
5. Mecanismo: ninguno (son luces).

### 4.30 Volúmenes interiores

1. En `modelo/arquitectura.glb`:
   - «V014 neutral interior plaster 0», «… 1», «… 2» y «… 3»: 60 piezas en total, dentro de x ±19,61 y z ±8,36, de 0,65 a 11,01 m;
   - y «Unlit interior walls».
2. Son cajas de fondo detrás de las ventanas.
3. Lo real: SUPUESTO. Son volúmenes aproximados para la respuesta de luz del exterior, sin valor de levantamiento (notas de modelado de LM, no publicadas). El sitio de edificio-106 dice que los cuartos son una suposición y no los rotula. El interior real tiene una escalera que no está modelada (notas de modelado de LM, no publicadas); dónde está no se ha confirmado.
4. En el interior.
5. Mecanismo: ninguno.

### 4.31 Entorno inmediato (en `modelo/sitio.glb` y `modelo/detalles.glb`)

| Elemento | Material y GLB | Cantidad y medida | Lo real |
|---|---|---|---|
| Poste de luz de la esquina | «Galvanized guardrail» (`modelo/sitio.glb`), con la luminaria en «Painted soffits in shade» y la base en «Concrete paving — Poly Haven CC0» | 1 poste de 0,08 a 11,62 m, con un brazo hasta x 48,62. Base de 0,55 × 0,56 × 0,55 m en x 45,3 a 45,9, z 16,1 a 16,7. Luminaria de 0,69 × 0,13 × 0,28 a 11,48 a 11,61 m | «el poste real de la esquina del 106» (`docs/HISTORIA.md`); se ve en una foto del 106 de 2024 (archivo de LM, no publicado; CONFIRMADO). Su altura: NO medida |
| Muro curvo blanco | «Fresh cream trim» (`modelo/sitio.glb`), 2 piezas de 324 triángulos | 8,80 m de largo (z 2,00 a 10,80), 1,31 m de flecha en x (34,76 a 36,07) y 1,33 m de alto | muro curvo blanco con letrero y otro más corto cerca de la mitad del testero que da a la calle, en una foto del 106 del testero NE (CONFIRMADO) |
| Soporte de bicicletas | «Galvanized guardrail» (`modelo/detalles.glb`) | 4,04 × 0,80 m y 0,86 m de alto (x 37,18 a 38,02, z 4,38 a 8,42). 2 marcos y 2 × 22 barrotes, uno cada 0,167 m | se ve en una foto del 106 del testero NE (CONFIRMADO). Medidas: NO tomadas |
| Aceras | «Concrete paving — Poly Haven CC0» (`modelo/sitio.glb`) | SE: z 16,77 a 18,63 (1,86 m de ancho). NO: z −15,88 a −14,12. Más los caminos a las puertas | se ven en las fotos |
| Bordillo amarillo | «Worn yellow kerb» (`modelo/sitio.glb`) | 8 piezas de 0,21 m | CONFIRMADO en fotos del 106 de la entrada y del testero NE |
| Franja oscura junto a la escalera SO | «Dark ventilation recess» entre bordillos «V013 aged access concrete» (`modelo/sitio.glb`) | 0,22 × 4,70 m (x −24,86 a −24,64, z 12,15 a 16,85) | posible canaleta; NO confirmada |

### 4.32 Visto en fotos y NO modelado

- Los cables y conductos oscuros delgados sobre las fachadas.
- Unas cajas o rejillas pequeñas en el muro del piso 3, entre las ventanas, en la fachada SE. No sé qué son.
- Las piezas que sobresalen del techo, vistas desde la fachada NO.
- Las persianas interiores detrás del vidrio.
- La escalera interior.
- Los setos, palmas y plantas, que son vegetación (en `modelo/vegetacion.glb` de edificio-106, fuera de la copia de D.I.Visor).

## 5. Mecanismos móviles

| Elemento | Mecanismo posible | Estado |
|---|---|---|
| Lamas de celosía (§4.13) | lamas que giran sobre su eje largo, con varilla o manivela | **NO confirmado.** Hay paños con lamas en las fotos, pero no se sabe si giran |
| Hojas de las ventanas (§4.12) | corredizas, proyectantes o fijas | **NO confirmado** |
| Persianas interiores | lamas que suben y bajan | visto en fotos (mi lectura); **NO confirmado** |
| Puerta principal de vidrio (§4.21 a) | dos hojas batientes o pivotantes, tiradores, cerradura | los tiradores están modelados; **el tipo de giro NO está confirmado** |
| Puertas pardas de servicio y la SO (§4.21 b, c) | bisagras y cerradura; una o dos hojas | existen (CONFIRMADO); **el mecanismo NO está confirmado** (una foto sugiere una sola hoja) |
| Condensadoras (§4.27) | ventilador que gira detrás de la rejilla | **CONFIRMADO** que son condensadoras de aire acondicionado (fotos); el ventilador no está modelado |
| Gabinete verde (§4.28) | puertas con cerradura | **NO confirmado** |
| Gabletes y bloques calados (§4.8, §4.18) | ninguno (aberturas fijas) | CONFIRMADO que son aberturas; si tienen malla, no se sabe |
| Poste de luz (§4.31) | luminaria | CONFIRMADO que hay poste |

## 6. Fotos reales del 106

Todas son del archivo de LM y no se publican; se citan como «foto del 106 (archivo de LM, no publicado)». Ninguna tiene hora de captura, así que no sirven para validar el sol.

- **Exterior, serie de 14 fotos de 2026:**
  - la entrada (pórtico, escalera, rampa, letrero, bloques calados a la izquierda);
  - la fachada SE, tramo SO (puerta parda con su escalera, condensadoras);
  - el testero NE y el jardín (gablete de ventilación, faja del ático, poste de señalización, muro curvo, soporte de bicicletas);
  - la esquina NE y NO;
  - la fachada NO completa (galería, puertas pardas, tubos del centro, piezas sobre el techo);
  - detalles de la NO, con el gabinete verde y las condensadoras;
  - el testero SO y la galería (pilares, rejillas, escaleras, puerta parda).
- **Exterior, otras fotos:** una de 2024 con la rampa y el poste de luz de la esquina, y un detalle del letrero, la rampa y las barandas.
- **En el repo público:** `fuente/verificacion/entrada/comparativa-entrada.png` de edificio-106 tiene un recorte de la foto de la entrada junto al modelo, antes y después.
- **Vista aérea:** la escala de la planta salió de una vista de satélite de Google Maps (§1).

## 7. Las mayores incertidumbres

1. **La escala de todo el modelo** (±12 %): la planta de 45,5 × 23 m salió de una vista de satélite. Ninguna medida es un levantamiento.
2. **El nivel del piso de la planta baja:** la losa del modelo está a 0,65 m, pero el rellano de la entrada y la rampa están a 1,12 y la galería a 1,28. Esto afecta las puertas, los antepechos y el zócalo.
3. **Las ventanas de los pisos 2 y 3 son inferidas.** Su número coincide con las fotos de la fachada SE de arriba (14), pero el tipo de hoja y si abren no se saben.
4. **Las celosías:** no se sabe si son de vidrio o de aluminio, si están por fuera o por dentro, en qué ventanas exactas, ni si giran.
5. **Las tejas:** el número (~48.000) es el del modelo, no el real. El tamaño y el material de la teja no están medidos.
6. **La pendiente real del techo y de las mediaguas** (~18° en el modelo) y la altura de la cumbrera (15,6 a 15,7 m; Open Buildings da cerca de 1 m menos).
7. **Las ménsulas:** el modelo no dice si cargan; el perfil no está medido.
8. **Los tubos verticales** (¿bajantes o servicios?) y la falta de canalones.
9. **Las condensadoras:** el modelo tiene 15; las fotos muestran más, y de varios tamaños.
10. **El interior:** no hay ninguna medida en metros, y la escalera interior no está modelada.
11. **Las puertas:** el modelo tiene 5 vanos de puerta; el número de hojas está en duda; la puerta NO arranca a 0,70 m pero su escalera llega a 1,28.
12. **La cimentación y el espacio bajo el piso:** los bloques calados lo sugieren, pero no hay confirmación.
