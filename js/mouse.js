import * as THREE from 'three';
import { tickCount, inRange } from './util.js';

//mousy stuff

export function initMouse(scene, camera, clickFunction) {
    var dragStartX, dragStartY, dragStartT, dragNow = false;
    var dragStartRX, dragStartRY;

    var raycaster = new THREE.Raycaster();

    function mouseDown(evt) {
        evt.preventDefault();
        uniDown(evt.clientX, evt.clientY);
    }


    function touchDown(evt) {
        evt.preventDefault();
        uniDown(evt.touches[0].clientX, evt.touches[0].clientY);
    }

    function uniDown(cx, cy) {
        if (dragNow) return;
        dragNow = true;
        dragStartX = cx;
        dragStartY = cy;
        dragStartT = tickCount();
        dragStartRX = scene.rotation.x;
        dragStartRY = scene.rotation.y;
    }



    function mouseUp(evt) {
        evt.preventDefault();
        uniUp(evt.clientX, evt.clientY);
    }

    function touchUp(evt) {
        evt.preventDefault();
        uniUp(evt.changedTouches[0].clientX, evt.changedTouches[0].clientY);
    }

    function uniUp(cx, cy) {
        //was it a click?
        if ((Math.abs(cx - dragStartX) < 5) &&
            (Math.abs(cy - dragStartY) < 5) &&
            (Math.abs(tickCount() - dragStartT) < 400)) { //I think that was a click!			 
            dragNow = false;
            clickSelect(cx, cy);
            return;
        }
        uniMove(cx, cy);
        dragNow = false;
    }

    function mouseMove(evt) {
        evt.preventDefault();
        uniMove(evt.clientX, evt.clientY);
    }

    function touchMove(evt) {
        evt.preventDefault();
        uniMove(evt.touches[0].clientX, evt.touches[0].clientY);
    }

    function uniMove(cx, cy) {
        if (!dragNow) return;
        var xd = cx - dragStartX;
        var yd = cy - dragStartY;
        scene.rotation.x = inRange(-.1, .3, dragStartRX + (yd / window.innerHeight) * 3.14);
        scene.rotation.y = dragStartRY + (xd / window.innerWidth) * 3.14;
    }

    function clickSelect(sx, sy) {

        raycaster.setFromCamera({ x: sx / window.innerWidth * 2 - 1, y: -sy / window.innerHeight * 2 + 1 }, camera);
        var results = raycaster.intersectObject(scene, true);
        var hitEl = results[0]?.object;
        while (hitEl) {
            if (hitEl.name && (!hitEl?.bubbleDown)) break; //we found something with a name that isn't marked click it's parent 
            hitEl = hitEl.parent;
        }
        clickFunction(hitEl, hitEl?.name);
    }

    document.addEventListener('mousemove', mouseMove, false);
    document.addEventListener('mousedown', mouseDown, false);
    document.addEventListener('mouseup', mouseUp, false);
    document.addEventListener('touchstart', touchDown, false);
    document.addEventListener('touchmove', touchMove, false);
    document.addEventListener('touchend', touchUp, false);

}