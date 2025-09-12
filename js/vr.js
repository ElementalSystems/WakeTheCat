import * as THREE from 'three';
import { inRange, onFrame } from './util.js';
import { textures } from './textures.js';

export function initVR(renderer, scene, camera, clickFunction) {
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

    const boxMaterial = new THREE.MeshStandardMaterial({
        color: "#FFF",
        map: textures.arrow(),
        bumpMap: textures.arrow(),
        bumpScale: 3,
        transparent: true,
        opacity: .5
    });
    const con = new THREE.Group();
    [
        { n: "_d", x: 1, y: 0, r: -1 },
        { n: "_a", x: -1, y: 0, r: 1 },
        { n: "_w", x: 0, y: -1, r: 0 },
        { n: "_s", x: 0, y: 1, r: 2 },
    ].forEach(b => {
        const box = new THREE.Mesh(new THREE.BoxGeometry(.1, .05, .1), boxMaterial);
        box.name = b.n;
        box.position.set(b.x * .125, 0, b.y * .125);
        box.rotation.set(0, b.r * 3.14 / 2, 0);
        con.add(box);
    });
    con.visible = false;
    con.position.set(0, 1.4, -.5)
    con.rotation.set(3.14 / 3, 0, 0)
    camera.parent.add(con);


    var _pointO = null;
    var _pointOTime = 0;

    const noVR = () => {
        button.textContent = 'No VR Found';
    }

    const startSession = (newS) => {
        session = newS;
        session.addEventListener('end', endSession);
        renderer.xr.setSession(session);
        point.visible = true;
        point2.visible = true;
        con.visible = true;

        onFrame(sessionFrame);
    }

    const endSession = () => {
        point.visible = false;
        point2.visible = false;
        con.visible = false;
        camera.lookAt(0, 3, 0);
        session = null;
    }

    const requestSession = () => {
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
        if (!session) return; // we're done
        var cKey = null;
        var trigger = false;
        //check out the controls
        for (let is of session.inputSources) {
            const gp = is.gamepad;
            if (!gp) continue;

            trigger = (gp.buttons[0].value > .5) || (gp.buttons[1].pressed) || (gp.buttons[2].pressed);
            if (gp.axes[0] > .5) cKey = "_d";
            if (gp.axes[0] < -.5) cKey = "_a";
            if (gp.axes[1] > .5) cKey = "_w";
            if (gp.axes[1] < -.5) cKey = "_s";
        }
        //do the ray casting
        raycaster.setFromCamera({ x: 0, y: 0 }, camera);
        var results = raycaster.intersectObject(scene.parent, true);
        var hitEl = results[0]?.object;
        while (hitEl) {
            if (hitEl.name && (!hitEl?.passDown)) break; //we found something with a name that isn't marked click it's parent 
            hitEl = hitEl.parent;
        }
        if (hitEl?.name.startsWith("_")) { //it's a special controller thing so ignore it
            cKey = hitEl.name;
            hitEl = null;
        }
        if (hitEl) {  //we're looking at something
            if (hitEl == _pointO) { //still looking at it
                point2.visible = true;
                var por = (t - _pointOTime) / 3000;
                if (trigger) por = 1.1;
                var sc = 4.8 - por * 4
                point2.scale.set(sc, sc, sc);
                if (por > 1) {
                    _pointO = null;
                    clickFunction(hitEl, hitEl?.name);
                }
            } else { //looking at a new thing
                _pointO = hitEl;
                _pointOTime = t;
            }
        } else { //not looiking at anything
            point2.visible = false
            _pointO = null;
        }
        //okay handle some controls
        if (cKey == '_d') scene.rotation.y -= .0003 * ft;
        if (cKey == '_a') scene.rotation.y += .0003 * ft;
        if (cKey == '_w') scene.rotation.x = inRange(-.1, 1, scene.rotation.x + .0002 * ft);
        if (cKey == '_s') scene.rotation.x = inRange(-.1, 1, scene.rotation.x - .0002 * ft);

        onFrame(sessionFrame); //call next frame
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