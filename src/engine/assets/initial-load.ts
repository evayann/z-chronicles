import type { AssetManager } from "./asset-manager";

type ProgressCb = (ratio: number) => void;

// Agrège la progression de plusieurs fichiers
export async function preloadAll(
  assets: AssetManager,
  urls: string[],
  onProgress: ProgressCb
) {
  const perFile = new Map<string, number>();
  const update = () => {
    const sum = urls.reduce((acc, u) => acc + (perFile.get(u) ?? 0), 0);
    onProgress(sum / urls.length);
  };

  await Promise.all(
    urls.map((url) =>
      assets.loadGLB(url, (p) => {
        perFile.set(url, p);
        update();
      })
    )
  );

  onProgress(1);
}
