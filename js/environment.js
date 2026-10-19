import * as THREE from 'three';

/**
 * Estudio virtual con tiras de luz de color. Se usa como environment map
 * para que el vidrio tenga reflejos y bordes con tonos arcoíris.
 */
function buildEnvironmentScene() {
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(
    new THREE.BoxGeometry(24, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0x5a5a5a, side: THREE.BackSide })
  ));

  const strip = (hex, intensity, w, h, pos) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(intensity), side: THREE.DoubleSide })
    );
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    env.add(m);
  };

  strip(0xffffff, 7, 10, 3, [0, 10, 3]);
  strip(0xffffff, 5, 8, 8, [0, 0, 11]);
  strip(0x2a6bff, 6, 2.2, 12, [-10, 0, 3]);
  strip(0x00d0ff, 4, 1.4, 9, [-6, 2, 9]);
  strip(0xff3da8, 5, 2.2, 12, [10, 1, -1]);
  strip(0xffa630, 5, 12, 1.6, [0, -10, 3]);
  strip(0x9b5cff, 4, 1.4, 9, [7, -3, 8]);
  return env;
}

export function createEnvironment(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const texture = pmrem.fromScene(buildEnvironmentScene(), 0.03).texture;
  pmrem.dispose();
  return texture;
}
