import * as THREE from 'three';

import { textures } from './textures.js';


export function makeBasket() {
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
    //const loop = new THREE.TorusGeometry(3.5, .5, 10, 32, 3.14).rotateY(3.14 / 2);
    //cubeGeometry.merge(loop);
    const cubeMaterial = new THREE.MeshStandardMaterial({
        map: textures.frame,
        metalness: 0.5,
        roughness: 0.1
    });
    return new THREE.Mesh(cubeGeometry, cubeMaterial);
}
