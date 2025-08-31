import * as THREE from 'three';
import { textures } from './textures.js';

//Maps a partial states into fulkl valid state
const cStates = (v) => ({ x: v.x ?? 0, y: v.y ?? 0, z: v.z ?? 0, rx: v.rx ?? 0, ry: v.ry ?? 0, rz: v.rz ?? 0 });

function getSubstates(i, sts) {
    if (!sts.some(s => s.sub && s.sub[i])) return null; //if the bit has no substate forget it
    return sts.map(s => s.sub && s.sub[i] ? s.sub[i] : {}) //otherwise force full substate for all states 
        .map(cStates);
}

function ringMesh(r, ir, h) {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, r, 0, Math.PI * 2, false);

    const holePath = new THREE.Path();
    holePath.absarc(0, 0, ir, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    return new THREE.ExtrudeGeometry(shape, {
        depth: h,        // extrusion depth (along +Z by default)
        steps: 3,                // low steps -> vertical sides
        curveSegments: 32,
        bevelEnabled: true,
        bevelThickness: h / 3,   // how “tall” the bevel is
        bevelSize: h / 3,        // how far inward the bevel goes
        bevelSegments: 3
    });
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
        ]
    ),
    plat: (h = 8) => makeCO(
        new THREE.MeshStandardMaterial({
            map: textures.frame,
            color: "#FF0",
            side: THREE.DoubleSide,
            metalness: 0,
            roughness: 0.1
        }),
        [
            new THREE.BoxGeometry(8, .5, 8).translate(0, 0, 0),
            new THREE.CylinderGeometry(1, 1, h, 10).translate(0, -h / 2, 0),
            new THREE.BoxGeometry(10, .5, 10).translate(0, -h, 0),

        ]
    ),

    needle: () => makeCO(
        new THREE.MeshStandardMaterial({
            color: "#BB8",
            bumpMap: textures.diag,
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
            flatShading: true,
            metalness: 0,
            roughness: 0.5
        });
        var silver = new THREE.MeshStandardMaterial({
            bumpMap: textures.frame,
            bumpScale: 5,
            color: "#FFD",
            metalness: 0.7,
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
                { y: 3, sub: { 1: { y: -3 }, } },
                { y: 6, sub: { 1: { y: -6 }, 2: { y: -3, }, } }
            ],
        )
    },
    wheel: () => makeCO(
        new THREE.MeshStandardMaterial({
            color: "#FF0",
            bumpMap: textures.pitted(),
            bumpScale: .5,
            metalness: .9,
            roughness: 0.1
        }),
        [
            ringMesh(6, 5, 1).rotateX(3.14 / 2).translate(0, .5, 0),
            ringMesh(1.5, 1, 1).rotateX(3.14 / 2).translate(0, .5, 0),
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
                    flatShading: true,
                    metalness: 0,
                    roughness: 1
                }),
                new THREE.MeshStandardMaterial({
                    //map: textures.text(t, l1, l2, l3),
                    map: textures.text(t, l1, l2, l3, "#000", "#CC8"),
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

    },
    cat: (coat, ccol = "#000", ecol = "#FF0") => {
        let eyeM =
            new THREE.MeshStandardMaterial({
                map: textures.eye,
                color: ecol,
            });
        return makeCO(
            [new THREE.MeshStandardMaterial({
                color: ccol,
                map: coat,
                metalness: 0,
                bumpMap: textures.fur,
                bumpScale: 2,
                side: THREE.DoubleSide,
                roughness: .7,
            }), eyeM, eyeM],

            [
                new THREE.CapsuleGeometry(1, 2).rotateX(3.14 / 2).translate(0, 0, 0),//body

                new THREE.SphereGeometry(.2).rotateY(-3.14 / 2).rotateX(-3.14 / 4).translate(.3, 1.8, 2.4),//eyes
                new THREE.SphereGeometry(.2).rotateY(-3.14 / 2).rotateX(-3.14 / 4).translate(-.3, 1.8, 2.4),

                new THREE.CapsuleGeometry(.6, 1).rotateX(3.14 / 2).translate(0, 1, 2),//nose
                new THREE.CapsuleGeometry(.8, 1).rotateX(3.14 / 4).translate(0, 1, 1.5),//Neck
                new THREE.SphereGeometry(1.1).translate(0, .2, -1.2).scale(1.2, 1, 1),//Bum
                new THREE.CylinderGeometry(.1, .4, 2.5).rotateX(3.14 / 2).rotateY(-3.14 / 20).translate(-.7, -.5, 2.5),///front legs
                new THREE.CylinderGeometry(.1, .4, 2.5).rotateX(3.14 / 2).rotateY(3.14 / 20).translate(.7, -.5, 2.5),
                new THREE.CylinderGeometry(.2, .4, 2.5).rotateX(3.14 / 2).rotateY(3.14 / 20).translate(1, -.5, 0),//back legs
                new THREE.CylinderGeometry(.2, .4, 2.5).rotateX(3.14 / 2).rotateY(-3.14 / 20).translate(-1, -.5, 0),

                new THREE.ConeGeometry(.3, .9, 8, 1, true, 3.14 / 2, 3.14).translate(.3, 2.3, 2.2),//Ears
                new THREE.ConeGeometry(.3, .9, 8, 1, true, 3.14 / 2, 3.14).translate(-.3, 2.3, 2.2),

                new THREE.TorusGeometry(1, .15, 6, 12, 4).rotateX(-3.14 / 2).translate(-1, 0, -2.2),

            ],

        );

    }
};
