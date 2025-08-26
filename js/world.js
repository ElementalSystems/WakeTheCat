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
            { st: 1, con: [{ o: 'n2', st: 0 }], res: .6 }
        ]
    );
    addP('n2', objF.needle(), { x: 10, y: 8, rx: 3.14 / 2 },
        [
            { st: 0, con: [{ o: 'n1', st: 1 }], res: .4 },
        ]
    );


    addP('n4', objF.needle(), { y: 5 });
    addP('b1', objF.basket(), { parent: 'n4', y: 5, add: { passDown: true } });

    return {
        node: puzzle,
        pieces: pieces,
    }
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
            callEachFrame(dur * out,
                (r) => {
                    p.node.position.set(
                        inter(r, sts[os].x, inter(out, sts[os].x, sts[ns].x), si),
                        inter(r, sts[os].y, inter(out, sts[os].y, sts[ns].y), si),
                        inter(r, sts[os].z, inter(out, sts[os].z, sts[ns].z), si)
                    );
                    p.node.rotation.set(
                        inter(r, sts[os].rx, inter(out, sts[os].rx, sts[ns].rx), si),
                        inter(r, sts[os].ry, inter(out, sts[os].ry, sts[ns].ry), si),
                        inter(r, sts[os].rz, inter(out, sts[os].rz, sts[ns].rz), si)
                    );
                },
                () => {
                    //TODO:  Play the crash sound
                    //TODO:  Wait a little bit
                    //then go back
                    callEachFrame(dur * out,
                        (r) => {
                            p.node.position.set(
                                inter(r, inter(out, sts[os].x, sts[ns].x), sts[os].x, so),
                                inter(r, inter(out, sts[os].y, sts[ns].y), sts[os].y, so),
                                inter(r, inter(out, sts[os].z, sts[ns].z), sts[os].z, so)
                            );
                            p.node.rotation.set(
                                inter(r, inter(out, sts[os].rx, sts[ns].rx), sts[os].rx, so),
                                inter(r, inter(out, sts[os].ry, sts[ns].ry), sts[os].ry, so),
                                inter(r, inter(out, sts[os].rz, sts[ns].rz), sts[os].rz, so)
                            );
                        },
                        () => { //all done                          
                        }
                    );


                }
            )
        } else { //complete the move
            callEachFrame(
                dur,
                (r) => {
                    p.node.position.set(inter(r, sts[os].x, sts[ns].x, siso), inter(r, sts[os].y, sts[ns].y, siso), inter(r, sts[os].z, sts[ns].z, siso));
                    p.node.rotation.set(inter(r, sts[os].rx, sts[ns].rx, siso), inter(r, sts[os].ry, sts[ns].ry, siso), inter(r, sts[os].rz, sts[ns].rz, siso));
                },
                () => {
                    p.st = ns; //sets the new state 
                }
            );
        }


    }


    initMouse(scene, camera, (el, name) => {
        movePiece(lev.pieces[name]);
    });

}