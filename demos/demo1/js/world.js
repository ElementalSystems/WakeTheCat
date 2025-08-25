import * as THREE from 'three';
import { textures } from './textures.js';
import { initMouse } from './mouse.js';
import { objF } from './objects.js';

function makeLevel() {
    const puzzle = new THREE.Object3D();
    const pieces = [];

    const addP = (name, ob, target = 0, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
        ob.position.set(x, y, z);
        ob.rotation.set(rx, ry, rz);
        const tnode = target ? pieces[target].node : puzzle
        tnode.add(ob);
        pieces[name] = {
            node: ob,
            st: 0,
        };
    }

    addP('b1', objF.basket(), false, 0, 5, 0, .2, 0);
    addP('n1', objF.needle(), false, 10, 15, 0);
    addP('n2', objF.needle(), false, -8, 12, 0, 3.14 / 3);
    addP('n3', objF.needle(), 'b1', 0, 10);

    return {
        node: puzzle,
        pieces: pieces,
    }
}

export function makeWorld() {

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // enable shadow maps

    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

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


    var lev = makeLevel();
    scene.add(lev.node);


    initMouse(scene, camera, (el) => {
        console.log("Something clicked ", el);
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

}