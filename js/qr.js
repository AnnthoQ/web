/**
 * Genera un código QR decorativo (no escaneable) dentro de un <svg viewBox="0 0 25 25">.
 */
export function renderQR(svg, seedValue = 0x4f9a) {
  if (!svg) return;
  const N = 25;
  let seed = seedValue;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

  const isFinder = (x, y) => (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
  const finderOn = (x, y) => {
    const fx = x >= N - 7 ? x - (N - 7) : x;
    const fy = y >= N - 7 ? y - (N - 7) : y;
    const edge = fx === 0 || fx === 6 || fy === 0 || fy === 6;
    const core = fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4;
    return edge || core;
  };
  const isSeparator = (x, y) =>
    x === 7 || y === 7 || (x === N - 8 && y < 8) || (y === N - 8 && x < 8);

  let d = '';
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const on = isFinder(x, y) ? finderOn(x, y) : isSeparator(x, y) ? false : rnd() > 0.52;
      if (on) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  svg.innerHTML = `<path d="${d}" fill="#0a0a0a"/>`;
}
