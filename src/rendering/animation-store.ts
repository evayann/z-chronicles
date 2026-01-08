import * as THREE from "three";

export class AnimationStore {
  mixers: THREE.AnimationMixer[] = [];

  createMixer(root: THREE.Object3D) {
    const mixer = new THREE.AnimationMixer(root);
    const id = this.mixers.push(mixer) - 1;
    return { mixer, id };
  }

  update(dt: number) {
    for (let i = 0; i < this.mixers.length; i++) {
      this.mixers[i]?.update(dt);
    }
  }
}
