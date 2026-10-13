# Escenas de detalle (mecanismos) · especificación

Seis escenas procedimentales para `js/detalles.js`. Cada una exporta `{ objeto, actualizar(m, dt), camara: { pos, obj }, etiqueta, escala }` y se dibuja con `dibujarDetalle(geo, { enfasis, vidrio })` de `divisor.js` (línea negra sobre papel; lo resaltado va con `enfasis: true`). `m` es el control «Mecanismo», de 0 a 1.

Reglas comunes:

- Ejes locales de cada escena: y arriba, metros, origen en el centro de la escena salvo que se diga otra cosa. Nada de esto se coloca sobre el edificio.
- Las medidas citadas salen de `docs/INVENTARIO.md` (modelo, escala ±12 %); «§x» remite a sus secciones. Las marcadas **supuesto de dibujo** no tienen fuente y no se rotulan con cifra en pantalla.
- El texto en pantalla de cada escena es el de la lección (`contenido/lecciones.json`); aquí va además una frase corta para el rótulo del detalle. Tuteo, coma decimal, sin guiones como separadores.
- Ninguna escena muestra un mecanismo como confirmado en el 106 salvo el ventilador de la condensadora.

---

## 1. `celosia` · lección l13 · «Giro de las lamas»

**Qué enseña:** el paralelogramo articulado de una celosía de lamas operables. Principio general; en el 106 no se sabe si las lamas giran ni de qué son.

**Escala:** `1:5 · PRINCIPIO GENERAL`. **Cámara:** pos `[1,1, 0,55, 1,25]`, obj `[0, 0, 0]`.

**Piezas**

| Pieza | Geometría | Medida | Fuente |
|---|---|---|---|
| Jambas del panel (2) | caja | 0,04 × 0,74 × 0,09 m, en x ±0,53 | perfil 4 × 9 cm (§4.12); alto del panel 0,74 (§4.13) |
| Lamas (8) | placa | cuerda 0,095 m, grueso 0,006 m, largo 1,02 m | 9 a 10 cm de alto y ancho de paño de 1,02 m (§4.13); grueso: supuesto de dibujo |
| Ejes de giro | uno por lama, a lo largo de x, en el centro de la cuerda | paso vertical 0,093 m, de y −0,326 a +0,326 | paso 9,3 cm (§4.13) |
| Brazos (8) | caja delgada fija a cada lama por dentro de la jamba izquierda (x −0,50) | 0,03 × 0,006 × 0,006 m, perpendicular a la lama | supuesto de dibujo |
| Varilla de accionamiento | caja vertical que une las puntas de los 8 brazos | 0,008 × 0,72 × 0,008 m | supuesto de dibujo |
| Palanca | caja en el extremo bajo de la varilla | 0,012 × 0,10 × 0,012 m | supuesto de dibujo |
| Vidrio de la ventana (fondo) | plano, `vidrio: true` | 1,08 × 0,74 m, 0,05 m detrás de las lamas | panel 5 cm por fuera del vidrio (§4.13) |

**Movimiento (m de 0 a 1):** ángulo de cada lama respecto a la horizontal θ = 80° · (1 − m). Con m = 0 las lamas quedan casi verticales y se solapan (cuerda 0,095 > paso 0,093: el cierre ocurre desde θ ≈ 78°). Con m = 1 quedan horizontales. Cada brazo gira con su lama; la punta del brazo i está en `pivote_i + 0,03 · (−sen θ, cos θ)` en el plano y–z, así que la varilla se traslada sin girar (eso es el paralelogramo). La varilla y la palanca se recolocan cada cuadro con la punta del brazo de abajo.

**Resaltar:** varilla, brazos y palanca (`enfasis`). Opcional: tres rayos paralelos de luz (líneas) que atraviesan el panel solo cuando θ < 78°.

**Rótulo:** «Principio general de una celosía de lamas operables. En el 106 no se sabe si las lamas giran.»

---

## 2. `teja` · lección l11 · «Recorrido del agua»

**Qué enseña:** canal y cobija, el solape entre filas y el camino del agua hasta el borde del alero.

