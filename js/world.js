import * as THREE from 'three';
import { wObj } from './objects.js';

import { initMouse } from './mouse.js';
import { levF } from './levels.js'
import { callEachFrame, siso, inter, si, so, frame, setLC } from './util.js';
import { initVR } from './vr.js'
import { sFX, pChimes } from './sounds.js'

function makeLevel(levR) {

    const lev = levF[levR]();
    const puzzle = new THREE.Object3D();
    const pieces = {};
    const pcs = lev.obj

    const addP = (name, ob, p, rls = []) => {
        const posNode = new THREE.Object3D();
        posNode.name = name;
        if (ob.p_adds) Object.assign(posNode, ob.p_adds);
        Object.assign(posNode, p?.add);
        posNode.position.set(p.x ?? 0, p.y ?? 0, p.z ?? 0);
        posNode.rotation.set(p.rx ?? 0, p.ry ?? 0, p.rz ?? 0);
        ob.children[0].scale.set(p.sx ?? p.s ?? 1, p.sy ?? p.s ?? 1, p.sz ?? p.s ?? 1); //only scale actual object not controller node 
        posNode.add(ob);

        //figure out who to connect it to
        const tnode = p.parent ? pieces[p.parent].node : puzzle
        tnode.add(posNode);
        pieces[name] = {
            node: ob,
            st: p.is || 0,
            rls,
        };
        if (p.is) //set initial state
            moveP(pieces[name], 1, 0, p.is, 0, 1);
    }

    pcs.forEach(d => addP(d.n, d.g, d.p, d.r));
    return {
        ir: { x: lev.irx || 0, y: lev.iry || 0 }, //calculate or set or default initial view rotation
        ref: Number.isInteger(+levR) ? +levR : -1,
        node: puzzle,
        pieces: pieces,
        m: lev.m,
    }
}

function freeLevel(lev) {
    function remove(obj) {
        if (!obj) return;

        // Recursively dispose children
        while (obj.children.length > 0) {
            remove(obj.children[0]);
        }

        if (obj.parent) //disconnect from parent 
            obj.parent.remove(obj);

        if (obj.geometry) //free geometry
            obj.geometry.dispose();


        if (obj.material) { //free materials
            for (const key in obj.material) {
                const value = obj.material[key];
                if (value && value.isTexture) {
                    value.dispose();
                }
            }
            obj.material.dispose();
        }
    }
    remove(lev.node);
}



const setNode = (node, os, ns, sr, er, ipf, r) => {
    node.position.set(
        inter(r, inter(sr, os.x, ns.x), inter(er, os.x, ns.x), ipf),
        inter(r, inter(sr, os.y, ns.y), inter(er, os.y, ns.y), ipf),
        inter(r, inter(sr, os.z, ns.z), inter(er, os.z, ns.z), ipf),
    );
    node.rotation.set(
        inter(r, inter(sr, os.rx, ns.rx), inter(er, os.rx, ns.rx), ipf),
        inter(r, inter(sr, os.ry, ns.ry), inter(er, os.ry, ns.ry), ipf),
        inter(r, inter(sr, os.rz, ns.rz), inter(er, os.rz, ns.rz), ipf),
    );

}

const moveP = (p, dur, os, ns, sr, er, ipf, after) => {
    callEachFrame(dur, (r) => {
        setNode(p.node, p.node.sts[os], p.node.sts[ns], sr, er, ipf, r);
        p.node.bits.forEach(b => {
            if (b.sts) setNode(b.node, b.sts[os], b.sts[ns], sr, er, ipf, r);
        });
    }, after);
}



