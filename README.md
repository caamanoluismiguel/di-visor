# D.I.Visor · Edificio 106 en línea

D.I.Visor (visor de diseño industrial) es un piloto sobre el Edificio 106 de Isthmus (Ciudad del Saber, Panamá). Dibuja el edificio en línea, como un plano de patente, y lo explica pieza por pieza: de la teja y el cabio hasta la condensadora y la ventilación del ático.

En vivo: https://caamanoluismiguel.github.io/di-visor/

Es un piloto aparte del [visor de sol y clima del Edificio 106](https://github.com/caamanoluismiguel/edificio-106). Si demuestra valor para la enseñanza, se evaluará integrarlo.

## Qué hace

- 24 lecciones en cinco niveles, de piezas simples al edificio como sistema.
- Siete sistemas que se pueden aislar (base, losas y cartelas, muros, ventanas y lamas, cubierta, accesos, instalaciones).
- Despiece, corte longitudinal, transversal y en planta, y piezas que se tocan para ver su ficha.
- Seis mecanismos en detalle con un control propio: teja canal y cobija, alero y sombra, celosía de lamas, rampa contra escalera, condensadora y ático.

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