**Escala:** `1:5 · TEJA DEL MODELO`. **Cámara:** pos `[1,2, 1,1, 1,4]`, obj `[0, 0, 0,2]`.

**Geometría base:** un tablero inclinado 17,8° (pendiente del techo principal, §2), bajando hacia +z. Medidas en planta del INVENTARIO convertidas a la pendiente (÷ cos 17,8° = 1,05): teja de 0,39 m en planta = 0,41 m en pendiente; avance de fila de 0,33 m en planta = 0,347 m; solape ≈ 0,063 m en pendiente.

| Pieza | Geometría | Medida | Fuente |
|---|---|---|---|
| Tablero | placa | 0,90 × 1,60 m en pendiente, grueso 0,02 | supuesto de dibujo (tamaño de la muestra) |
| Canales (3 columnas × 4 filas) | arco de cilindro abierto hacia arriba, 150°, extruido a lo largo de la pendiente | cuerda 0,235 m, flecha 0,06 m (supuesto de dibujo), largo 0,41 m, grueso 0,012 | ancho 23 a 24 cm, largo 39 cm en planta (§4.1) |
| Cobijas (2 columnas × 4 filas) | el mismo arco, abierto hacia abajo, centrado en la junta de dos canales | cuerda 0,135 m, flecha 0,04 m (supuesto de dibujo), largo 0,41 m | ancho 13 a 14 cm (§4.1) |
| Paso a lo ancho | canales cada 0,235 m en x (−0,235, 0, 0,235) | 0,235 m | 23,5 cm (§4.1) |
| Filas | cada 0,347 m en pendiente; cada fila se apoya sobre la de abajo | solape 0,063 m | 33 cm en planta, solape ~6 cm (§4.1) |
| Tabla de frente | caja en el borde bajo | 0,14 × 0,10 m, a lo ancho de la muestra | §2 |
| Cabio | caja bajo el tablero, perpendicular al borde | 0,07 × 0,11 m, largo 1,65 m en horizontal | §4.2 |

**Movimiento (m de 0 a 1):** cuatro gotas (esferas de Ø 0,015 m, `enfasis`) recorren un camino fijo parametrizado por m:
- 0 a 0,15: la gota cae sobre el lomo de una cobija de la fila más alta;
- 0,15 a 0,25: resbala por la cobija hacia el canal vecino;
- 0,25 a 0,85: baja por el fondo del canal, pasa por encima del solape a la fila de abajo (salto visible de 0,012 m, el grueso de la teja) tres veces;
- 0,85 a 1: sale por el borde y cae 0,5 m en vertical, delante de la tabla de frente.
Además, dibujar la polilínea completa del camino en trazo fino.

**Resaltar:** las cuatro franjas de solape (contorno del área de 0,063 m donde una fila se monta sobre la otra) y el camino del agua.

**Rótulo:** «Medidas de la teja del modelo, escala ±12 %. El material y el tamaño reales no están medidos.»

---

## 3. `alero` · lección l12 · «Altura del sol en el corte»

**Qué enseña:** cómo un voladizo fijo sombrea la ventana según el ángulo del sol medido en un corte perpendicular a la fachada (ángulo de perfil). No se ligan fechas ni horas: eso exigiría el cálculo solar del visor 106 y su verificación.

**Escala:** `1:25 · CORTE DEL PISO 1`. **Cámara:** pos `[3,2, 3,0, 4,2]`, obj `[0, 2,8, 0,6]`.

**Ejes de la escena:** z = 0 es la cara exterior del muro, +z hacia afuera; y es la cota real del modelo. La escena es una rebanada de 1,20 m de ancho en x (de −0,60 a 0,60), para que se lea como corte.

