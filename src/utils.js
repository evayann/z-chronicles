import * as THREE from 'three'
/**
* ------------------------------------
* Author: Vinces
* Website: https://vinces.io
* v.0.1
* Three.js - SIMPLE STARTER THREE.JS
* Work In Progress
* ------------------------------------
*/

export const randomizeMatrix2d = (matrix) => {
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    position.x = THREE.MathUtils.randFloatSpread(5);
    position.y = THREE.MathUtils.randFloatSpread(5);
    position.z = 0;

    scale.x = scale.y = scale.z = 1;

    matrix.compose(position, quaternion, scale)
};
