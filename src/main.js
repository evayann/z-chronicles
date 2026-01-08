import { playerMovementSystem } from "./ecs/player";
import { playerSystemList } from "./ecs/player/player.system";
import { animationSystem } from "./ecs/systems/animation.system";
import { physicsSystem } from "./ecs/systems/physics.system";
import { renderSystem } from "./ecs/systems/render.system";
import { cameraFollowSystem } from "./ecs/systems/third-person-camera.system";
import { preloadAll } from "./engine/assets/initial-load";
import { createEngineContext } from "./engine/context";
import { startLoop } from "./engine/game-loop";
import { PointerLockLook } from "./rendering/pointer-lock-look";
import { createMainScene } from "./scenes/main.scene";

function setLoadingProgress(ratio) {
    const el = document.getElementById("loadingProgress");
    if (el) el.textContent = `${Math.floor(ratio * 100)}%`;
}

function hideLoading() {
    const el = document.getElementById("loading");
    if (el) el.remove();
}

async function bootstrap() {
    const container = document.getElementById("game");
    const context = await createEngineContext(container);

    const REQUIRED_GLB = [
        "models/player.glb",
    ];

    await preloadAll(context.assets, REQUIRED_GLB, setLoadingProgress);

    createMainScene(context);

    hideLoading();

    const look = new PointerLockLook(context.three);
    look.enable();

    startLoop(context, [
        ...playerSystemList,
        physicsSystem,
        animationSystem,
        renderSystem,
        cameraFollowSystem
    ]);
}

bootstrap().catch((e) => {
    console.error(e);
    const el = document.getElementById("loadingProgress");
    if (el) el.textContent = "Erreur de chargement";
});