| Pieza | Geometría | Medida | Fuente |
|---|---|---|---|
| Muro | caja | z −0,30 a 0, y 0,65 a 4,60 (con el hueco de la ventana) | grueso 0,30 (§1, §4.4) |
| Vidrio del piso 1 | plano, `vidrio: true` | y 1,82 a 3,37, en z −0,095 | §4.12 |
| Marco | contorno de 0,04 × 0,09 | y 1,78 a 3,41 | §4.12 |
| Alféizar | caja | 0,05 de alto, 0,34 de fondo, en y 1,74 a 1,79 | §4.6; caja de `window sill` |
| Moldura | caja | 0,05 × 0,06, y 1,66 a 1,71 | §4.5 |
| Ménsula | prisma triangular (perfil en escuadra) | 0,26 de ancho, 0,82 de alto (y 3,02 a 3,84), vuelo 1,50 | §4.15 |
| Cabios (2 en la rebanada, en x ±0,325) | caja | 0,07 × 0,11, largo 1,65 en z, y 3,82 a 3,93 | §4.2 |
| Tablero | placa inclinada 17,9°, de y 3,80 a y 4,33 (sube 0,53 m en los 1,65 m que van de z 1,65 a z 0) | grueso 0,03 | §2 (la caja del modelo, de 3,80 a 4,48, incluye el grueso y el tramo sobre el muro) |
| Tabla de frente | caja | 0,14 de alto × 0,10, en z 1,55 a 1,65 | §2 |
| Faja contra el muro | caja | 0,27 × 0,03, y 4,27 a 4,54 | §4.3 |
| Tejas | rayado esquemático sobre el tablero | | |
| Borde de sombra | punto P = (z 1,65, y 3,734) | sofito del alero 1 | §1 (`docs/ciudad/espiga/kit-medidas.json` de edificio-106) |

**Movimiento (m de 0 a 1):** ángulo de perfil α = 5° + 85° · m. Dibujar 5 rayos paralelos (líneas) que bajan hacia el muro con ese ángulo; el rayo que pasa por P es el límite de la sombra. Cota de la sombra sobre el vidrio: y_s = 3,734 − tan α · 1,745 (1,745 = 1,65 de vuelo + 0,095 de retraso del vidrio). Hachurar con `enfasis` la parte del vidrio entre y_s (acotada a 1,82) y 3,37. Lectura en pantalla: «ángulo en el corte: NN°» y «vidrio en sombra: NN %», con `num()` y coma decimal.

**Comprobación:** α = 11,8° → la sombra toca el borde alto del vidrio; α = 47,6° → todo el vidrio en sombra. Son las cifras de la lección («unos 12°», «unos 48°»).

**Resaltar:** el alero completo (ménsula, cabios, tablero, tabla) con `enfasis` y el rayo límite.

**Rótulo:** «Ángulo de perfil medido en el corte. Geometría del modelo, escala ±12 %.»

---

## 4. `rampa` · lección l15 · «Subida por la rampa»

**Qué enseña:** que la rampa cambia altura por recorrido, con descanso y baranda, comparada con la escalera de 7 peldaños que salva el mismo desnivel.

**Escala:** `1:50 · ENTRADA SE`. **Cámara:** pos `[−2,0, 6,5, 13,0]`, obj `[4,5, 0,6, 1,0]`.

**Ejes de la escena:** coordenadas del modelo trasladadas: x_local = x − 15,60, z_local = z − 11,50, y real. El muro queda en z_local = 0 (dibujar un paño de muro de 8,0 × 1,8 m como referencia).

| Pieza | Geometría | Medida | Fuente |
|---|---|---|---|
| Tramo bajo | losa inclinada | x 0 a 5,90, z 1,42 a 2,74, sube de 0,16 a 0,64 | §4.24 |
| Descanso | losa plana | x 5,90 a 7,30, z 0 a 2,74, a 0,64 | §4.24 |
| Tramo alto | losa inclinada | x 5,90 a 0, z 0 a 1,32, sube de 0,64 a 1,12 | §4.24 |
| Porche de llegada | losa | x −0,70 a 0, a 1,12 | §4.24 |
| Postes | caja 0,04 × 0,04 | cada 0,98 m, 7 por lado y por tramo | §4.24 |
| Pasamanos | tubo Ø 0,054 continuo, siguiendo la pendiente y el giro | altura sobre la rampa: **supuesto de dibujo**, no rotular | Ø de `fuente/barandas.mjs` de edificio-106 (§4.24) |
| Travesaños (2) | tubo Ø 0,036 | **supuesto de dibujo** para la altura | §4.24 |
| Escalera de comparación | 7 peldaños de 2,30 m de ancho, contrahuella 0,137, huella 0,30, de 0,16 a 1,12 | junto al porche, en x −2,80 a −0,70 | §4.22 a |

