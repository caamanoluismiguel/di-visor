# D.I.Visor (antes DIVISOR) · piloto de diseño industrial sobre el Edificio 106

Piloto **aparte** del visor del Edificio 106 (decisión de LM, 13 oct 2026). Dibuja el 106 en línea (estilo plano de patente) y lo explica desde el diseño industrial, de la pieza más sencilla al mecanismo más complejo. Si demuestra valor, más adelante se decide si se integra a `edificio-106`. Hasta entonces **no se toca el repo `~/Documents/Web/edificio-106`** (solo lectura de `origin/main`).

Nombre: D.I.Visor = visor de diseño industrial (LM, 13 oct 2026; antes DIVISOR), por `~/Downloads/DI_visor.html`, la referencia de estilo junto con `~/Downloads/gemini-code-1791925607361.html`.

## Mapa

- `index.html`, `css/divisor.css`, `js/divisor.js` (motor: carga, sistemas, despiece, corte, resaltado, lecciones), `js/detalles.js` (escenas de mecanismos en detalle).
- `contenido/lecciones.json`: todo el texto (edificio, sistemas, piezas, lecciones). Sale del panel (`~/projects/divisor-privado/PANEL.md`) y pasa por el verificador.
- `modelo/edificio_piezas.glb`: piezas separadas por familia, exportadas de `~/Documents/Web/isthmus-reconstruction/delivery/v016/Isthmus_v016_rampa_contexto_luz.blend` con `docs/exportar_blend.py` (el .blend no se guarda). Sin contexto, vegetación, sitio ni tejas (las tejas se dibujan como rayado de canales, paso de dibujo 0,5 m).
- `modelo/entrada.glb` y los demás: copias byte a byte de `edificio-106` main (`modelo/ORIGEN.txt`). La entrada se toma de main porque el pórtico, la rampa y las barandas corregidas **no están en ningún .blend**; por eso se filtran del .blend la rampa y su unión.
- `docs/FAMILIAS.md`: claves de familia del visor. `docs/INVENTARIO.md`: versión pública del inventario (misma numeración §, cifras corregidas por la verificación, sin rutas privadas); es la que citan los campos `fuente`. El inventario completo, el panel y la verificación (con rutas privadas y notas internas de LM) viven fuera del repo, en `~/projects/divisor-privado/`, y nunca se suben.

## Probar

`python3 -m http.server 4610` en la raíz y abrir `http://localhost:4610/` (`?prueba` expone `window.__divisor`). Probar siempre en 1440 px y en 390 px.

## Reglas (heredadas del 106)

- Credibilidad primero. Cada ficha lleva certeza: foto, medido (escala ±12 %, sale de satélite), modelo o general. Ningún mecanismo está confirmado salvo el ventilador de las condensadoras.
- No afirmar año de construcción, uso original ni autor del 106. No publicar el uso de los cuartos de la planta baja (nota interna de LM).
- Texto: tuteo, sin guiones como separadores, sin ritmo de IA, coma decimal. Interfaz sin degradados.
- Verificador (`~/Documents/Web/edificio-106/.claude/agents/verificador.md`) antes de mostrar contenido nuevo a terceros.
- Nada se publica ni se sube a un remoto sin que LM lo diga.
