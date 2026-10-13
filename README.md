# D.I.Visor · Edificio 106 en línea

D.I.Visor (visor de diseño industrial) es un piloto sobre el Edificio 106 de Isthmus (Ciudad del Saber, Panamá). Dibuja el edificio en línea, como un plano de patente, y lo explica pieza por pieza: de la teja y el cabio hasta la condensadora y la ventilación del ático.

En vivo: https://caamanoluismiguel.github.io/di-visor/

Este piloto queda congelado: solo recibe correcciones, y su contenido pasa al [visor del Edificio 106](https://caamanoluismiguel.github.io/edificio-106/), que es el modelo vigente.

## Qué hace

- 24 lecciones en cinco niveles, de piezas simples al edificio como sistema.
- Siete sistemas que se pueden aislar (base, losas y cartelas, muros, ventanas y lamas, cubierta, accesos, instalaciones).
- Despiece, corte longitudinal, transversal y en planta, y piezas que se tocan para ver su ficha.
- Seis mecanismos en detalle con un control propio: teja canal y cobija, alero y sombra, celosía de lamas, rampa contra escalera, condensadora y ático.

## Enlaces con estado

La dirección guarda lo que se está viendo y se actualiza sola; «Copiar enlace» la copia tal cual.

- `?leccion=l12` abre una lección (`l01` a `l24`, como en `contenido/lecciones.json`).
- `?sistema=cubierta` aísla un sistema (`base`, `estructura`, `muros`, `ventanas`, `cubierta`, `accesos`, `servicios`).
- `?pieza=exposed_timber_rafter` elige una familia por su clave (el nombre de `docs/FAMILIAS.md` en minúsculas, sin acentos y con guiones bajos). También valen los nombres de las partes del visor del 106: `techo`, `alero`, `mensula`, `vano`, `modulo`, `principal`, `lateral`, `zocalo`.
- `&corte=z:0.5` corta por un plano (`x` transversal, `y` planta, `z` longitudinal) a esa fracción del edificio, de 0 a 1.
- `&desp=0.4` separa los sistemas; `&mec=0.6` mueve el mecanismo de una lección con detalle.

Ejemplo: `?leccion=l07&corte=x:0.4&desp=0.3`. También se leen desde el hash (`#leccion=l12&meca=0,6`) y con coma decimal.

## Qué tan cierto es

Cada ficha dice de dónde sale: confirmado en foto, medido en el modelo, supuesto del modelo o principio general del tipo de pieza.

- El modelo no es un levantamiento. Su escala sale de una vista de satélite (±12 %).
- Ningún mecanismo está confirmado en el 106, salvo el ventilador de las condensadoras.
- Las cifras están en `docs/INVENTARIO.md` y el contenido pasó por un verificador de veracidad antes de publicarse.

## Cómo está hecho

- `modelo/edificio_piezas.glb`: piezas separadas por familia, exportadas del modelo de Blender del 106 con `docs/exportar_blend.py`.
- `modelo/entrada.glb`: copia del visor del 106, con el pórtico, la rampa y las barandas corregidas.
- `js/divisor.js` es el motor, `js/detalles.js` tiene los mecanismos y `contenido/lecciones.json` todo el texto.
- Sin compilación. Para probarlo en local: `python3 -m http.server` y abrir `http://localhost:8000/`.
