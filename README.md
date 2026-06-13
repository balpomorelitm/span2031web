# SPAN2031 Spain Field Trip 2027

Sitio web estatico para organizar y comunicar el viaje de estudio de SPAN2031 a Espana en 2027.

## Archivos principales

- `index.html`: version de profesorado. Incluye un enlace visible a `estudiantes.html`.
- `estudiantes.html`: version de estudiantes. No incluye enlace de vuelta a la version de profesorado.
- `css/styles.css`: estilos compartidos, layout responsive, mapas, tarjetas, tablas, timeline, formularios visuales y modo impresion.
- `js/app.js`: datos del viaje e inicializacion de mapas, tarjetas, itinerarios, checklist, cuenta atras, lightbox, timeline y calculadoras.
- `favicon.svg`: favicon con un avion y el mundo.
- `logosp.webp` y `SMLCLogo_edited.webp`: logos del footer.

## Navegacion

La pagina de profesorado contiene una barra superior con secciones internas y un enlace a la version de estudiantes. La pagina de estudiantes solo muestra su propia navegacion interna: resumen, mapa y ruta, itinerario, clima, que llevar, seguridad, evaluacion, tareas, costes y emergencias.

Ambas paginas comparten la cabecera del viaje, la cuenta atras hasta el 26 de mayo de 2027 y el footer institucional.

## Funcionalidades para profesorado

- Resumen operativo con duracion, numero previsto de estudiantes y perfil linguistico.
- Mapa animado con Leaflet para la ruta Madrid, Granada, Cordoba, Madrid, Alcala de Henares y Toledo.
- Controles del mapa: anterior, reproducir/pausar, siguiente, ruta completa y selector de ciudad.
- Tarjeta lateral del mapa con imagen, fecha, actividad, etiquetas y credito de la foto.
- Galeria de ruta visual con imagenes abiertas desde Wikimedia Commons y creditos enlazados.
- Lightbox para ampliar fotografias.
- Itinerario dia a dia con filtros por ciudad.
- Alternancia entre lista y linea de tiempo para revisar el calendario.
- Secciones de diseno academico, logistica, presupuesto, seguridad, convivencia y administracion.
- Banner de formulario de inscripcion con URL provisional de Google Forms.
- Checklist docente agrupada por agencias, administracion, estudiantes y curso.
- Progreso automatico de checklist guardado en `localStorage` del navegador.
- Boton `Print / PDF` y estilos de impresion para generar una version imprimible de la pagina activa.

## Funcionalidades para estudiantes

- Resumen del viaje con datos clave, ruta, fechas, nivel y coste orientativo de comidas.
- Accesos rapidos a mapa y ruta, itinerario, que llevar y seguridad.
- Banner de inscripcion de interes con URL provisional de Google Forms.
- Mapa estatico-interactivo de la ruta con trayectos en tren/AVE y excursiones de dia.
- Galeria visual compartida con creditos y lightbox.
- Itinerario completo con lista desplegable y linea de tiempo.
- Tabla de clima orientativo para Madrid, Granada, Cordoba, Toledo y Alcala de Henares.
- Lista de documentos, kit diario y material de trabajo.
- Normas de seguridad: telefono con datos, movimiento en grupo y cuidado de pertenencias.
- Explicacion de evaluacion y tareas de campo.
- Conversor HKD/EUR con tipo de cambio editable.
- Calculadora de presupuesto diario y extras en EUR/HKD.
- Seccion de emergencias con 112, otros numeros utiles y guion basico para llamar.

## Datos editables

La mayor parte del contenido dinamico esta en `js/app.js`:

- `photos`: imagenes, textos alternativos, creditos y enlaces.
- `mapSteps`: pasos del mapa animado de profesorado.
- `dayItems`: itinerario diario usado por ambas paginas.
- `checklistGroups`: checklist interna de profesorado.
- `cityCoords` y `routeSegments`: coordenadas y trayectos del mapa.

Para actualizar el formulario real, cambia las URLs `https://forms.gle/ACTUALIZAR-URL` en `index.html` y `estudiantes.html`.

## Dependencias externas

El sitio carga estas dependencias desde CDN:

- Google Fonts: Inter y Playfair Display.
- Leaflet CSS y JS.
- Carto/OpenStreetMap para teselas del mapa.
- Imagenes remotas de Wikimedia Commons.

Si se abre sin conexion, el contenido HTML sigue visible, pero los mapas, fuentes externas e imagenes remotas pueden no cargarse.

## Uso local

Es una web estatica. Puede abrirse directamente en el navegador desde `index.html` o `estudiantes.html`. Para probarla con un servidor local:

```powershell
python -m http.server 8000
```

Luego abre:

- `http://localhost:8000/index.html`
- `http://localhost:8000/estudiantes.html`

## Notas de repositorio

Los documentos Word de planificacion estan excluidos del repositorio. Mantener en Git solo los archivos necesarios para publicar la web y los assets finales.
