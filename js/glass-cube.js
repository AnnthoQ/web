import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/** Cubo de vidrio translúcido con dispersión cromática e iridiscencia. */
export function createGlassCube() {
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 1,
    thickness: 0.35,
    roughness: 0.32,          // desenfoque del título visto a través del cubo
    ior: 1.3,
    dispersion: 5,            // separación cromática (arcoíris)
    iridescence: 0.4,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [200, 600],
    clearcoat: 0.5,
    clearcoatRoughness: 0.05,
    specularIntensity: 1,
    envMapIntensity: 0.7
  });

  const cube = new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 8, 0.06), material);
  cube.rotation.order = 'YXZ';
  return cube;
}
