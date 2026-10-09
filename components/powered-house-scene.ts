/**
 * Low-poly house that "gains electricity" as `setProgress` moves 0 → 1.
 * Loaded on demand by <PoweredHouse />; nothing here runs on the server.
 *
 * Timeline (progress p):
 *   0.00–0.20  service drop draws from the pole to the house
 *   0.20–0.40  conduit and panel energize
 *   0.40–0.60  rooms light up one window at a time
 *   0.60–0.80  EV charger and car come online
 *   0.80–1.00  path and landscape lights, full night
 */
import * as THREE from "three";

export type HouseStory = {
  setProgress(p: number): void;
  resize(width: number, height: number): void;
  dispose(): void;
};

const C = {
  duskSky: new THREE.Color("#5b6678"),
  nightSky: new THREE.Color("#121a16"),
  grass: "#2f3b2c",
  stucco: "#e9dfcc",
  trim: "#f6f1e7",
  roof: "#33433b",
  cedar: "#7a5234",
  concrete: "#55534d",
  pole: "#5a4632",
  metal: "#3a3d3b",
  wireOff: "#1b1d1c",
  warm: new THREE.Color("#ffc46b"),
  amber: new THREE.Color("#ffd27a"),
  charge: new THREE.Color("#6fe3a8"),
  glassOff: "#1d2430",
  tree: "#3e4a2f",
  trunk: "#4a3a2a",
  hill: "#27322a",
  car: "#b8c4c9",
};

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};
const span = (p: number, start: number, length: number) =>
  ease((p - start) / length);

