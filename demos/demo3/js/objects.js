import * as THREE from 'three';
import { textures } from './textures.js';

//Maps a partial states into fulkl valid state
const cStates = (v) => ({ x: v.x ?? 0, y: v.y ?? 0, z: v.z ?? 0, rx: v.rx ?? 0, ry: v.ry ?? 0, rz: v.rz ?? 0 });

function getSubstates(i, sts) {
    if (!sts.some(s => s.sub && s.sub[i])) return null; //if the bit has no substate forget it
    return sts.map(s => s.sub && s.sub[i] ? s.sub[i] : {}) //otherwise force full substate for all states 
        .map(cStates);
}

function makeCO(mat, objs, sts = [], add = {}) {
    const group = new THREE.Group();
    const bits = [group];
    objs.forEach((geo, i) => {
        var bmat = Array.isArray(mat) ? (mat[i] ?? mat[0]) : mat;
        var mesh = new THREE.Mesh(geo, bmat);
        mesh.castShadow = true;
        bits.push(mesh);
        group.add(mesh);
    });
    const controller = new THREE.Object3D();
    //map out all the states explicitly and add a zero state
    controller.sts = [{}, ...sts].map(cStates);
    //map out substates for every bit
    controller.bits = bits.map((b, i) => ({
        node: b,
        sts: getSubstates(i, [{}, ...sts]),
    }));
    Object.assign(controller, add);
    controller.add(group);
    return controller;
}

//The object factories build basic puzzle peices.
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
            { y: -8, sub: { 0: { ry: 3.14 * 2 } } } //state 1 = slide left
        ]
    ),
    press: () => {
        var main = new THREE.MeshStandardMaterial({
            map: textures.frame,
            metalness: 0,
            roughness: 0.5
        });
        var silver = new THREE.MeshStandardMaterial({
            bumpMap: textures.wood,
            bumpScale: .5,
            color: "#FFD",
            metalness: 0.9,
            roughness: 0.1
        });
        return makeCO(
            [main, silver, silver],
            [
                new THREE.CylinderGeometry(2, 2, 4, 8, 4),
                new THREE.CylinderGeometry(1.5, 1.5, 4, 20, 4).translate(0, .5, 0),
                new THREE.CylinderGeometry(1, 1, 4, 20, 4).translate(0, 1, 0),
                new THREE.CylinderGeometry(2, 2, .5, 8).translate(0, 3, 0),
                new THREE.CylinderGeometry(2, 2, .5, 8).translate(0, 3, 0),
            ],
            [
                { y: 3, sub: { 1: { y: -3 }, 2: { ry: -3.14 * 8 } } },
                { y: 6, sub: { 1: { y: -6 }, 2: { y: -3, ry: -3.14 * 8 }, 3: { ry: 3.14 * 8 }, } }
            ],
        )
    },
    wheel: () => makeCO(
        new THREE.MeshStandardMaterial({
            color: "#FF0",
            metalness: .9,
            roughness: 0
        }),
        [
            new THREE.TorusGeometry(6, .4, 10, 30).rotateX(3.14 / 2),
            new THREE.TorusGeometry(1.5, .6, 10, 30).rotateX(3.14 / 2),
            new THREE.CapsuleGeometry(.3, 7, 5, 10, 3).rotateX(3.14 / 2).translate(0, 0, 5),
            new THREE.CapsuleGeometry(.3, 4.5, 5, 10, 3).translate(0, 3.5, 0).rotateX(3.14 / 2).rotateY(3.14 * 2 / 3),
            new THREE.CapsuleGeometry(.3, 4.5, 5, 10, 3).translate(0, 3.5, 0).rotateX(3.14 / 2).rotateY(-3.14 * 2 / 3),
        ],
        [
            { ry: 3.14 / 2 },
            { ry: 3.14 },
            { ry: 3.14 * 3 / 2 },
            { ry: 3.14 * 2 },
        ],
        {
            wrapState: true,
        }
    ),
    sign: (t, l1, l2, l3) => {

        return makeCO(
            [
                new THREE.MeshStandardMaterial({
                    color: "#060",
                    metalness: 0,
                    roughness: 1
                }),
                new THREE.MeshStandardMaterial({
                    //map: textures.text(t, l1, l2, l3),
                    map: textures.text(t, l1, l2, l3, "#000", "#999"),
                    bumpMap: textures.text(t, l1, l2, l3, "#000", "#FFF"),
                    bumpScale: 4,
                }),
            ],
            [
                new THREE.BoxGeometry(6, 6, .1).translate(0, 8, 0),
                new THREE.BoxGeometry(5.5, 5.5, .1).translate(0, 8, .1),
                new THREE.BoxGeometry(.5, 6, .5).translate(0, 2.5, 0),
            ],

        );

    }
};
