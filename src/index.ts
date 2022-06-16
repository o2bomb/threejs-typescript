import { GUI } from "dat.gui";
import * as THREE from "three";
import { BoxGeometry, Mesh, MeshNormalMaterial } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import "./style.css";
import { Timer } from "./Timer";

window.addEventListener("load", init, false);

function init() {
  // document.addEventListener("mousemove", handleMouseMove, false);
  window.addEventListener(
    "resize",
    () => {
      const WIDTH = window.innerWidth;
      const HEIGHT = window.innerHeight;

      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    },
    false
  );

  // STATS
  const stats = Stats();
  document.body.appendChild(stats.dom);

  // CONTROLS
  const controls = {
    camera: {
      zPosition: 5,
      fieldOfView: 60,
    },
  };
  const knobs = new GUI();
  const cameraFolder = knobs.addFolder("Camera");
  cameraFolder
    .add(controls.camera, "zPosition", 1, 10)
    .name("Z Position")
    .onChange((v) => {
      camera.position.z = v;
    });
  cameraFolder
    .add(controls.camera, "fieldOfView", 10, 300)
    .name("Field of view")
    .onChange((v) => {
      camera.fov = v;
      camera.updateProjectionMatrix();
    });
  cameraFolder.open();

  // SCENE
  const scene = new THREE.Scene();

  // CAMERA
  const aspectRatio = window.innerWidth / window.innerHeight;
  const nearPlane = 0.1;
  const farPlane = 1000;
  const camera = new THREE.PerspectiveCamera(
    controls.camera.fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.z = controls.camera.zPosition;

  // RENDERER
  const canvas = document.querySelector<HTMLCanvasElement>("#c");
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // CONTROLS
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;

  // OBJECTS
  const cubeGeometry = new BoxGeometry(1, 1);
  const cubeMaterial = new MeshNormalMaterial();
  const cube = new Mesh(cubeGeometry, cubeMaterial);
  scene.add(cube);

  const clock = new Timer();
  const animate = () => {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    cube.rotation.x += 1 * delta;
    cube.rotation.y += 1 * delta;
    cube.rotation.z += 1 * delta;

    stats.update();
    orbitControls.update();
    clock.update();

    renderer.render(scene, camera);
  };
  animate();
}
