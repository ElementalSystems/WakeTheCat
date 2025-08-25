import * as THREE from 'three';
import { textures } from './textures.js';


function makeCO(mat, objs, sts = []) {
    const group = new THREE.Group();
    const bits = [group];
    objs.forEach(geo => {
        var mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        bits.push(mesh);
        group.add(mesh);
    });
    const controller = new THREE.Object3D();
    controller.bits = bits; //expose the bits for later substate animations
    //map out all the states explicitly and add a zero state
    controller.sts = [{}, ...sts].map(v => ({ x: v.x ?? 0, y: v.y ?? 0, z: v.z ?? 0, rx: v.rx ?? 0, ry: v.ry ?? 0, rz: v.rz ?? 0 }));
    controller.add(group);
    return controller;
}

//The object fatcories build basic puzzle peices.
export const objF = {
    basket: () => makeCO(
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
        ]),
    needle: () => makeCO(
        new THREE.MeshStandardMaterial({
            color: "#BB8",
            bumpMap: textures.wood,
            bumpScale: 1,
            metalness: 0,
            roughness: 0.3
        }),
        [
            new THREE.CylinderGeometry(.25, .25, 6, 25),
            new THREE.CylinderGeometry(.25, .01, 3, 25).translate(0, -4.5, 0),
            new THREE.CylinderGeometry(.7, .8, 1, 25).translate(0, 3.5, 0),
        ],
        [
            { y: -8 } //state 1 = slide left
        ]
    ),
};