**Movimiento (m de 0 a 1):** dos marcadores (cilindros de Ø 0,45 × 1,20 m, `enfasis`) parten juntos a cota 0,16. El de la rampa recorre tramo bajo, descanso y tramo alto por la línea central (camino de unos 14,6 m: 5,90 + 0,70 hasta el centro del descanso, 1,42 a lo ancho del descanso, 0,70 + 5,90 de vuelta); el de la escalera sube los 7 peldaños (unos 2,1 m en planta). Los dos llegan a 1,12 m cuando m = 1, cada uno con su recorrido. Lectura: «altura: N,NN m» y «recorrido: NN,N m» de cada marcador.

**Resaltar:** pasamanos y descanso.

**Rótulo:** «Pendiente de cada tramo en el modelo: 8,1 % (0,48 m en 5,90 m). Cotas inferidas y escala ±12 %: no se puede decir si cumple una norma.» La pendiente sale de 0,48 / 5,90 = 8,14 %; según qué se mida en el modelo da de 8,1 a 8,3 % (§4.24).

---

## 5. `condensadora` · lección l18 · «Giro del ventilador y ciclo»

**Qué enseña:** el único mecanismo confirmado del 106 (el ventilador) y, como principio general, el ciclo de refrigeración de una unidad exterior split.

**Escala:** `1:10 · UNIDAD DEL MODELO`. **Cámara:** pos `[1,5, 1,1, 1,7]`, obj `[0, 0,55, 0]`.

**Ejes:** el frente de la caja (cara de la rejilla) mira a +z; la caja se apoya en y 0,09.

| Pieza | Geometría | Medida | Fuente |
|---|---|---|---|
| Caja | caja, `vidrio: true` para ver dentro | 0,91 × 0,62 × 0,44 m, y 0,09 a 0,71 | §4.27 |
| Hueco del ventilador | círculo en el frente, corrido 0,16 m del centro hacia −x (a la izquierda vista de frente) | Ø 0,50 | §4.27 (posición como en el modelo) |
| Rejilla | 5 anillos concéntricos (toros finos) | Ø 0,48 · 0,42 · 0,32 · 0,22 · 0,14 | §4.27 |
| Ventilador axial | cubo Ø 0,08 + 3 aspas torcidas, Ø total 0,46, 0,05 detrás de la rejilla | número de aspas: **supuesto de dibujo** | existencia: foto (§4.27) |
| Motor del ventilador | cilindro Ø 0,10 × 0,08 detrás del cubo | supuesto de dibujo | general |
| Serpentín de aletas | placa en L en la cara trasera y el costado izquierdo, 0,05 de grueso, con 20 líneas verticales (aletas) y 3 tubos horizontales en zigzag | supuesto de dibujo | general (el modelo no tiene serpentín) |
| Celosía («Condenser side grille») | rectángulo en el FRENTE de la caja, junto al hueco del ventilador, centrado a +0,325 m del centro (al lado opuesto al hueco); pese al nombre de la familia, en el modelo no está en el costado | 0,15 × 0,36 | §4.27 |
| Compresor | cilindro vertical, en el cuarto izquierdo de la caja | Ø 0,18 × 0,30, supuesto de dibujo | general |
| Cubretubos | caja junto a la condensadora, contra el muro | 0,29 × 1,71 × 0,43, y 0,38 a 2,10 | §4.27 |
| Tuberías | dos tubos (Ø 0,02 y 0,01) del compresor y el serpentín al cubretubos, y hacia arriba | supuesto de dibujo | general |

