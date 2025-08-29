import * as THREE from 'three'

function makeCanvasTexture(drawFunc, bg = 0, repeat = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 512);
    ctx.line = (x1, y1, x2, y2, c, w) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = c;
        ctx.lineWidth = w;
        ctx.stroke();
    }
    ctx.lineR = (x1, y1, x2, y2, c, w, r) => {
        for (var i = 0; i < r; i += 1)
            ctx.line(x1, y1, x2, y2, c, w / Math.pow(2, i));
    }



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
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = '#AA0000';
        ctx.fillRect(256, 0, 256, 256);
        ctx.fillStyle = '#880000';
        ctx.fillRect(0, 256, 256, 256);
        ctx.fillStyle = '#330000';
        ctx.fillRect(256, 256, 256, 256);
    }, 0, 100),
    frame: makeCanvasTexture((ctx) => {
        ctx.fillStyle = '#000088';
        ctx.fillRect(20, 20, 512 - 40, 512 - 40);
    }, '#2222FF', 10),

    wood: makeCanvasTexture((ctx) => {
        ctx.lineR(-100, 156, 356, 612, "#0008", 100, 4);
        ctx.lineR(156, -100, 612, 356, "#0008", 100, 4);
    }, "#FFF", 5),
    text: (title, line1 = '', line2 = '', line3 = '', bg = "#000", fg = "#FFF") => {
        return makeCanvasTexture((ctx) => {
            ctx.font = "100px sans-serif";     // Font size and family
            ctx.fillStyle = fg;     // Text color
            ctx.textAlign = "center";   // horizontal alignment
            ctx.textBaseline = "middle"; // vertical alignment

            // Draw the text
            ctx.fillText(title, 256, 100);
            ctx.font = "80px sans-serif";     // Font size and family
            ctx.fillText(line1, 256, 220);
            ctx.fillText(line2, 256, 320);
            ctx.fillText(line3, 256, 420);

        }, bg, 1)
    }

}