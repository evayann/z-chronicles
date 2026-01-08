import * as THREE from "three";
import CameraControls from "camera-controls";
import { AnimationStore } from "./animation-store";

CameraControls.install({ THREE });

export class ThreeContext {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: CameraControls;
  meshes: THREE.Object3D[] = [];

  animations = new AnimationStore();

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x101018);

    this.camera = new THREE.PerspectiveCamera();
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.controls = new CameraControls(this.camera, this.renderer.domElement);

    // // polar = angle depuis "up". 0 = regarde vers le haut, PI = regarde vers le bas
    // this.controls.minPolarAngle = 0.15 * Math.PI; // limite haut
    // this.controls.maxPolarAngle = 0.55 * Math.PI; // limite bas (regard vers sol)
    // // clamp zoom
    // this.controls.minDistance = 2;
    // this.controls.maxDistance = 10;

    // Désactive le pan (Minecraft-like)
    this.controls.mouseButtons.right = CameraControls.ACTION.ROTATE;
    this.controls.mouseButtons.left = CameraControls.ACTION.NONE;
    this.controls.mouseButtons.middle = CameraControls.ACTION.NONE;
    this.controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;

    this.controls.touches.one = CameraControls.ACTION.NONE;
    this.controls.touches.two = CameraControls.ACTION.NONE;

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(5, 10, 7);
    this.scene.add(light);

    window.addEventListener("resize", () => {
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