export function createHouseStory(
  canvas: HTMLCanvasElement,
  { reducedMotion }: { reducedMotion: boolean },
): HouseStory {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = C.duskSky.clone();
  scene.fog = new THREE.Fog(C.duskSky.clone(), 22, 55);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);
  const lookAt = new THREE.Vector3();

  const std = (color: string, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, flatShading: true, ...extra });
  const mesh = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    [x, y, z]: [number, number, number],
    { cast = true, receive = true } = {},
  ) => {
    const m = new THREE.Mesh(geometry, material);
    m.position.set(x, y, z);
    m.castShadow = cast;
    m.receiveShadow = receive;
    scene.add(m);
    return m;
  };

  /* ---------- Lighting ---------- */
  const hemi = new THREE.HemisphereLight("#9fb0c8", "#2a2418", 1.1);
  scene.add(hemi);
  const moon = new THREE.DirectionalLight("#b9c8e6", 1.1);
  moon.position.set(-14, 18, 10);
  moon.castShadow = true;
  moon.shadow.mapSize.set(1024, 1024);
  Object.assign(moon.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14 });
  scene.add(moon);

  /* ---------- Ground, hills, trees ---------- */
  const ground = mesh(new THREE.CircleGeometry(40, 48), std(C.grass), [0, 0, 0], {
    cast: false,
  });
  ground.rotation.x = -Math.PI / 2;
  for (const [x, z, s] of [
    [-22, -26, 14],
    [6, -32, 18],
    [28, -22, 12],
  ] as const) {
    const hill = mesh(new THREE.IcosahedronGeometry(s, 1), std(C.hill), [x, -s * 0.72, z], {
      cast: false,
    });
    hill.scale.y = 0.55;
  }
  const tree = (x: number, z: number, s: number) => {
    mesh(new THREE.CylinderGeometry(0.16 * s, 0.22 * s, 1.6 * s, 6), std(C.trunk), [x, 0.8 * s, z]);
    const crown = mesh(new THREE.IcosahedronGeometry(1.3 * s, 0), std(C.tree), [x, 2.1 * s, z]);
    crown.scale.set(1.4, 0.75, 1.2);
  };
  tree(-5.5, -4, 1.3);
  tree(9.5, -2, 1.1);
  tree(-11, -6, 1.6);
  tree(8.5, 6.5, 0.9);

  /* ---------- House ---------- */
  const stucco = std(C.stucco);
  const trim = std(C.trim);
  const roofMat = std(C.roof);
  mesh(new THREE.BoxGeometry(6, 5, 4.5), stucco, [0, 2.5, 0]);
  mesh(new THREE.BoxGeometry(3.2, 2.6, 4.2), stucco, [4.6, 1.3, 0.15]);

  const gable = (width: number, rise: number, depth: number) => {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(width / 2, 0);
    shape.lineTo(0, rise);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
    g.translate(0, 0, -depth / 2);
    return g;
  };
  mesh(gable(6.8, 2.2, 5.1), roofMat, [0, 5, 0]);
  const garageRoof = mesh(gable(4.6, 1.1, 3.6), roofMat, [4.6, 2.6, 0.15]);
  garageRoof.rotation.y = Math.PI / 2;

  mesh(new THREE.BoxGeometry(1.1, 2.1, 0.12), std(C.cedar), [0, 1.05, 2.28]);
  mesh(new THREE.BoxGeometry(2.6, 2, 0.1), trim, [4.6, 1, 2.27]);
  mesh(new THREE.BoxGeometry(2.2, 0.12, 2.2), std(C.concrete), [0, 0.06, 3.4], { cast: false });

  // Windows: glass planes whose emissive intensity rises in sequence.
  const windows: THREE.MeshStandardMaterial[] = [];
  const addWindow = (x: number, y: number, z: number, rotY = 0) => {
    const frame = mesh(new THREE.BoxGeometry(1.24, 1.34, 0.08), trim, [x, y, z], { cast: false });
    frame.rotation.y = rotY;
    const glass = new THREE.MeshStandardMaterial({
      color: C.glassOff,
      emissive: C.warm,
      emissiveIntensity: 0,
      roughness: 0.3,
    });
    const pane = mesh(new THREE.PlaneGeometry(1.04, 1.14), glass, [x, y, z], { cast: false });
    pane.rotation.y = rotY;
    pane.translateZ(0.05);
    windows.push(glass);
  };
  // Order is the order rooms light up.
  addWindow(-1.8, 1.4, 2.25);
  addWindow(1.8, 1.4, 2.25);
  addWindow(-3.0, 1.4, 0, -Math.PI / 2);
  addWindow(-1.8, 3.7, 2.25);
  addWindow(0, 3.7, 2.25);
  addWindow(1.8, 3.7, 2.25);
  addWindow(-3.0, 3.7, 0, -Math.PI / 2);

  const roomGlow = [
    new THREE.PointLight(C.warm, 0, 9, 1.6),
    new THREE.PointLight(C.warm, 0, 9, 1.6),
  ];
  roomGlow[0].position.set(0, 1.5, 3.4);
  roomGlow[1].position.set(0, 3.8, 3.2);
  roomGlow.forEach((l) => scene.add(l));

  /* ---------- Utility pole, service drop, panel ---------- */
  const poleMat = std(C.pole);
  const poleBase = new THREE.Vector3(-9, 0, 3.5);
  mesh(new THREE.CylinderGeometry(0.13, 0.17, 8.4, 7), poleMat, [poleBase.x, 4.2, poleBase.z]);
  mesh(new THREE.BoxGeometry(2.4, 0.14, 0.14), poleMat, [poleBase.x, 7.7, poleBase.z]);
  mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.8, 10), std(C.metal), [poleBase.x + 0.32, 6.7, poleBase.z]);

  const weatherhead = new THREE.Vector3(-3.06, 5.6, 1.1);
  mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 6), std(C.metal), [weatherhead.x, weatherhead.y - 0.3, weatherhead.z]);

  const wireCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(poleBase.x + 0.3, 7.25, poleBase.z),
    new THREE.Vector3((poleBase.x + weatherhead.x) / 2, 5.4, (poleBase.z + weatherhead.z) / 2),
    weatherhead,
  );
  const WIRE_SEGMENTS = 80;
  const WIRE_RADIAL = 6;
  const wireGeo = new THREE.TubeGeometry(wireCurve, WIRE_SEGMENTS, 0.03, WIRE_RADIAL);
  const wireMat = new THREE.MeshStandardMaterial({
    color: C.wireOff,
    emissive: C.amber,
    emissiveIntensity: 0,
  });
  mesh(wireGeo, wireMat, [0, 0, 0], { receive: false });
  wireGeo.setDrawRange(0, 0);

  const spark = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 12, 8),
    new THREE.MeshBasicMaterial({ color: C.amber }),
  );
  const sparkLight = new THREE.PointLight(C.amber, 0, 5, 2);
  spark.add(sparkLight);
  scene.add(spark);

  const conduitMat = new THREE.MeshStandardMaterial({
    color: C.metal,
    emissive: C.amber,
    emissiveIntensity: 0,
  });
  mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.3, 6), conduitMat, [-3.06, 3.35, 1.1]);
  const panel = mesh(new THREE.BoxGeometry(0.16, 0.9, 0.6), std(C.metal), [-3.1, 1.3, 1.1]);
  const panelLampMat = new THREE.MeshStandardMaterial({
    color: "#222",
    emissive: C.charge,
    emissiveIntensity: 0,
  });
  const panelLamp = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.08), panelLampMat);
  panelLamp.rotation.y = -Math.PI / 2;
  panelLamp.position.set(-0.09, 0.28, 0);
  panel.add(panelLamp);
  const panelLight = new THREE.PointLight(C.charge, 0, 3, 2);
  panelLight.position.set(-3.5, 1.5, 1.1);
  scene.add(panelLight);

  /* ---------- Driveway, EV charger, car ---------- */
  mesh(new THREE.BoxGeometry(3, 0.06, 6), std(C.concrete), [4.6, 0.03, 5.2], { cast: false });
  mesh(new THREE.BoxGeometry(0.32, 1.25, 0.24), std(C.metal), [2.8, 0.62, 3.1]);
  const chargerMat = new THREE.MeshStandardMaterial({
    color: "#222",
    emissive: C.charge,
    emissiveIntensity: 0,
  });
  mesh(new THREE.PlaneGeometry(0.18, 0.5), chargerMat, [2.8, 0.8, 3.23], { cast: false });
  const chargerLight = new THREE.PointLight(C.charge, 0, 4, 2);
  chargerLight.position.set(2.9, 0.9, 3.6);
  scene.add(chargerLight);

  const carMat = std(C.car, { metalness: 0.35, roughness: 0.45 });
  const car = new THREE.Group();
  const carBody = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.62, 3.8), carMat);
  carBody.position.y = 0.55;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.52, 2), carMat);
  cabin.position.set(0, 1.1, -0.15);
  car.add(carBody, cabin);
  for (const [x, z] of [
    [-0.85, 1.2],
    [0.85, 1.2],
    [-0.85, -1.2],
    [0.85, -1.2],
  ]) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 12), std("#1c1c1c"));
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.34, z);
    car.add(wheel);
  }
  car.traverse((o) => {
    o.castShadow = true;
  });
  car.position.set(4.7, 0, 5.4);
  scene.add(car);
  const portMat = new THREE.MeshBasicMaterial({ color: "#2a2f2c" });
  const port = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.16), portMat);
  port.rotation.y = -Math.PI / 2;
  port.position.set(-0.91, 0.65, 1.3);
  car.add(port);
  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.8, 0.75, 3.2),
    new THREE.Vector3(3.1, 0.12, 4.4),
    new THREE.Vector3(3.6, 0.5, 6.5),
    new THREE.Vector3(3.79, 0.65, 6.7),
  ]);
  const cableMat = new THREE.MeshStandardMaterial({
    color: "#151515",
    emissive: C.charge,
    emissiveIntensity: 0,
  });
  const cable = mesh(new THREE.TubeGeometry(cableCurve, 30, 0.035, 5), cableMat, [0, 0, 0]);
  cable.visible = false;

  /* ---------- Path and landscape lights ---------- */
  const pathLampMat = new THREE.MeshStandardMaterial({
    color: "#2a2a28",
    emissive: C.warm,
    emissiveIntensity: 0,
  });
  for (const [x, z] of [
    [-1, 4.6],
    [1, 4.6],
    [-1, 6.6],
    [1, 6.6],
  ]) {
    mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.55, 6), std(C.metal), [x, 0.27, z]);
    mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.14, 8), pathLampMat, [x, 0.6, z], { cast: false });
  }
  mesh(new THREE.BoxGeometry(1.2, 0.04, 4.2), std(C.concrete), [0, 0.02, 5.6], { cast: false });
  const pathLight = new THREE.PointLight(C.warm, 0, 7, 1.8);
  pathLight.position.set(0, 1, 5.6);
  scene.add(pathLight);
  const porch = new THREE.PointLight(C.warm, 0, 6, 2);
  porch.position.set(0, 2.5, 2.9);
  scene.add(porch);

  /* ---------- Stars ---------- */
  const starPositions = new Float32Array(240 * 3);
  for (let i = 0; i < 240; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * 0.45 * Math.PI;
    const r = 60;
    starPositions.set(
      [r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi) * 0.6 + 8, -Math.abs(r * Math.sin(phi) * Math.sin(theta)) - 10],
      i * 3,
    );
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({
    color: "#f2ede3",
    size: 0.22,
    transparent: true,
    opacity: 0,
    fog: false,
  });
  scene.add(new THREE.Points(starGeo, starMat));

  /* ---------- Camera path ---------- */
  const camFrom = new THREE.Vector3(-17, 9.5, 24);
  const camTo = new THREE.Vector3(-10.5, 6, 21);
  const lookFrom = new THREE.Vector3(-3.4, 3.4, 1);
  const lookTo = new THREE.Vector3(1.4, 2.6, 2);

  const sky = new THREE.Color();
  let width = 1;
  let height = 1;

  function apply(p: number) {
    // 1. Service drop
    const wireT = span(p, 0.02, 0.16);
    const rings = Math.floor(wireT * WIRE_SEGMENTS);
    wireGeo.setDrawRange(0, rings * WIRE_RADIAL * 6);
    wireMat.emissiveIntensity = 0.5 * span(p, 0.15, 0.06);
    spark.visible = wireT > 0 && wireT < 1;
    spark.position.copy(wireCurve.getPoint(Math.min(wireT, 0.999)));
    sparkLight.intensity = spark.visible ? 2.5 : 0;

    // 2. Conduit and panel
    conduitMat.emissiveIntensity = 0.7 * span(p, 0.2, 0.08) * (1 - 0.6 * span(p, 0.32, 0.08));
    const panelT = span(p, 0.27, 0.1);
    panelLampMat.emissiveIntensity = 2.2 * panelT;
    panelLight.intensity = 1.6 * panelT;

    // 3. Rooms, one window at a time
    windows.forEach((w, i) => {
      w.emissiveIntensity = 1.5 * span(p, 0.4 + i * 0.024, 0.05);
    });
    roomGlow[0].intensity = 7 * span(p, 0.4, 0.1);
    roomGlow[1].intensity = 6 * span(p, 0.47, 0.1);

    // 4. EV charging
    const evT = span(p, 0.6, 0.12);
    chargerMat.emissiveIntensity = 2.4 * evT;
    chargerLight.intensity = 2.2 * evT;
    cable.visible = evT > 0.05;
    cableMat.emissiveIntensity = 0.8 * span(p, 0.66, 0.08);
    portMat.color.set(evT > 0.6 ? C.charge : "#2a2f2c");

    // 5. Outside, full night
    const outT = span(p, 0.8, 0.12);
    pathLampMat.emissiveIntensity = 2.4 * outT;
    pathLight.intensity = 6 * outT;
    porch.intensity = 5 * span(p, 0.84, 0.1);

    const night = span(p, 0, 0.95);
    sky.copy(C.duskSky).lerp(C.nightSky, night);
    (scene.background as THREE.Color).copy(sky);
    scene.fog!.color.copy(sky);
    hemi.intensity = 1.1 - 0.82 * night;
    moon.intensity = 1.1 - 0.6 * night;
    starMat.opacity = 0.9 * span(p, 0.45, 0.5);

    // Camera eases in; reduced motion holds a single framing.
    const camT = reducedMotion ? 0.6 : ease(p);
    camera.position.lerpVectors(camFrom, camTo, camT);
    lookAt.lerpVectors(lookFrom, lookTo, camT);
    camera.lookAt(lookAt);

    renderer.render(scene, camera);
  }

  let current = 0;
  return {
    setProgress(p) {
      current = clamp(p);
      apply(current);
    },
    resize(w, h) {
      if (w === width && h === height) return;
      width = Math.max(1, w);
      height = Math.max(1, h);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Widen the lens as the stage gets narrower so the whole lot stays in frame.
      camera.fov = THREE.MathUtils.clamp(52 - camera.aspect * 14, 32, 46);
      camera.updateProjectionMatrix();
      apply(current);
    },
    dispose() {
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
          o.geometry.dispose();
          const m = o.material as THREE.Material | THREE.Material[];
          (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose());
        }
      });
      renderer.dispose();
    },
  };
}