export function makeWorld() {

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.xr.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // enable shadow maps

    document.body.appendChild(renderer.domElement);

    const sceneBase = new THREE.Scene(); //root node to control the full image
    const scene = new THREE.Group();
    sceneBase.add(scene);
    // Camera
    const camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    const cameraRig = new THREE.Group();
    cameraRig.position.set(0, 3, 30);
    cameraRig.add(camera);
    sceneBase.add(cameraRig);
    camera.position.set(0, 1.7, 0);
    camera.lookAt(0, 3, 0); // Look at the origin


    wObj(scene);


    // Render Loop
    function animate(t) {
        frame(t);
        renderer.render(sceneBase, camera);
    }
    renderer.setAnimationLoop(animate);


    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    var level = null;
    var lMoving = false;

    function startLevel(lev) {
        const levIn = () => {
            level = lev;
            level.node.position.set(1000, 1000, 1000)
            scene.add(lev.node);
            pChimes(lev.m); //play chimes if defined
            callEachFrame(1000, (r) => {
                lev.node.position.set(0, inter(r, 40, 0, so), 0);
            });
            //rotate the scene to the iritial angle
            var stx = scene.rotation.x;
            var sty = scene.rotation.y;
            callEachFrame(1200, (r) => {
                scene.rotation.set(inter(r, stx, level.ir.x, so), inter(r, sty, level.ir.y, so), 0)
            }, () => {
                if (lev.pieces.cat)
                    moveP(lev.pieces.cat, 2000, 0, 1, 0, 1, so);
                lMoving = false;
            })

        }
        lMoving = true;
        pChimes(); //silence chimes
        if (level) { //dispose of old level
            callEachFrame(1000, (r) => {
                level.node.position.set(0, inter(r, 0, 50, so), 0);
            }, () => {
                scene.remove(level.node)
                freeLevel(level);
                levIn();
            });
        } else levIn();
    }

    startLevel(makeLevel(2));
    //startLevel(makeLevel('start'));


    const movePiece = (p) => {
        if (lMoving) return; //can't click it's in action
        let sts = p.node.sts;
        let os = p.st;
        let ns = (os + 1) % (sts.length);
        lMoving = true;
        //do the rules analysis
        var out = p.rls
            .filter(v => v.st === ns) //only the rules for the new state
            .reduce((acc, rl) =>
                (rl.con.every(c => ((Array.isArray(c.st) ? c.st : [c.st]).includes(level.pieces[c.o].st))) ? ((acc < rl.res) ? acc : rl.res) : acc) //all conditions met 
                , 10000);
        var dur = sts[ns].d;
        if (out < 1) { //this ain't happening
            //got some way forward in some of the time
            sts[ns].snd(dur / 1000, (dur * out) / 1000);
            moveP(p, dur * out, os, ns, 0, out, si,
                () => {
                    sFX.bash(.5, 1);
                    setTimeout(() => {
                        sts[os].snd(dur / 1000, (dur * out) / 1000);
                        moveP(p, dur * out, os, ns, out, 0, so,
                            () => { lMoving = false; }
                        )
                    }, 1000);
                }
            )
        } else { //complete the move
            sts[ns].snd(dur / 1000, dur * 2 / 1000); //play the noise
            moveP(p, dur, os, ns, 0, 1, siso,
                () => {
                    lMoving = false;
                    if (out == 10) {  //we won!
                        if (level.ref >= 0) setLC(level.ref);
                        sFX.yowl(3, 3);
                        moveP(level.pieces.cat, 2000, 1, 2, 0, 1, so, () => {
                            startLevel(makeLevel('start'));
                        });
                    }
                    if ((out >= 100) && (out < 200))
                        startLevel(makeLevel(out - 100));
                    p.st = ns; //sets the new state
                    if (p.node.wrapState && (ns == sts.length - 1)) {// the last one needs to wrap
                        p.st = 0;
                        moveP(p, 1, ns, 0, 0, 1);
                    }
                }
            );
        }

    }


    initMouse(scene, camera, (el, name) => {
        movePiece(level.pieces[name]);
    });

    initVR(renderer, scene, camera, (el, name) => {
        movePiece(level.pieces[name]);
    });

}

makeWorld(); 