import * as THREE from 'three';
import { textures } from './textures.js';
import { initMouse } from './mouse.js';
import { objF } from './objects.js';
import { callEachFrame, siso, inter, si, so } from './util.js';


function makeLevel() {
    const puzzle = new THREE.Object3D();
    const pieces = [];

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
            st: 0,
            rls,
        };
    }

    addP('n1', objF.needle(), { x: 10, y: 16 },
        [
            { st: 1, con: [{ o: 'n2', st: 0 }], res: .3 }
        ]
    );
    addP('n2', objF.needle(), { x: 10, y: 8, rx: 3.14 / 2 },
        [
            { st: 0, con: [{ o: 'n1', st: 1 }], res: .48 },
        ]
    );


    addP('n4', objF.needle(), { y: 5 });
    addP('b1', objF.basket(), { parent: 'n4', y: 5, add: { passDown: true } });


    addP('w1', objF.wheel(), { x: -13, y: 1, z: 0 })
    addP('p1', objF.press(), { parent: 'w1', x: 0, y: 2 });
    addP('p2', objF.press(), { parent: 'p1', y: 5, rx: 3.14 / 2 });
    addP('p3', objF.press(), { parent: 'p2', y: 5, rz: -3.14 / 2 });

    addP('w2', objF.wheel(), { x: 13, y: 1, z: 10 })
    addP('b2', objF.basket(), { parent: 'w2', z: 9, y: 1, add: { passDown: true } });

    addP('s1', objF.sign("Snowflake", "Trusting little", "kitten", "easy to scare"), { x: 0, z: 5 })
    addP('s2', objF.sign("Midnight", "", "Skittish", "sleeps safe"), { parent: 'w2', x: 0, z: -6 })
    return {
        node: puzzle,
        pieces: pieces,
    }
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
        side: THREE.DoubleSide, map: textures.squares,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true; // plane will receive shadows
    plane.rotation.x = -Math.PI / 2; // make it horizontal
    scene.add(plane);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // soft global light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 50, 5);
    directionalLight.castShadow = true; // enable shadows
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);




    // Render Loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    var lev = makeLevel();
    scene.add(lev.node);


    const movePiece = (p) => {
        let sts = p.node.sts;
        let os = p.st;
        let ns = (os + 1) % (sts.length);

        //do the rules analysis
        var out = p.rls
            .filter(v => v.st === ns) //only the rules for the new state
            .reduce((acc, rl) =>
                (rl.con.every(c => lev.pieces[c.o].st === c.st)) ? ((acc < rl.res) ? acc : rl.res) : acc //all conditions met 
                , 10);
        var dur = 500;
        if (out < 1) { //this ain't happening
            //got some way forward in some of the time
            moveP(p, dur * out, os, ns, 0, out, si,
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
        movePiece(lev.pieces[name]);
    });

}