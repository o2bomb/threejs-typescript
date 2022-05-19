import { GUI } from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import "./style.css";

window.addEventListener("load", init, false);

const BLACKHOLE_RADIUS = 6000;

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
      zPosition: 40000,
      fieldOfView: 60,
      topDownView: false,
      orbitControls: false,
    },
    blackhole: {
      scale: 1,
    },
    planet: {
      scale: 1,
      orbitFrequency: 2,
      orbitDistance: 10000,
    },
  };
  const knobs = new GUI();
  const cameraFolder = knobs.addFolder("Camera");
  cameraFolder
    .add(controls.camera, "zPosition", 0, 100000)
    .name("Distance from blackhole")
    .onChange((v) => {
      if (controls.camera.topDownView) {
        camera.position.y = v;
      } else {
        camera.position.z = v;
      }
    });
  cameraFolder
    .add(controls.camera, "fieldOfView", 10, 300)
    .name("Field of view")
    .onChange((v) => {
      camera.fov = v;
      camera.updateProjectionMatrix();
    });
  cameraFolder
    .add(controls.camera, "topDownView")
    .name("Enable top down view")
    .onChange((v) => {
      if (v) {
        camera.position.y = controls.camera.zPosition;
        camera.position.z = 0;
      } else {
        camera.position.y = 0;
        camera.position.z = controls.camera.zPosition;
      }
    });
  // cameraFolder
  //   .add(controls.camera, "orbitControls")
  //   .name("Enable orbit controls")
  //   .onChange((v) => {
  //     orbitControls.enabled = v;
  //     if (!v) {
  //       camera.setRotation;
  //     }
  //   });
  cameraFolder.open();
  const blackholeFolder = knobs.addFolder("Black Hole");
  blackholeFolder
    .add(controls.blackhole, "scale", 0.1)
    .name("Scale")
    .onChange((v) => blackhole.scale.setScalar(v));
  blackholeFolder.open();
  const planetFolder = knobs.addFolder("Planet");
  planetFolder
    .add(controls.planet, "scale", 0.1)
    .name("Scale")
    .onChange((v) => {
      planet.scale.setScalar(v);
    });
  planetFolder.add(controls.planet, "orbitFrequency", 0.2).name("Orbit speed");
  planetFolder
    .add(controls.planet, "orbitDistance", 2000)
    .name("Orbit distance")
    .listen();
  planetFolder.open();

  // SCENE
  const scene = new THREE.Scene();

  // CAMERA
  const aspectRatio = window.innerWidth / window.innerHeight;
  const nearPlane = 0.1;
  const farPlane = 100000;
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
  orbitControls.enabled = false;

  // BLACKHOLE
  const geometry = new THREE.SphereGeometry(BLACKHOLE_RADIUS);
  const material = new THREE.MeshBasicMaterial({
    color: 0x040311,
  });
  const blackhole = new THREE.Mesh(geometry, material);
  blackhole.scale.setScalar(controls.blackhole.scale);
  scene.add(blackhole);

  // PLANETS
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(4000),
    new THREE.MeshBasicMaterial({
      color: 0xc22e32,
    })
  );
  planet.scale.setScalar(controls.planet.scale);
  scene.add(planet);

  const clock = new THREE.Clock();
  const animate = () => {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    planet.position.set(
      Math.cos(controls.planet.orbitFrequency * elapsedTime) *
        controls.planet.orbitDistance,
      0,
      3 *
        Math.sin(controls.planet.orbitFrequency * elapsedTime) *
        controls.planet.orbitDistance
    );
    planet.rotation.y += 0.01;

    // planet3.position.set(
    //   Math.cos(elapsedTime + 20) * ORBIT_DISTANCE * 3,
    //   0,
    //   Math.sin(elapsedTime + 20) * ORBIT_DISTANCE * 3
    // );
    // planet3.rotation.y += 0.01;

    orbitControls.update();
    renderer.render(scene, camera);
    stats.update();
  };
  animate();
}
