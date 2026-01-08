import * as THREE from "three";
import { EngineContext } from "../../engine/context";
import { TabPageApi } from "tweakpane";
import { RapierWorld } from "../../physics/rapier-world";

export class PhysicsGuidDebug {
  #mesh;
  #enabled = false;

  constructor(tabPage: TabPageApi) {
    const showButton = tabPage.addButton({ title: "Hide physic world" });
    showButton.on("click", () => {
      this.#enabled = !this.#enabled;
      showButton.title = `${this.#enabled ? "Hide" : "Show"} physic world`;
    });

    this.#mesh = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true })
    );
    this.#mesh.frustumCulled = false;
  }

  initialize(context: EngineContext): void {
    context.three.scene.add(this.#mesh);
  }

  update(world: RapierWorld) {
    if (this.#enabled) {
      const { vertices, colors } = world.debugRender;
      this.#mesh.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(vertices, 3)
      );
      this.#mesh.geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 4)
      );
      this.#mesh.visible = true;
    } else {
      this.#mesh.visible = false;
    }
  }
}
