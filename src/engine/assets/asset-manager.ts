import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export type GLBAsset = {
  scene: THREE.Object3D;
  animationList: THREE.AnimationClip[];
};

// Todo move this in rendering folder in the three context instead of engine context
export class AssetManager {
  private loader = new GLTFLoader();
  private cache = new Map<string, GLBAsset>();

  loadGLB(
    url: string,
    onProgress?: (progression: number) => void
  ): Promise<GLBAsset> {
    const cached = this.cache.get(url);
    if (cached) {
      onProgress?.(1);
      return Promise.resolve(cached);
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          const asset: GLBAsset = {
            scene: gltf.scene,
            animationList: gltf.animations,
          };
          this.cache.set(url, asset);
          onProgress?.(1);
          resolve(asset);
        },
        (evt) => {
          if (!onProgress) return;
          if (evt.total && evt.total > 0) onProgress(evt.loaded / evt.total);
        },
        reject
      );
    });
  }

  getGLB(url: string): GLBAsset {
    const glb = this.cache.get(url);
    if (!glb) throw new Error(`GLB not preloaded: ${url}`);
    return glb;
  }
}
