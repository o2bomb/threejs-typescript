import { GUI } from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { Timer } from "./Timer";

const STATS_ELEMENT_ID = "stats";
const KNOBS_ELEMENT_ID = "knobs";

class Scene {
  // Scene objects/data
  private _wrapperEl;
  private _clock = new Timer();
  private _renderer?: THREE.Renderer;
  private _camera?: THREE.PerspectiveCamera;

  // Stats, dat.GUI
  private _hasUIMounted = false;
  private _stats = Stats();
  private _knobs = new GUI({
    hideable: false,
  });

  constructor(wrapperEl: HTMLElement) {
    this._wrapperEl = wrapperEl;
    if (this._wrapperEl.style.position === "") {
      this._wrapperEl.style.position = "relative";
    }

    this._stats.domElement.id = STATS_ELEMENT_ID;
    this._knobs.domElement.id = KNOBS_ELEMENT_ID;
  }

  toggleUI() {
    if (!this._hasUIMounted) {
      this._wrapperEl.appendChild(this._stats.dom);
      this._knobs.show();
    } else {
      this._wrapperEl.removeChild(this._stats.dom);
      this._knobs.hide();
    }
    this._hasUIMounted = !this._hasUIMounted;
  }

  destroy() {
    this._wrapperEl.removeChild(this._stats.dom);
    this._knobs.destroy();

    window.removeEventListener("resize", this.handleResize, false);
    document.removeEventListener("keydown", this.handleKeyDown, false);
  }

  init() {
    window.addEventListener("resize", this.handleResize, false);
    document.addEventListener("keydown", this.handleKeyDown, false);

    const controls = {
      camera: {
        zPosition: 5,
        fieldOfView: 60,
      },
    };
    const cameraFolder = this._knobs.addFolder("Camera");
    cameraFolder
      .add(controls.camera, "zPosition", 1, 10)
      .name("Z Position")
      .onChange((v) => {
        if (!this._camera) return;
        this._camera.position.z = v;
      });
    cameraFolder
      .add(controls.camera, "fieldOfView", 10, 300)
      .name("Field of view")
      .onChange((v) => {
        if (!this._camera) return;
        this._camera.fov = v;
        this._camera.updateProjectionMatrix();
      });
    cameraFolder.open();

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const aspectRatio = window.innerWidth / window.innerHeight;
    const nearPlane = 0.1;
    const farPlane = 1000;
    this._camera = new THREE.PerspectiveCamera(
      controls.camera.fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );
    this._camera.position.z = controls.camera.zPosition;

    // CANVAS
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-1";
    this._wrapperEl.appendChild(canvas);

    // RENDERER
    this._renderer = new THREE.WebGLRenderer({ canvas });
    this._renderer.setSize(window.innerWidth, window.innerHeight);

    // CONTROLS
    const orbitControls = new OrbitControls(
      this._camera,
      this._renderer.domElement
    );
    orbitControls.enableDamping = true;

    // OBJECTS
    const cubeGeometry = new THREE.BoxGeometry(1, 1);
    const cubeMaterial = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    const render = () => {
      if (!this._renderer || !this._camera) return;
      requestAnimationFrame(render);

      const delta = this._clock.getDelta();

      cube.rotation.x += 1 * delta;
      cube.rotation.y += 1 * delta;
      cube.rotation.z += 1 * delta;

      orbitControls.update();
      this._stats.update();
      this._clock.update();

      this._renderer.render(scene, this._camera);
    };
    render();
  }

  // Listeners (must be arrow function for it to access class methods/vars)
  private handleResize = () => {
    if (!this._renderer || !this._camera) return;
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    this._renderer.setSize(WIDTH, HEIGHT);
    this._camera.aspect = WIDTH / HEIGHT;
    this._camera.updateProjectionMatrix();
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    console.log(this._stats);
    if (e.key === "h") {
      this.toggleUI();
    }
  };
}

export default Scene;
