import * as THREE from 'three';
import { textures } from './textures.js';


function makeCO(mat, objs) {
    const top = new THREE.Group();
    objs.forEach(geo => {
        var mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        top.add(mesh);
    });
    return top;
}

export function makeBasket() {
    return makeCO(
        new THREE.MeshStandardMaterial({
            map: textures.frame,
            side: THREE.DoubleSide,
            metalness: 0,
            roughness: 0.1
        }),
        [
            new THREE.CylinderGeometry(4, 4.2, .3, 32).translate(0, -.5, 0),
            new THREE.TorusGeometry(4, .5, 10, 30).rotateX(3.14 / 2),
            new THREE.TorusGeometry(4.3, .5, 10, 30, 5.5).rotateX(3.14 / 2).translate(0, .9, 0),
            new THREE.TorusGeometry(4.6, .5, 10, 30, 5).rotateX(3.14 / 2).translate(0, 1.8, 0).rotateY(-.25),
            new THREE.TorusGeometry(4.7, .5, 10, 30, 4.8).rotateX(3.14 / 2).translate(0, 2.7, 0).rotateY(-.375)
        ]
    );
}


export function makeSpindle() {
    return makeCO(
        new THREE.MeshStandardMaterial({
            map: textures.squares,
            side: THREE.DoubleSide,
            metalness: 0,
            roughness: 0.1
        }),
        [
            new THREE.CylinderGeometry(1, 1, 6, 12),
            new THREE.CylinderGeometry(1, .1, 3, 12).translate(0, -4.5, 0),
            new THREE.CylinderGeometry(.1, 1, 3, 12).translate(0, 4.5, 0),
        ]
    );
}