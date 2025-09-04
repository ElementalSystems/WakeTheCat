import * as THREE from 'three';
import { textures } from './textures.js';
import { initMouse } from './mouse.js';
import { levF } from './levels.js'
import { callEachFrame, siso, inter, si, so, frame } from './util.js';


function makeLevel(pcs) {
    const puzzle = new THREE.Object3D();
    const pieces = {};

    const addP = (name, ob, p, rls = []) => {
        const posNode = new THREE.Object3D();
        posNode.name = name;
        Object.assign(posNode, p?.add);
        posNode.position.set(p.x ?? 0, p.y ?? 0, p.z ?? 0);
        posNode.rotation.set(p.rx ?? 0, p.ry ?? 0, p.rz ?? 0);
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
        node: puzzle,
        pieces: pieces,
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

    const scene = new THREE.Scene(); //root node to control the full image

    // Camera
    const camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0); // Look at the origin

    // The world plane
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.MeshStandardMaterial({
        map: textures.pitted(4, 50),
        color: "#800"

    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true; // plane will receive shadows
    plane.rotation.x = -Math.PI / 2; // make it horizontal
    scene.add(plane);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft global light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
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




    // Render Loop
    function animate(t) {
        frame(t);
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);


    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    var level = null;

    function startLevel(lev) {
        const levIn = () => {
            level = lev;
            level.node.position.set(1000, 1000, 1000)
            scene.add(lev.node);
            callEachFrame(1000, (r) => {
                lev.node.position.set(0, inter(r, 40, 0, so), 0);
            });
        }

        if (level) { //dispose of old level
            callEachFrame(1000, (r) => {
                level.node.position.set(0, inter(r, 0, 40, so), 0);
            }, () => {
                scene.remove(level.node)
                freeLevel(level);
                levIn();
            });
        } else levIn();


    }

    //startLevel(makeLevel(levF[5]()));
    //startLevel(makeLevel(levF.test()));
    startLevel(makeLevel(levF.start()));


    const movePiece = (p) => {
        let sts = p.node.sts;
        let os = p.st;
        let ns = (os + 1) % (sts.length);

        //do the rules analysis
        var out = p.rls
            .filter(v => v.st === ns) //only the rules for the new state
            .reduce((acc, rl) =>
                (rl.con.every(c => ((Array.isArray(c.st) ? c.st : [c.st]).includes(level.pieces[c.o].st))) ? ((acc < rl.res) ? acc : rl.res) : acc) //all conditions met 
                , 10000);
        var dur = 500;
        if (out < 1) { //this ain't happening
            //got some way forward in some of the time
            moveP(p, dur * out * 4, os, ns, 0, out, si,
                () => {
                    //TODO:  Play the crash sound
                    setTimeout(() => {
                        moveP(p, dur * out, os, ns, out, 0, so,
                            () => { }
                        )
                    }, 200);
                }
            )
        } else { //complete the move
            moveP(p, dur, os, ns, 0, 1, siso,
                () => {
                    if (out == 10) {  //we won!
                        console.log("MEEEOW!");
                        startLevel(makeLevel(levF.start()));
                    }
                    if ((out >= 100) && (out < 200)) {
                        console.log("Start Level ", out);
                        startLevel(makeLevel(levF[out - 100]()));
                    }
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

}