**Movimiento (m de 0 a 1):**
- Ventilador: velocidad angular ω = m · 2π · 3 rad/s (velocidad de dibujo, no son las rpm reales; no rotular rpm).
- Ciclo: 12 puntos (`enfasis`) recorren el circuito cerrado con velocidad proporcional a m: compresor → serpentín (puntos llenos: gas caliente a alta presión) → salida del serpentín (puntos más chicos: líquido) → tubo fino hacia arriba por el cubretubos y fuera de cuadro → vuelve por el tubo grueso (puntos huecos: gas frío a baja presión) → compresor.
- Aire: 6 flechas que entran por el serpentín (trasera y costado) y salen por la rejilla redonda del ventilador, con largo proporcional a m. Que el aire entre por el serpentín es principio general del aparato; en el 106 no está documentado.

**Resaltar:** ventilador y rejilla (confirmados) con `enfasis`; el resto en línea normal. Etiquetas pequeñas: «ventilador (confirmado en foto)», «serpentín», «compresor», «rejilla del frente», «a la unidad interior».

**Rótulo:** «Confirmado en foto: que son condensadoras y tienen ventilador. Compresor, serpentín y ciclo: principio general del aparato.»

---

## 6. `atico` · lección l19 · «Calor en el ático»

**Qué enseña:** la salida del aire caliente del ático por los dos gabletes altos y la ventilación cruzada entre ellos. Principio general; en el 106 no está documentado por dónde entra el aire.

**Escala:** `1:200 · CUBIERTA`. **Cámara:** pos `[34, 26, 34]`, obj `[0, 13, 0]`.

**Ejes:** los del visor (x a lo largo, z a lo ancho). Se dibuja solo de la cota 11,60 hacia arriba, con un corte longitudinal en z = 0 (quitar la mitad +z) para ver dentro.

| Pieza | Geometría | Medida | Fuente |
|---|---|---|---|
| Remate del muro | contorno a 11,60 | 45,50 × 23,00 | §1 |
| Faldones largos | planos de x ±14,35 (cumbrera) a ±24,40, z 0 a ±13,10, del canto 11,148 a la cumbrera 15,643 | pendiente del modelo 17,8° | §1, §2 |
| Faldones de los extremos | trapecios del canto del alero (x ±24,40, y 11,148, z ±13,10) hasta la base del gablete (x ±14,35, y 14,61, z ±3,10); los faldones largos se recortan por las limas que unen esas esquinas | subida de unos 0,34 por metro | §2 (comprobación: 15,643 − 3,10 × 0,32 ≈ 14,65, cerca de 14,61) |
| Cumbrera | línea de x −14,35 a 14,35 a 15,64 | 28,7 m | §1 |
| Gablete (2) | triángulo vertical en x ±14,35, base 6,20 (z −3,10 a 3,10) a 14,61, vértice a 15,60; hueco con `enfasis` | 3,07 m² cada uno | §4.18 |
| Montante y travesaño | caja 0,08 × 0,08 (14,61 a 15,53) y caja de 3,40 a 14,92 a 14,99 | | §4.18 |
| Faja de arcilla | banda a 11,78 a 12,04, 0,38 hacia adentro del muro | | §4.17 |

**Movimiento (m de 0 a 1):**
- 0 a 0,6, tiro térmico: 40 partículas (puntos) nacen bajo los faldones, suben con velocidad proporcional a m hacia la cumbrera y salen por los dos gabletes. Ninguna cifra de temperatura en pantalla (no hay datos del 106).
- 0,6 a 1, se suma viento: las partículas que salen por el gablete NE (+x) se desvían; aparece una corriente que entra por el gablete NE y sale por el SO, con largo de flecha creciente. No nombrar una dirección de viento real.
- El gablete SO se dibuja con trazo discontinuo: está extrapolado, no fotografiado.

**Resaltar:** los dos huecos de gablete y el camino de las partículas.

**Rótulo:** «Gablete NE en foto; SO extrapolado. El modelo no tiene ventilación de cumbrera. Por dónde entra el aire nuevo no está documentado.»

---

## Lo que se descartó como escena

- **Linterna de cumbrera:** el modelo no tiene ventilación de cumbrera; la escena del ático usa los gabletes, que sí están en foto.
- **Cabio + ménsula como estructura cargada:** el modelo no dice si las ménsulas cargan; la escena `alero` enseña sombra, no carga.
- **Hojas de ventana, puertas, persianas interiores:** ningún mecanismo confirmado ni descrito con medidas suficientes.
