import * as THREE from 'three'

function makeCanvasTexture(drawFunc, repeat = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    drawFunc(ctx);

    var texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat, repeat);
    return texture;
}

export const textures = {
    squares: makeCanvasTexture((ctx) => {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, 128, 128);
        ctx.fillStyle = '#AA0000';
        ctx.fillRect(128, 0, 128, 128);
        ctx.fillStyle = '#880000';
        ctx.fillRect(0, 128, 128, 128);
        ctx.fillStyle = '#330000';
        ctx.fillRect(128, 128, 128, 128);
    }, 100),
    frame: makeCanvasTexture((ctx) => {
        ctx.fillStyle = '#2222FF';
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = '#000088';
        ctx.fillRect(10, 10, 236, 236);
    }, 10),

}