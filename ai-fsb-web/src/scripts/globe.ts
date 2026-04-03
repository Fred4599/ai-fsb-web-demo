import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function initGlobe() {
  const container = document.getElementById("webgl-globe-container");
  if (!container) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / Math.max(container.clientHeight, 1), 0.1, 1000);

  camera.position.z = 3.6;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  const coreGeometry = new THREE.SphereGeometry(1, 64, 64);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x020617,
    transparent: true,
    opacity: 0.98,
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  globeGroup.add(core);

  const geometry = new THREE.IcosahedronGeometry(1.015, 8);
  const edges = new THREE.EdgesGeometry(geometry);
  const wireMaterial = new THREE.LineBasicMaterial({
    color: 0x818cf8,
    transparent: true,
    opacity: 0.25,
  });
  const wire = new THREE.LineSegments(edges, wireMaterial);
  globeGroup.add(wire);

  const pointsMaterial = new THREE.PointsMaterial({
    color: 0x22d3ee,
    size: 0.018,
    transparent: true,
    opacity: 0.8,
  });
  const points = new THREE.Points(geometry, pointsMaterial);
  globeGroup.add(points);

  const atmGeometry = new THREE.SphereGeometry(1.15, 32, 32);
  const atmMaterial = new THREE.MeshBasicMaterial({
    color: 0x4f46e5,
    transparent: true,
    opacity: 0.04,
    side: THREE.BackSide,
  });
  const atmosphere = new THREE.Mesh(atmGeometry, atmMaterial);
  scene.add(atmosphere);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.2;

  const labels = document.querySelectorAll(".floating-label");
  const startTime = Date.now();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    const elapsed = (Date.now() - startTime) / 1000;

    labels.forEach((label) => {
      const offset = parseFloat(label.getAttribute("data-offset") || "0");
      const y = Math.sin(elapsed * 1.5 + offset) * 8;
      (label as HTMLElement).style.transform = `translateY(${y}px)`;
    });

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
