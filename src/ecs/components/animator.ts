import { MAX_ENTITIES } from "../entities";

export const Animator = {
  mixerId: new Int32Array(MAX_ENTITIES), // -1 si none
  state: new Uint8Array(MAX_ENTITIES), // 0=idle,1=run,2=jump (exemple)
};
