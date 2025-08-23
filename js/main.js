import * as THREE from 'three';
import { textures } from './textures.js';
import { initMouse } from './mouse.js';
import { makeBasket, makeSpindle } from './objects.js';

const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0, 15, 30);
camera.lookAt(0, 0, 0); // Look at the origin

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // enable shadow maps

document.body.appendChild(renderer.domElement);

// Cube
const cube = makeBasket();
scene.add(cube);
cube.position.y = 2;
cube.position.x = -2;
cube.rotation.y = 3;

const cube2 = makeSpindle();
cube2.position.y = 15;
cube2.position.x = 10;
cube2.rotation.x = 3.14 / 2;

cube2.castShadow = true; // cube will cast shadow

scene.add(cube2);

// Green Plane
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
