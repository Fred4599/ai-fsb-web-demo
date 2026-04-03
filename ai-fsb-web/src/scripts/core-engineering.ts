import Matter, { Body } from "matter-js";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function initCoreEngineeringSection() {
  const section = document.getElementById("solutions");
  if (!section) return;

  let hasStarted = false;

  function initThreeCard() {
    const container3D = document.getElementById("three-container");
    if (!container3D || container3D.dataset.initialized === "true") return;
    container3D.dataset.initialized = "true";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container3D.clientWidth / Math.max(container3D.clientHeight, 1),
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container3D.clientWidth, container3D.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container3D.innerHTML = "";
    container3D.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.6, 1);

    const solidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.2,
      transmission: 0.9,
      thickness: 0.5,
      ior: 1.5,
      transparent: true,
      opacity: 0.8,
    });

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    const solidMesh = new THREE.Mesh(geometry, solidMaterial);
    const wireMesh = new THREE.Mesh(geometry, wireMaterial);
    wireMesh.scale.set(1.01, 1.01, 1.01);

    const group = new THREE.Group();
    group.add(solidMesh);
    group.add(wireMesh);
    scene.add(group);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(2, 2, 2);
    scene.add(mainLight);

    const accentLight = new THREE.PointLight(0x818cf8, 2, 10);
    accentLight.position.set(-2, -1, 2);
    scene.add(accentLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    camera.position.z = 6;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    container3D.addEventListener("mousemove", (event) => {
      const rect = container3D.getBoundingClientRect();
      const halfX = rect.width / 2;
      const halfY = rect.height / 2;
      mouseX = event.clientX - rect.left - halfX;
      mouseY = event.clientY - rect.top - halfY;
    });

    function animate3D() {
      requestAnimationFrame(animate3D);

      group.rotation.x += 0.003;
      group.rotation.y += 0.004;

      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;

      group.rotation.y += 0.05 * (targetX - group.rotation.y);
      group.rotation.x += 0.05 * (targetY - group.rotation.x);

      renderer.render(scene, camera);
    }

    animate3D();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });

    resizeObserver.observe(container3D);
  }

  function initMatterCard() {
    const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;
    const container = document.getElementById("physics-container");
    if (!container || container.dataset.initialized === "true") return;
    container.dataset.initialized = "true";

    const tags = container.querySelectorAll(".physics-tag");
    const width = container.clientWidth;
    const height = container.clientHeight;

    const engine = Engine.create();
    engine.gravity.y = 0.55;

    const ground = Bodies.rectangle(width / 2, height + 20, width, 40, { isStatic: true });
    const leftWall = Bodies.rectangle(-20, height / 2, 40, height * 2, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 20, height / 2, 40, height * 2, { isStatic: true });
    const ceiling = Bodies.rectangle(width / 2, -350, width * 2, 40, { isStatic: true });

    Composite.add(engine.world, [ground, leftWall, rightWall, ceiling]);

    const bodies: { elem: HTMLElement; body: Body }[] = [];
    tags.forEach((tag, i) => {
      const el = tag as HTMLElement;
      const x = width * 0.2 + Math.random() * (width * 0.6);
      const y = -40 - i * 55;

      const body = Bodies.rectangle(x, y, el.offsetWidth, el.offsetHeight, {
        restitution: 0.45,
        friction: 0.08,
        density: 0.002,
        chamfer: { radius: el.offsetHeight / 2 },
      });

      bodies.push({ elem: el, body });
      Composite.add(engine.world, body);
    });

    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Composite.add(engine.world, mouseConstraint);

    const runner = Runner.create();
    Runner.run(runner, engine);

    function updatePhysics() {
      bodies.forEach((item) => {
        item.elem.style.transform = `translate(${item.body.position.x - item.elem.offsetWidth / 2}px, ${item.body.position.y - item.elem.offsetHeight / 2}px) rotate(${item.body.angle}rad)`;
      });
      requestAnimationFrame(updatePhysics);
    }

    updatePhysics();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 20 });
        Body.setPosition(leftWall, { x: -20, y: newHeight / 2 });
        Body.setPosition(rightWall, { x: newWidth + 20, y: newHeight / 2 });
      }
    });

    resizeObserver.observe(container);
  }

  function animateGaugeCard() {
    const ring = document.getElementById("health-ring");
    if (!ring) return;
    requestAnimationFrame(() => {
      ring.style.transition = "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)";
      ring.style.strokeDashoffset = "0";
    });
  }

  function startSectionAnimations() {
    if (hasStarted) return;
    hasStarted = true;

    initThreeCard();
    initMatterCard();
    animateGaugeCard();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startSectionAnimations();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(section);
}
