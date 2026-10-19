# Cryostasis — Cold Storage Landing

Landing page estática con un cubo de vidrio 3D (Three.js) que se superpone al título, lo refracta y desenfoca, y rota al hacer scroll.

## Estructura

```
├── index.html          # Marcado + import map de Three.js
├── css/
│   └── styles.css      # Estilos y responsive
└── js/
    ├── main.js         # Punto de entrada: renderer, layout, scroll y loop
    ├── glass-cube.js   # Geometría y material de vidrio del cubo
    ├── backdrop.js     # Plano de fondo (grid, cruces, sombra y título) que el cubo refracta
    ├── environment.js  # Environment map con luces de color para los reflejos
    └── qr.js           # QR decorativo de la tarjeta "Proof of Custody"
```

Three.js (v0.170.0) se carga desde CDN mediante el `importmap` de `index.html`; no hay paso de build.

## Ejecutar en local

Los módulos ES no cargan con `file://`, así que hay que servir la carpeta:

```bash
python -m http.server 5173
```

o

```bash
npx serve .
```

y abrir `http://localhost:5173`.

## Ajustes rápidos

- **Desenfoque / refracción del título**: `roughness`, `thickness`, `ior` y `dispersion` en `js/glass-cube.js`.
- **Velocidad de rotación con scroll**: `onScroll()` en `js/main.js`.
- **Tamaño y posición del cubo**: `cy` y `side` en `layout()` de `js/main.js`.
- **Duración del hero fijo**: `.hero-wrap { height }` en `css/styles.css`.

## Despliegue

Es un sitio 100 % estático: funciona tal cual en GitHub Pages, Netlify o Vercel.
