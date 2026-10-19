import * as THREE from 'three';
import { renderQR } from './qr.js';
import { createEnvironment } from './environment.js';
import { createBackdrop } from './backdrop.js';
import { createGlassCube } from './glass-cube.js';

renderQR(document.getElementById('qr'));

const hero = document.getElementById('hero');
const heroWrap = document.querySelector('.hero-wrap');
const title = document.getElementById('title');
const canvas = document.getElementById('gl');
const driftEl = document.getElementById('drift');

const CAM_Z = 20;
const PLANE_Z = -5;                              // plano con el título, detrás del cubo
const BASE = { x: -0.55, y: 0.72, z: 0.18 };     // inclinación inicial del cubo

/* ---------- Renderer / escena ---------- */
// Si WebGL falla, el módulo se detiene y el <h1> HTML queda visible (no se añade .gl-ready)
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.environment = createEnvironment(renderer);

const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
camera.position.z = CAM_Z;

const backdrop = createBackdrop({ container: hero, title });
backdrop.mesh.position.z = PLANE_Z;
scene.add(backdrop.mesh);

const cube = createGlassCube();
scene.add(cube);

/* ---------- Layout ---------- */
let baseY = 0;
function layout() {
  const W = hero.clientWidth;
  const H = hero.clientHeight;
  renderer.setSize(W, H, false);
  camera.aspect = W / H;
  camera.updateProjectionMatrix();

  const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const unit = (2 * CAM_Z * t) / H;              // unidades de mundo por píxel en z=0
  const planeH = 2 * (CAM_Z - PLANE_Z) * t;
  backdrop.mesh.scale.set(planeH * (W / H), planeH, 1);

  const mobile = W < 760;
  const cx = W * 0.5;
  const cy = H * (mobile ? 0.44 : 0.53);
  const side = Math.min(H * 0.38, W * (mobile ? 0.46 : 0.3));

  baseY = -(cy - H / 2) * unit;
  cube.position.set((cx - W / 2) * unit, baseY, 0);
  cube.scale.setScalar(side * unit);

  backdrop.draw(W, H, cx, cy, side);
}

/* ---------- Scroll + ratón ---------- */
const target = { x: 0, y: 0 }, current = { x: 0, y: 0 };
const mouse = { x: 0, y: 0 }, mouseS = { x: 0, y: 0 };

function onScroll() {
  const p = window.scrollY / window.innerHeight;
  target.x = p * Math.PI * 0.85;
  target.y = p * Math.PI * 1.35;
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('pointermove', (e) => {
  mouse.x = e.clientX / window.innerWidth - 0.5;
  mouse.y = e.clientY / window.innerHeight - 0.5;
});

let resizeT;
window.addEventListener('resize', () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(layout, 80);
});

// Solo renderiza mientras el hero está en pantalla
let visible = true;
new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(heroWrap);

/* ---------- Loop ---------- */
const clock = new THREE.Clock();
function tick() {
  requestAnimationFrame(tick);
  if (!visible) return;
  const t = clock.getElapsedTime();
  current.x += (target.x - current.x) * 0.075;
  current.y += (target.y - current.y) * 0.075;
  mouseS.x += (mouse.x - mouseS.x) * 0.05;
  mouseS.y += (mouse.y - mouseS.y) * 0.05;

  cube.rotation.x = BASE.x + current.x + mouseS.y * 0.25 + Math.sin(t * 0.6) * 0.035;
  cube.rotation.y = BASE.y + current.y + mouseS.x * 0.35 + Math.sin(t * 0.4) * 0.05;
  cube.rotation.z = BASE.z + Math.sin(t * 0.5) * 0.02;
  cube.position.y = baseY + Math.sin(t * 0.9) * 0.05;

  if (driftEl) driftEl.textContent = (Math.abs(target.y - current.y) * 0.1 + 0.001).toFixed(3);
  renderer.render(scene, camera);
}

/* ---------- Inicio: esperar la fuente pixel antes de dibujar el título ---------- */
async function init() {
  try {
    await document.fonts.load('400 64px "Press Start 2P"');
    await document.fonts.ready;
  } catch (_) { /* se dibuja con la fuente de respaldo */ }
  layout();
  onScroll();
  current.x = target.x;
  current.y = target.y;
  document.documentElement.classList.add('gl-ready');
  tick();
}

init();
