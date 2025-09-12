import * as THREE from 'three'
import { ranR } from './util.js'

function makeCanvasTexture(drawFunc, bg = 0, repeat = 1, mirror = true) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 512);
    ctx.line = (x1, y1, x2, y2, c, w) => {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = c;
        ctx.lineWidth = w;
        ctx.stroke();
    }
    ctx.lineR = (x1, y1, x2, y2, c, w, r) => {
        for (var i = 0; i < r; i += 1)
            ctx.line(x1, y1, x2, y2, c, w / Math.pow(1.5, i));
    }
    ctx.ell = (x, y, rx, ry, c) => {
        ctx.beginPath();
        ctx.fillStyle = c;
        ctx.ellipse(x, y, rx, ry, 0, 0, 3.14 * 2);
        ctx.fill();
    }
    ctx.ellR = (x, y, rx, ry, c, r) => {
        for (var i = 0; i < r; i += 1)
            ctx.ell(x, y, rx / Math.pow(1.5, i), ry / Math.pow(1.5, i), c)
    }

    drawFunc(ctx);

    var texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = mirror ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
    texture.wrapT = mirror ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
    texture.repeat.set(repeat, repeat);
    return texture;
}

export const textures = {
    /* squares: () => makeCanvasTexture((ctx) => {
         ctx.fillStyle = '#ff0000';
         ctx.fillRect(0, 0, 256, 256);
         ctx.fillStyle = '#AA0000';
         ctx.fillRect(256, 0, 256, 256);
         ctx.fillStyle = '#880000';
         ctx.fillRect(0, 256, 256, 256);
         ctx.fillStyle = '#330000';
         ctx.fillRect(256, 256, 256, 256);
     }, 0, 100),*/
    lines: (rep = 5) => makeCanvasTexture((ctx) => {
        ctx.lineR(0, 256, 512, 256, "#0004", 100, 8)
    }, "#FFF", rep),
    dimple: (rep = 5) => makeCanvasTexture((ctx) => {
        ctx.ellR(256, 256, 128, 128, "#0004", 8)
    }, "#FFF", rep),
    /*  weave: (rep = 5) => makeCanvasTexture((ctx) => {
          ctx.lineR(0, 128, 512, 128, "#FFFFFF05", 200, 5);
          ctx.lineR(128, 0, 128, 512, "#FFFFFF05", 200, 5);
          ctx.lineR(0, 256 + 128, 512, 256 + 128, "#FFFFFF05", 200, 5);
          ctx.lineR(256 + 128, 0, 256 + 128, 512, "#FFFFFF05", 200, 5);
  
      }, "#000", rep, true),*/

    frame: () => makeCanvasTexture((ctx) => {
        ctx.fillStyle = '#000088';
        ctx.fillRect(20, 20, 512 - 40, 512 - 40);
    }, '#2222FF', 10),
    fur: () => makeCanvasTexture((ctx) => {
        for (let y = 0; y < 500; y += ranR(40, 80))
            for (let x = 0; x < 512; x += ranR(1, 5)) {
                ctx.line(x, y + ranR(-20, 20), x + ranR(-15, 15), y + ranR(50, 120), "#FFF4", ranR(1, 5));
            }
    }, '#000', 1),
    wood: (rep = 5) => makeCanvasTexture((ctx) => {
        for (let i = 0; i < 500; i += 1) {
            var x = ranR(-200, 712);
            var y = ranR(0, 512);
            ctx.line(x, y, x + ranR(50, 300), y, "#0004", ranR(1, 5));
        }
    }, '#FFF', rep, true),
    eye: () => makeCanvasTexture(
        (ctx) => {
            ctx.fillStyle = "#000"
            ctx.ellipse(256, 256, 30, 160, 0, 0, 314 * 2);
            ctx.fill();
        }
        , '#FFF'),
    blochy: (c1, c2, c3, r = 1) => makeCanvasTexture(
        (ctx) => {
            for (var i = 0; i < r; i += 1) {
                ctx.ell(ranR(0, 512), ranR(0, 512), ranR(30, 200), ranR(30, 200), c1);
                if (c2) ctx.ell(ranR(0, 512), ranR(0, 512), ranR(30, 100), ranR(30, 100), c2);
                if (c3) ctx.ell(ranR(0, 512), ranR(0, 512), ranR(30, 100), ranR(30, 100), c3);
            }
        }, "#FFF", 2
    ),
    tabby: (c = "#0004", bg = "#FFF") => makeCanvasTexture(
        (ctx) => {
            for (let y = -400; y < 800; y += 120) {
                ctx.lineR(0, y + 256, 256, y + 0, c, 64, 5);
                ctx.lineR(256, y, 512, y + 256, c, 64, 5);
            }
        }, bg, 2, true
    ),
    pitted: (r = 4, rep = 1) => makeCanvasTexture(
        (ctx) => {
            for (let i = 0; i < 50; i += 1) {
                ctx.ellR(ranR(0, 512), ranR(0, 512), ranR(30, 100), ranR(30, 100), "#0004", 4);
            }
        }, "#fff", rep, true
    ),
    arrow: () => makeCanvasTexture(
        (ctx) => {
            ctx.line(256, 50, 256, 400, "#000", 50);
            ctx.line(256, 50, 50, 200, "#000", 50);
            ctx.line(256, 50, 512 - 50, 200, "#000", 50);

        }, "#fff"
    ),
    diag: () => makeCanvasTexture((ctx) => {
        ctx.lineR(-100, 156, 356, 612, "#0008", 100, 4);
        ctx.lineR(156, -100, 612, 356, "#0008", 100, 4);
    }, "#FFF", 5, false),
    text: (title, line1 = '', line2 = '', line3 = '', bg = "#000", fg = "#FFF") => {
        return makeCanvasTexture((ctx) => {
            ctx.font = "90px sans-serif";     // Font size and family
            ctx.fillStyle = fg;     // Text color
            ctx.textAlign = "center";   // horizontal alignment
            ctx.textBaseline = "middle"; // vertical alignment

            // Draw the text
            ctx.fillText(title, 256, 100);
            ctx.font = "80px sans-serif";     // Font size and family
            ctx.fillText(line1, 256, 220);
            ctx.fillText(line2, 256, 320);
            ctx.fillText(line3, 256, 420);

        }, bg)
    }

}