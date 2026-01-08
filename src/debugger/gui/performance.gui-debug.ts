import type { WebGLRenderer } from "three";
import { BladeApi, TabPageApi } from "tweakpane";

export class PerformanceGuiDebug {
  #fpsGraph!: BladeApi;
  #rendererInfo = {
    calls: 0,
    lines: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
    nbMaterials: 0,
  };

  constructor(tabPage: TabPageApi) {
    tabPage.addBinding(this.#rendererInfo, "calls", {
      readonly: true,
    });
    tabPage.addBinding(this.#rendererInfo, "lines", {
      readonly: true,
    });
    tabPage.addBinding(this.#rendererInfo, "triangles", {
      readonly: true,
    });
    tabPage.addBinding(this.#rendererInfo, "geometries", {
      readonly: true,
    });
    tabPage.addBinding(this.#rendererInfo, "textures", {
      readonly: true,
    });
    tabPage.addBinding(this.#rendererInfo, "nbMaterials", {
      readonly: true,
    });

    this.#fpsGraph = tabPage.addBlade({
      view: "fpsgraph",
    });
  }

  updateRenderInformations(renderer: WebGLRenderer) {
    this.#rendererInfo.calls = renderer.info.render.calls;
    this.#rendererInfo.lines = renderer.info.render.lines;
    this.#rendererInfo.triangles = renderer.info.render.triangles;
    this.#rendererInfo.geometries = renderer.info.memory.geometries;
    this.#rendererInfo.textures = renderer.info.memory.textures;
    this.#rendererInfo.nbMaterials = renderer.info.programs?.length ?? 0;
  }

  startFpsRecord(): void {
    (this.#fpsGraph as any).begin();
  }

  stopFpsRecord(): void {
    (this.#fpsGraph as any).end();
  }
}
