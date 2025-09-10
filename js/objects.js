import * as THREE from 'three';
import { textures } from './textures.js';
import { sFX } from './sounds.js';

//Maps a partial states into full valid state
const cStates = (v) => ({
    x: v.x ?? 0, y: v.y ?? 0, z: v.z ?? 0,
    rx: v.rx ?? 0, ry: v.ry ?? 0, rz: v.rz ?? 0,
    d: v.d ?? 500, //half second duration bby default 
    snd: v.snd ?? (() => { }), //sound effect if there is one defined
});

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
        depth: h,        // extrusion depth
        steps: 3,                // low steps -> vertical sides
        curveSegments: 32,
        bevelEnabled: true,
        bevelThickness: h / 3,   // how “tall” the bevel is
        bevelSize: h / 3,        // how far inward the bevel goes
        bevelSegments: 3
    });
}

function makeCO(mat, objs, sts = [{}], add = {}) {
    const group = new THREE.Group();
    const bits = [group];
    objs.forEach((geo, i) => {
        var bmat = Array.isArray(mat) ? (mat[i] ?? mat[0]) : mat;
        var mesh = new THREE.Mesh(geo, bmat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        bits.push(mesh);
        group.add(mesh);
    });
    const controller = new THREE.Object3D();
    //map out all the states explicitly and add a zero state
    controller.sts = [...sts].map(cStates);
    //map out substates for every bit
    controller.bits = bits.map((b, i) => ({
        node: b,
        sts: getSubstates(i, sts),
    }));
    if (add) {
        controller.p_adds = add;
        Object.assign(controller, add);
    }
    controller.add(group);
    return controller;
}

//The object factories build basic puzzle peices.
export const objF = {
    basket: () => makeCO(
        new THREE.MeshStandardMaterial({
            map: textures.frame(),
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
            map: textures.wood(),
            color: "#EC8",
            metalness: 0,
            roughness: 0.5
        }),
        [
            new THREE.BoxGeometry(8, .5, 8).translate(0, 0, 0),
            new THREE.CylinderGeometry(1, 1, h, 10).translate(0, -h / 2, 0),
        ], [], { passDown: true }
    ),
    gRing: (h = 5) => makeCO(
        new THREE.MeshStandardMaterial({
            color: "#FF0",
            bumpMap: textures.pitted(),
            bumpScale: .5,
            metalness: .9,
            roughness: 0.1
        }),
        [
            ringMesh(.6, .4, .3),
            new THREE.BoxGeometry(.3, h, .3).translate(0, -h / 2 - .3, .15),
        ], [], { passDown: true }
    ),

    needle: (l = 6) => makeCO(
        [
            new THREE.MeshStandardMaterial({
                color: "#A95",
                map: textures.wood(1),
                bumpMap: textures.diag(),
                bumpScale: 2,
                metalness: 0,
                roughness: 0.2
            }),
            new THREE.MeshStandardMaterial({
                color: "#A95",
                map: textures.wood(1),
                metalness: 0,
                roughness: 0.2
            }),
        ],
        [
            new THREE.CylinderGeometry(.25, .25, l, 25),
            new THREE.CylinderGeometry(.7, .8, 1, 25).translate(0, l / 2 + .5, 0),
            new THREE.CylinderGeometry(.25, .01, 3, 25).translate(0, -l / 2 - 1.5, 0),

        ],
        [
            { d: 1200, snd: sFX.spin },
            { d: 800, snd: sFX.spin, y: -(l + 1), sub: { 0: { ry: 3.14 * 2 } } } //state 1 = slide left
        ]
    ),
    hinge: () => {
        const met = new THREE.MeshStandardMaterial({
            color: "#FF8",
            bumpMap: textures.wood(2),
            bumpScale: 1,
            metalness: .4,
            roughness: 0
        });
        return makeCO(
            [
                new THREE.MeshStandardMaterial({
                    color: "#A95",
                    map: textures.wood(2),
                    metalness: 0,
                    roughness: 0.2
                }), met, met, met

            ],
            [
                new THREE.BoxGeometry(2, 2, 2).translate(1.2, 1.1, 0),
                new THREE.BoxGeometry(2, .05, 2).translate(1.2, .1, 0),
                new THREE.CylinderGeometry(.25, .25, 2).translate(0, 0, 0).rotateX(3.14 / 2),
                new THREE.BoxGeometry(2, .05, 2).translate(1.2, -.1, 0),
                new THREE.BoxGeometry(2, 2, 2).translate(1.2, -1.1, 0),

            ],
            [
                { d: 3000, snd: sFX.hng },
                { d: 300, snd: sFX.hng, rz: 3.14 / 2, sub: { 4: { rz: -3.14 / 2 }, 5: { rz: -3.14 / 2 } } },
            ]
        )
    },
    press: () => {
        var main = new THREE.MeshStandardMaterial({
            bumpMap: textures.dimple(10),
            bumpScale: 2,
            color: "#800",
            roughness: 0.2
        });
        var silver = new THREE.MeshStandardMaterial({
            bumpMap: textures.lines(),
            bumpScale: 2,
            color: "#FFD",
            metalness: .8,
            roughness: 0.1
        });
        return makeCO(
            [main, silver, silver],
            [
                new THREE.CylinderGeometry(2, 2, 4, 20, 4),
                new THREE.CylinderGeometry(1.5, 1.5, 4, 20, 4).translate(0, .5, 0),
                new THREE.CylinderGeometry(1.2, 1.2, 4, 20, 4).translate(0, 1, 0),
                new THREE.CylinderGeometry(2, 2, .5, 20).translate(0, 3, 0),
            ],
            [
                { d: 800, snd: sFX.woosh },
                { d: 1200, snd: sFX.wooshUp, y: 3, sub: { 1: { y: -3 }, } },
                { d: 1200, snd: sFX.wooshUp, y: 6, sub: { 1: { y: -6 }, 2: { y: -3, }, } }
            ],
        )
    },
    wheel: () => makeCO(
        new THREE.MeshStandardMaterial({
            color: "#AA0",
            bumpMap: textures.pitted(),
            bumpScale: .5,
            metalness: .8,
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
            { d: 1000, snd: sFX.grind, },
            { d: 1000, snd: sFX.grind, ry: 3.14 / 2 },
            { d: 1000, snd: sFX.grind, ry: 3.14 },
            { d: 1000, snd: sFX.grind, ry: 3.14 * 3 / 2 },
            { d: 1000, snd: sFX.grind, ry: 3.14 * 2 },
        ],
        {
            wrapState: true,
        }
    ),
    sign: (t, l1, l2, l3) => {
        return makeCO(
            [
                new THREE.MeshStandardMaterial({
                    color: "#A84",
                    map: textures.wood(2),
                    metalness: 0,
                    roughness: 1
                }),
                new THREE.MeshStandardMaterial({
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
            [],
            { passDown: true }
        );

    },
    cat: (coat, ccol = "#000", ecol = "#FF0") => {
        let eyeM =
            new THREE.MeshStandardMaterial({
                map: textures.eye(),
                color: ecol,
            });
        return makeCO(
            [new THREE.MeshStandardMaterial({
                color: ccol,
                map: coat,
                metalness: 0,
                bumpMap: textures.fur(),
                bumpScale: 2,
                side: THREE.DoubleSide,
                roughness: .7,
            }), eyeM, eyeM],

            [
                new THREE.CapsuleGeometry(1, 2, 5, 10).rotateX(3.14 / 2).translate(0, 0, 0),//body

                new THREE.SphereGeometry(.2).rotateY(-3.14 / 2).rotateX(-3.14 / 4).translate(.3, 1.8, 2.3),//eyes
                new THREE.SphereGeometry(.2).rotateY(-3.14 / 2).rotateX(-3.14 / 4).translate(-.3, 1.8, 2.3),

                new THREE.CapsuleGeometry(.6, 1).rotateX(3.14 / 2).translate(0, 1, 2),//nose
                new THREE.CapsuleGeometry(.8, 1).rotateX(3.14 / 4).translate(0, 1, 1.5),//Neck
                new THREE.SphereGeometry(1.1).translate(0, .2, -1.2).scale(1.2, 1, 1),//Bum
                new THREE.CylinderGeometry(.1, .4, 2.5).rotateX(3.14 / 2).rotateY(-3.14 / 20).translate(-.7, -.8, 2),///front legs
                new THREE.CylinderGeometry(.1, .4, 2.5).rotateX(3.14 / 2).rotateY(3.14 / 20).translate(.7, -.8, 2),
                new THREE.CylinderGeometry(.2, .4, 2.5).rotateX(3.14 / 2 + .2).rotateY(3.14 / 20).translate(1, -.5, 0),//back legs
                new THREE.CylinderGeometry(.2, .4, 2.5).rotateX(3.14 / 2 + .2).rotateY(-3.14 / 20).translate(-1, -.5, 0),

                new THREE.ConeGeometry(.3, .9, 8, 1, true, 3.14 / 2, 3.14).translate(.3, 2.3, 2.2),//Ears
                new THREE.ConeGeometry(.3, .9, 8, 1, true, 3.14 / 2, 3.14).translate(-.3, 2.3, 2.2),

                new THREE.TorusGeometry(1, .15, 6, 12, 4).rotateX(-3.14 / 2).scale(1, 2, 1.5).translate(-1, 0, -2.2),//tail

            ],
            [
                { d: 1000 }, //awake
                { //asleep
                    d: 1000,
                    snd: sFX.mew,
                    rz: 0,
                    sub: {
                        2: { y: -1.1, z: .2, x: -.1 },
                        3: { y: -1.1, z: .2, x: .1 },
                        4: { y: -1, z: .3 },
                        5: { rx: .5, },
                        7: { z: -.2, x: .5 },
                        8: { z: -.2, x: -.5 },
                        11: { x: -.8, y: -1, z: .5, rz: -.5 },//ears
                        12: { x: .8, y: -1, z: .5, rz: +.5 },
                        13: { x: 1, y: 0, ry: .7 },
                    }
                },
                { //scared
                    snd: sFX.yowl,
                    d: 1000,
                    rx: -.5,
                    z: 5,
                    y: 3,
                    sub: {
                        2: { x: -1, y: 0, z: .8, ry: .5 },
                        3: { x: 1, y: 0, z: .8, ry: -.5 },
                        7: { ry: -.5, rx: .5, y: 1, z: 1 },
                        8: { ry: .5, rx: .5, y: 1, z: 1 },
                        9: { rx: 2.5, z: -2.5, y: -1.2 },
                        10: { rx: 2.5, z: -2.5, y: -1.2 },

                        11: { x: -1, y: .6, z: 0, rz: -1 },
                        12: { x: 1, y: .6, z: 0, rz: +1 },
                        13: { z: 1, y: 1, rz: -2 },
                    }
                },

            ], { passDown: true }

        );

    }
};
