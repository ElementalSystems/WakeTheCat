import {
    Group, Mesh, Object3D,
    MeshStandardMaterial, DoubleSide, FrontSide, CylinderGeometry,
    TorusGeometry, BoxGeometry, CapsuleGeometry, SphereGeometry,
    ConeGeometry, PlaneGeometry, DirectionalLight, AmbientLight
} from 'three';
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

export const cat = (i, p, r, n = false) => {
    var c = [
        { g: objF.cat(null, "#FFE", "#48F"), p: { s: .5 } }, //0:Snowy
        { g: objF.cat(textures.tabby("#0008", "#FA0"), "#FA0", "#0F0"), p: { sx: .8, sz: .7 } },//1.Tiger
        { g: objF.cat(textures.tabby("#0004", "#888"), "#AAA", "#FD0"), p: { sx: 1.3, sy: 1.3 } },//2. minx
        { g: objF.cat(textures.blochy("#000F"), "#FFF", "#FD0"), },//3. spot
        { g: objF.cat(textures.blochy("#000A", "#000F", null, 8), "#FFF", "#AF8") },//4. inked
        { g: objF.cat(textures.blochy("#A80A", "#F82A", "#000A", 5), "#FFF", "#0F0") },//5.Splat           
        { g: objF.cat(textures.blochy("#A60", "#000", 0, 3), "#FFF", "#AA0") },//6.Gambit  
        { g: objF.cat(null, "#FA0", "#FF0") }, //7:Ginger                
        { g: objF.cat(textures.tabby("#F804", "#FFF"), "#FA0", "#FF0") }, //8:Jack        
        { g: objF.cat(textures.blochy("#DA0", null, null, 8), "#FFF", "#FF0") }, //9:Rogue          
        { g: objF.cat(textures.blochy("#8508", "#FA48", "#000A", 15), "#FFF", "#FF0"), p: { sx: 1.3, sz: 1.3 } }, //10  
        { g: objF.cat(null, "#888", "#8A0"), p: { s: .8 } }, // 11  :cy 
        { g: objF.cat(null, "#000", "#FF0"), }, //12:Midnight
    ][i];
    return {
        n: 'cat' + (n ? i : ''),
        g: c.g,
        p: { ...c.p, ...p },
        r: r
    }
};

