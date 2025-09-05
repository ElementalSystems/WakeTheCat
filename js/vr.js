import * as THREE from 'three';
import { onFrame } from './util.js';

export function initVR(renderer, scene, camera) {
    console.log("starting VR work");


    const button = document.getElementById('vr');
    var session = null;
    const raycaster = new THREE.Raycaster();

    // The look-at pointer
    const pointMaterial = new THREE.MeshStandardMaterial({
        color: "#FFF",
        transparent: true,
        opacity: .7,
    });
    const point = new THREE.Mesh(new THREE.TorusGeometry(.05, .01, 4, 20), pointMaterial);
    point.position.z = -2;
    point.visible = false;
    camera.add(point);

    const point2 = new THREE.Mesh(new THREE.TorusGeometry(.05, .005, 4, 20), pointMaterial);
    point2.scale.set(2, 2, 2);
    point2.position.z = -2;
    point2.visible = false;
    camera.add(point2);

    var _pointO = null;
    var _pointOTime = 0;

    const noVR = () => {
        button.textContent = 'No VR Found';
    }

    const startSession = (newS) => {
        session = newS;
        session.addEventListener('end', endSession);
        console.log("starting session");
        renderer.xr.setSession(session).then(() => {
            console.log("session set with renderer")
        });
        point.visible = true;
        point2.visible = true;

        onFrame(sessionFrame);
    }

    const endSession = () => {

        point.visible = false;
        point2.visible = false;
        console.log("session Ended");
        session = null;
    }

    const requestSession = () => {
        console.log("requesting session");
        if (session === null)
            navigator.xr.requestSession('immersive-vr', {
                optionalFeatures: [
                    'local-floor',
                ],
            }).then(startSession);
        else
            session.end();
    }


    const sessionFrame = (t, ft) => {
        //do the ray casting
        raycaster.setFromCamera({ x: 0, y: 0 }, camera);
        var results = raycaster.intersectObject(scene, true);
        var hitEl = results[0]?.object;
        while (hitEl) {
            if (hitEl.name && (!hitEl?.passDown)) break; //we found something with a name that isn't marked click it's parent 
            hitEl = hitEl.parent;
        }
        //console.log(hitEl ? hitEl.name : "nothing");
        if (hitEl) {  //we're looking at something
            if (hitEl == _pointO) { //still looking at it
                point2.visible = true;
                var por = (t - _pointOTime) / 5000;
                var sc = 5 - por * 4
                point2.scale.set(sc, sc, sc);
                if (por > 1) {
                    _pointO = null;
                    console.log("Click it: " + hitEl.name);
                }
            } else { //looking at a new thing
                _pointO = hitEl;
                _pointOTime = t;
            }
        } else { //not looiking at anything
            point2.visible = false
            _pointO = null;
        }





        if (session) onFrame(sessionFrame); //call next frame
    }

    if (!('xr' in navigator)) {
        noVR();
        return;
    }

    navigator.xr.isSessionSupported('immersive-vr').then((sup) => {
        if (!sup) {
            noVR();
            return;
        }
        //we have VR support!
        button.onclick = requestSession;
    });

}