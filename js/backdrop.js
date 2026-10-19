import * as THREE from 'three';

// Posiciones relativas (0–1) de las cruces "+" del fondo
const PLUSES = [
  [.065, .16], [.652, .1], [.428, .2], [.162, .43], [.268, .49], [.654, .35], [.825, .59],
  [.948, .47], [.708, .61], [.919, .68], [.016, .72], [.228, .78], [.718, .82], [.07, .84],
  [.28, .92], [.652, .95], [.041, .97], [.94, .23], [.36, .65]
];

/**
 * Plano que ocupa todo el viewport detrás del cubo. Su textura es un canvas 2D
 * con el grid, las cruces, la sombra y el TÍTULO, para que el vidrio lo refracte
 * y desenfoque (transmission solo "ve" objetos de la escena, no el HTML).
 */
export function createBackdrop({ container, title }) {
  const words = [...title.querySelectorAll('.w')];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
  );

  function draw(W, H, cx, cy, side) {
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    const c = ctx;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);

    c.fillStyle = '#f4f4f2';
    c.fillRect(0, 0, W, H);

    // grid tenue
    c.strokeStyle = 'rgba(0,0,0,0.035)';
    c.lineWidth = 1;
    c.beginPath();
    for (let x = 0; x <= W; x += 28) { c.moveTo(x + .5, 0); c.lineTo(x + .5, H); }
    for (let y = 0; y <= H; y += 28) { c.moveTo(0, y + .5); c.lineTo(W, y + .5); }
    c.stroke();

    // cruces "+"
    c.strokeStyle = 'rgba(0,0,0,0.22)';
    c.beginPath();
    for (const [px, py] of PLUSES) {
      const x = Math.round(px * W) + .5, y = Math.round(py * H) + .5;
      c.moveTo(x - 7, y); c.lineTo(x + 7, y);
      c.moveTo(x, y - 7); c.lineTo(x, y + 7);
    }
    c.stroke();

    // sombra suave bajo el cubo
    c.save();
    c.translate(cx, cy + side);
    c.scale(1, 0.3);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, side * 0.95);
    g.addColorStop(0, 'rgba(0,0,0,0.20)');
    g.addColorStop(0.5, 'rgba(0,0,0,0.08)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g;
    c.beginPath(); c.arc(0, 0, side * 0.95, 0, Math.PI * 2); c.fill();
    c.restore();

    // título: se copia la posición exacta de cada palabra del <h1>
    const hr = container.getBoundingClientRect();
    const cs = getComputedStyle(title);
    c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if ('letterSpacing' in c) c.letterSpacing = cs.letterSpacing;
    c.textBaseline = 'alphabetic';
    c.fillStyle = '#0a0a0a';
    for (const w of words) {
      const r = w.getBoundingClientRect();
      const m = c.measureText(w.textContent);
      c.fillText(w.textContent, r.left - hr.left, r.top - hr.top + m.fontBoundingBoxAscent);
    }
    texture.needsUpdate = true;
  }

  return { mesh, draw };
}