function makeCO(mat, objs, sts = [{}], add = {}) {
    const group = new Group();
    const bits = [group];
    objs.forEach((geo, i) => {
        var bmat = Array.isArray(mat) ? (mat[i] ?? mat[0]) : mat;
        var mesh = new Mesh(geo, bmat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        bits.push(mesh);
        group.add(mesh);
    });
    const controller = new Object3D();
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

export const msm = (col, map, r = 1, bm, bms, m = 0, s) => new MeshStandardMaterial({
    color: col,
    map: map,
    roughness: r,
    bumpMap: bm,
    bumpScale: bms,
    metalness: m,
    side: s ? DoubleSide : FrontSide
});

export const wObj = (scene) => {
    // The world plane
    const plane = new Mesh(new PlaneGeometry(100, 100, 10, 10),
        msm("#262", textures.pitted(3, 100), .2, textures.pitted(5, 44), 1));
    plane.receiveShadow = true; // plane will receive shadows
    plane.rotation.x = -Math.PI / 2; // make it horizontal
    scene.add(plane);


    const ambientLight = new AmbientLight(0xffffff, 0.5); // soft global light
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(25, 35, 5);
    directionalLight.castShadow = true; // enable shadows
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);
}


//The object factories build basic puzzle peices.
export const objF = {
    basket: () => makeCO(
        msm(null, textures.frame(), .1, null, null, 0, true),
        [
            new CylinderGeometry(4, 4.2, .3, 32).translate(0, -.5, 0),
            new TorusGeometry(4, .5, 10, 30).rotateX(3.14 / 2),
            new TorusGeometry(4.3, .5, 10, 30, 5.5).rotateX(3.14 / 2).translate(0, .9, 0),
            new TorusGeometry(4.6, .5, 10, 30, 5).rotateX(3.14 / 2).translate(0, 1.8, 0).rotateY(-.25),
            new TorusGeometry(4.7, .5, 10, 30, 4.8).rotateX(3.14 / 2).translate(0, 2.7, 0).rotateY(-.375)
        ], [],
        { passDown: true }
    ),
    plat: (h = 8) => makeCO(
        msm("#EC8", textures.wood(), .5),
        [
            new BoxGeometry(8, .5, 8).translate(0, 0, 0),
            new CylinderGeometry(1, 1, h, 10).translate(0, -h / 2, 0),
        ], [], { passDown: true }
    ),
    gRing: (h = 5) => makeCO(
        msm("#AA0", null, .1, textures.pitted(10, 20), 1, .8),
        [
            //ringMesh(.6, .4, .3).translate(0, 0, .5),
            new TorusGeometry(.45, .25, 12, 20).translate(0, 0, .1),
            new BoxGeometry(.3, h, .3).translate(0, -h / 2 - .3, .15),
        ], [], { passDown: true }
    ),

    needle: (l = 6) => makeCO(
        [
            msm("#A95", textures.wood(1), .2, textures.diag(), 2),
            msm("#A95", textures.wood(1), .2)
        ],
        [
            new CylinderGeometry(.25, .25, l, 25),
            new CylinderGeometry(.7, .8, 1, 25).translate(0, l / 2 + .5, 0),
            new CylinderGeometry(.25, .01, 3, 25).translate(0, -l / 2 - 1.5, 0),

        ],
        [
            { d: 1200, snd: sFX.spin },
            { d: 800, snd: sFX.spin, y: -(l + 1), sub: { 0: { ry: 3.14 * 2 } } } //state 1 = slide left
        ]
    ),
    hinge: () => {
        const met = msm("#FF8", null, 0, textures.wood(2), 1, .4)
        return makeCO(
            [
                msm("#A95", textures.wood(2), .2),
                met, met, met
            ],
            [
                new BoxGeometry(2, 2, 2).translate(1.2, 1.1, 0),
                new BoxGeometry(2, .05, 2).translate(1.2, .1, 0),
                new CylinderGeometry(.25, .25, 2).translate(0, 0, 0).rotateX(3.14 / 2),
                new BoxGeometry(2, .05, 2).translate(1.2, -.1, 0),
                new BoxGeometry(2, 2, 2).translate(1.2, -1.1, 0),

            ],
            [
                { d: 3000, snd: sFX.hng },
                { d: 300, snd: sFX.hng, rz: 3.14 / 2, sub: { 4: { rz: -3.14 / 2 }, 5: { rz: -3.14 / 2 } } },
            ]
        )
    },
    press: () => {
        var silver = msm("#FFD", null, .1, textures.lines(), 2, .8);
        return makeCO(
            [msm("#800", null, .2, textures.dimple(10), 2), silver, silver],
            [
                new CylinderGeometry(2, 2, 4, 20, 4),
                new CylinderGeometry(1.5, 1.5, 4, 20, 4).translate(0, .5, 0),
                new CylinderGeometry(1.2, 1.2, 4, 20, 4).translate(0, 1, 0),
                new CylinderGeometry(2, 2, .5, 20).translate(0, 3, 0),
            ],
            [
                { d: 800, snd: sFX.woosh },
                { d: 1200, snd: sFX.wooshUp, y: 3, sub: { 1: { y: -3 }, } },
                { d: 1200, snd: sFX.wooshUp, y: 6, sub: { 1: { y: -6 }, 2: { y: -3, }, } }
            ],
        )
    },
    wheel: () => makeCO(
        msm("#AA0", null, .1, textures.pitted(10, 20), 1, .8),
        [
            new TorusGeometry(5.5, .8, 20, 40).rotateX(3.14 / 2),
            new TorusGeometry(1.5, .5, 10, 20).rotateX(3.14 / 2),
            new CapsuleGeometry(.3, 7, 5, 10, 3).rotateX(3.14 / 2).translate(0, 0, 5),
            new CapsuleGeometry(.3, 4.5, 5, 10, 3).translate(0, 3.5, 0).rotateX(3.14 / 2).rotateY(3.14 * 2 / 3),
            new CapsuleGeometry(.3, 4.5, 5, 10, 3).translate(0, 3.5, 0).rotateX(3.14 / 2).rotateY(-3.14 * 2 / 3),
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
                msm("#A84", textures.wood(2), 1),
                msm(null, textures.text(t, l1, l2, l3, "#000", "#CC8"), .8, textures.text(t, l1, l2, l3, "#000", "#FFF"), 4)
            ],
            [
                new BoxGeometry(6, 6, .1).translate(0, 8, 0),
                new BoxGeometry(5.5, 5.5, .1).translate(0, 8, .1),
                new BoxGeometry(.5, 6, .5).translate(0, 2.5, 0),
            ],
            [],
            { passDown: true }
        );

    },
    cat: (coat, ccol = "#000", ecol = "#FF0") => {
        let eyeM = msm(ecol, textures.eye())
        return makeCO(
            [msm(ccol, coat, .7, textures.fur(), 2, 0, true),
                eyeM, eyeM],
            [
                new CapsuleGeometry(1, 2, 5, 10).rotateX(3.14 / 2).translate(0, 0, 0),//body

                new SphereGeometry(.2).rotateY(-3.14 / 2).rotateX(-3.14 / 4).translate(.3, 1.8, 2.3),//eyes
                new SphereGeometry(.2).rotateY(-3.14 / 2).rotateX(-3.14 / 4).translate(-.3, 1.8, 2.3),

                new CapsuleGeometry(.6, 1).rotateX(3.14 / 2).translate(0, 1, 2),//nose
                new CapsuleGeometry(.8, 1).rotateX(3.14 / 4).translate(0, 1, 1.5),//Neck
                new SphereGeometry(1.1).translate(0, .2, -1.2).scale(1.2, 1, 1),//Bum
                new CylinderGeometry(.1, .4, 2.5).rotateX(3.14 / 2).rotateY(-3.14 / 20).translate(-.7, -.8, 2),///front legs
                new CylinderGeometry(.1, .4, 2.5).rotateX(3.14 / 2).rotateY(3.14 / 20).translate(.7, -.8, 2),
                new CylinderGeometry(.2, .4, 2.5).rotateX(3.14 / 2 + .2).rotateY(3.14 / 20).translate(1, -.5, 0),//back legs
                new CylinderGeometry(.2, .4, 2.5).rotateX(3.14 / 2 + .2).rotateY(-3.14 / 20).translate(-1, -.5, 0),

                new ConeGeometry(.3, .9, 8, 1, true, 3.14 / 2, 3.14).translate(.3, 2.3, 2.2),//Ears
                new ConeGeometry(.3, .9, 8, 1, true, 3.14 / 2, 3.14).translate(-.3, 2.3, 2.2),

                new TorusGeometry(1, .15, 6, 12, 4).rotateX(-3.14 / 2).scale(1, 2, 1.5).translate(-1, 0, -2.2),//tail

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
