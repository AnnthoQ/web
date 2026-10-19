<h1 align="center">Cryostasis · Landing 3D con cubo de vidrio</h1>

<p align="center">
Landing page estática para un servicio ficticio de <i>cold storage</i>, con un <b>cubo de vidrio 3D en Three.js</b><br>
que refracta y desenfoca el título en tiempo real y rota al hacer scroll. Sin paso de build.
</p>

<p align="center"><a href="https://annthoq.github.io/web/"><b>Ver demo</b></a></p>

---

## Objetivo técnico

Reproducir un efecto de vidrio físicamente creíble (refracción, grosor, dispersión cromática) sobre contenido tipográfico de la propia página, manteniendo un sitio 100 % estático, ligero y desplegable en cualquier CDN.

## Demo

<!-- Sustituye por una captura o GIF real: docs/demo.gif -->
<p align="center"><img src="docs/demo.gif" width="720" alt="Cubo de vidrio refractando el título"></p>

## Tech Stack

| Área | Tecnología |
|---|---|
| 3D | [Three.js](https://threejs.org) v0.170.0 — `MeshPhysicalMaterial` (transmisión, IOR, dispersión) |
| Módulos | ES Modules nativos + `importmap` (CDN, sin bundler) |
| Estilos | CSS3 responsive con hero fijo (*sticky*) |
| Hosting | GitHub Pages / Netlify / Vercel |

## Características

- **Cubo de vidrio** con `roughness`, `thickness`, `ior` y `dispersion` ajustables.
- **Fondo refractado** generado como plano 3D (grid, cruces, sombra y título) para que el vidrio lo distorsione.
- **Environment map** con luces de color para reflejos realistas.
- **Rotación ligada al scroll** dentro de un hero fijo.
- **Layout responsive:** el cubo se reposiciona y escala según el viewport.
- **QR decorativo** generado por código para la tarjeta *Proof of Custody*.

## Instalación y ejecución local

Los módulos ES no cargan con `file://`, así que hay que servir la carpeta:

```bash
git clone https://github.com/AnnthoQ/web.git
cd web
python -m http.server 5173      # o: npx serve .
```

Abre `http://localhost:5173`.

## Arquitectura

```
web/
├── index.html          # Marcado + import map de Three.js
├── css/
│   └── styles.css      # Estilos y responsive
└── js/
    ├── main.js         # Punto de entrada: renderer, layout, scroll y loop
    ├── glass-cube.js   # Geometría y material de vidrio del cubo
    ├── backdrop.js     # Plano de fondo que el cubo refracta
    ├── environment.js  # Environment map con luces de color para los reflejos
    └── qr.js           # QR decorativo de la tarjeta "Proof of Custody"
```

### Ajustes rápidos

| Qué cambiar | Dónde |
|---|---|
| Desenfoque / refracción del título | `roughness`, `thickness`, `ior`, `dispersion` en `js/glass-cube.js` |
| Velocidad de rotación con scroll | `onScroll()` en `js/main.js` |
| Tamaño y posición del cubo | `cy` y `side` en `layout()` de `js/main.js` |
| Duración del hero fijo | `.hero-wrap { height }` en `css/styles.css` |

## Licencia y contacto

Distribuido bajo licencia [MIT](LICENSE). Hecho por [@AnnthoQ](https://github.com/AnnthoQ).
