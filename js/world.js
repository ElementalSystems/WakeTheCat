import * as THREE from 'three';
import { textures } from './textures.js';
import { initMouse } from './mouse.js';
import { objF } from './objects.js';
import { callEachFrame, siso, inter } from './util.js';


function makeLevel() {
    const puzzle = new THREE.Object3D();
    const pieces = [];

    const addP = (name, ob, target = 0, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
        const posNode = new THREE.Object3D();
        posNode.name = name;
        posNode.position.set(x, y, z);
        posNode.rotation.set(rx, ry, rz);
        posNode.add(ob);

        //figure out who to connect it to
        const tnode = target ? pieces[target].node : puzzle
        tnode.add(posNode);
        pieces[name] = {
            node: ob,
            st: 0,
        };
    }

    addP('n1', objF.needle(), false, 10, 15, 0);
    addP('n2', objF.needle(), false, -8, 12, 0, 3.14 / 3);
    addP('n3', objF.needle(), 'n1', 0, 4, -4, 3.14 / 2);
    addP('n4', objF.needle(), false, 0, 10);
    addP('b1', objF.basket(), 'n4', 0, 5);

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

    const movePiece = (p) => {
        let sts = p.node.sts;
        let os = p.st;
        let ns = (os + 1) % (sts.length);
        callEachFrame(
            500,
            (r) => {
                console.log("Setting Position:", os, ns, r);
                p.node.position.set(inter(r, sts[os].x, sts[ns].x, siso), inter(r, sts[os].y, sts[ns].y, siso), inter(r, sts[os].z, sts[ns].z, siso));
                p.node.rotation.set(inter(r, sts[os].rx, sts[ns].rx, siso), inter(r, sts[os].ry, sts[ns].ry, siso), inter(r, sts[os].rz, sts[ns].rz, siso));
            },
            () => { p.st = ns; }
        );

    }


    initMouse(scene, camera, (el, name) => {
        console.log("Something clicked ", name, el);
        if (name) console.log(lev.pieces[name]);
        movePiece(lev.pieces[name]);
    });

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

}