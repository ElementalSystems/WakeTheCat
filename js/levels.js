import * as THREE from 'three';
import { textures } from './textures.js';
import { objF } from './objects.js';

/* angles and points
| Point | Angle (radians) | Coordinates (x, y) |
| ----- | --------------- | ------------------ |
| 1     | 0.00            | (17.00, 0.00)      |
| 2     | 0.79 ($\pi/4$)  | (12.02, 12.02)     |
| 3     | 1.57 ($\pi/2$)  | (0.00, 17.00)      |
| 4     | 2.36 ($3\pi/4$) | (-12.02, 12.02)    |
| 5     | 3.14 ($\pi$)    | (-17.00, 0.00)     |
| 6     | 3.93 ($5\pi/4$) | (-12.02, -12.02)   |
| 7     | 4.71 ($3\pi/2$) | (0.00, -17.00)     |
| 8     | 5.50 ($7\pi/4$) | (12.02, -12.02)    |

*/

export const levF = {
    start: () => ({
        obj: [
            { n: 'n1', g: objF.needle(5), p: { x: 0, y: 5 }, },
            //lev 1
            { n: 'cat1', g: objF.cat(null, "#FFE", "#48F"), p: { z: 17, y: 1, sx: .6, sy: .8, sz: .3 }, r: [{ st: 0, con: [], res: 101 }] },
            { n: 'p1', g: objF.plat(10), p: { parent: 'cat1', x: 0, z: 0, y: -1, add: { passDown: true } } },
            { n: 's1', g: objF.sign("1. Snowy", "sweet kitten", "will teach", "you the game"), p: { parent: 'cat1', y: -3, z: -4, add: { passDown: true } } },
            //lev 2
            { n: 'cat2', g: objF.cat(textures.tabby(), "#666", "#48F"), p: { z: 12, x: 12, y: 2, ry: .79 }, r: [{ st: 0, con: [], res: 102 }] },
            { n: 'p2', g: objF.plat(10), p: { parent: 'cat2', x: 0, z: 0, y: -1, add: { passDown: true } } },
            { n: 's2', g: objF.sign("2. Smoke", "gear wheels", "to wake", "this guy"), p: { parent: 'cat2', y: -3, z: -4, add: { passDown: true } } },
            //lev 3
            { n: 'cat3', g: objF.cat(textures.tabby(), "#FA0", "#0F0"), p: { z: 0, x: 17, y: 3, ry: 1.57 }, r: [{ st: 0, con: [], res: 103 }] },
            { n: 'p3', g: objF.plat(10), p: { parent: 'cat3', x: 0, z: 0, y: -1, add: { passDown: true } } },
            { n: 's3', g: objF.sign("3. Jack", "a combo", "lock", "protects him"), p: { parent: 'cat3', y: -3, z: -4, add: { passDown: true } } },
            //lev 4
            { n: 'cat4', g: objF.cat(textures.tabby("#FFF6", "#000"), "#FA0", "#0F0"), p: { z: -12, x: 12, y: 4, ry: 2.36 }, r: [{ st: 0, con: [], res: 104 }] },
            { n: 'p4', g: objF.plat(10), p: { parent: 'cat4', x: 0, z: 0, y: -1, add: { passDown: true } } },
            { n: 's4', g: objF.sign("4. Tiger", "giant tom", "will show", "the press"), p: { parent: 'cat4', y: -3, z: -4, add: { passDown: true } } },
            //lev 5
            { n: 'cat5', g: objF.cat(textures.tabby(), "#FA0", "#0F0"), p: { z: -17, x: 0, y: 5, ry: 3.14 }, r: [{ st: 0, con: [], res: 105 }] },
            { n: 'p5', g: objF.plat(10), p: { parent: 'cat5', x: 0, z: 0, y: -1, add: { passDown: true } } },
            { n: 's5', g: objF.sign("5. Snowy", "sweet kitten", "will teach", "you the game"), p: { parent: 'cat5', y: -3, z: -4, add: { passDown: true } } },

        ]
    }),
    test: () => ({
        music: { t: [0, 2, 4, 7, 9], o: [2, 3, 3, 3, 4], d: [10, 20, 25], vs: .1, ve: .5, gs: .2, ge: 1 },
        obj: [
            {
                n: 'n1', g: objF.needle(), p: { x: 10, y: 16 },
                r: [{ st: 1, con: [{ o: 'n2', st: 0 }], res: .3 }]
            },
            {
                n: 'n2', g: objF.needle(), p: { x: 10, y: 8, rx: 3.14 / 2 },
                r: [{ st: 0, con: [{ o: 'n1', st: 1 }], res: .48 },]
            },
            { n: 'n4', g: objF.needle(), p: { y: 5 } },
            { n: 'b1', g: objF.basket(), p: { parent: 'n4', y: 5, add: { passDown: true } } },
            { n: 'w1', g: objF.wheel(), p: { x: -13, y: 1, z: 0 } },
            { n: 'p1', g: objF.press(), p: { parent: 'w1', x: 0, y: 3 } },
            { n: 'p2', g: objF.press(), p: { parent: 'p1', y: 5, rx: 3.14 / 2 } },
            { n: 'p3', g: objF.press(), p: { parent: 'p2', y: 5, rz: -3.14 / 2 } },
            { n: 'w2', g: objF.wheel(), p: { x: 13, y: 1, z: 10 } },
            { n: 'b2', g: objF.basket(), p: { parent: 'w2', z: 9, y: 1, add: { passDown: true } } },
            { n: 's1', g: objF.sign("✔Snowy✔", "Trusting little", "kitten", "easy to scare"), p: { x: 0, z: -7, ry: 3.14, s: .6 } },
            { n: 's2', g: objF.sign("Midnight", "", "Skittish", "sleeps safe"), p: { parent: 'w2', x: 0, z: -6, ry: 3.14 } },
            { n: 'cat', g: objF.cat(textures.blochy("#A80A", "#F82A", "#000A", 5), "#FFF", "#0F0"), p: { z: 15, y: 2 } },
            { n: 'cat2', g: objF.cat(), p: { parent: 'b2', y: 1 } },
            { n: 'cat3', g: objF.cat(textures.blochy("#000", null, null, 3), "#FFF"), p: { x: -5, z: 15, y: 10 } },
            { n: 'cat4', g: objF.cat(textures.tabby("#0004", "#FFF"), "#A80"), p: { x: 5, z: 15, y: 10 } },
            { n: 's1', g: objF.plat(), p: { x: 5, z: 10, y: 15 } },
            { n: 'cat5', g: objF.cat(textures.tabby("#0004", "#FFF"), "#CCC"), p: { parent: 's1', y: 1 } },
            { n: 'gr1', g: objF.gRing(4), p: { parent: 'w1', x: -6, y: 4, add: { passDown: true } } },
            { n: 'n4', g: objF.needle(), p: { parent: 'gr1', z: 4.5, y: 0, rx: 3.14 / 2 } },
            { n: 'h4', g: objF.hinge(), p: { z: 20, y: 3, x: -5 } },
            { n: 'h5', g: objF.hinge(), p: { parent: 'h4', y: 4, ry: 3.14 / 2, x: 1.2, z: 1.2 } },
            { n: 's3', g: objF.sign("HELLO!"), p: { parent: 'h5', y: 1, x: 1, s: .5 } },

        ]
    }),
    1: () => ({
        obj: [
            { n: 's1', g: objF.plat(5), p: { y: 5, ry: 1.5 } },
            { n: 'cat', g: objF.cat(null, "#FFE", "#48F"), p: { parent: 's1', y: 1, ry: -1 } },
            {
                n: 'n1', g: objF.needle(), p: { x: -13, y: 6, rz: 3.14 / 2 },
                r: [{ st: 1, con: [{ o: 'n2', st: 0 }], res: .3 },
                { st: 1, con: [{ o: 'n2', st: 1 }], res: 10 }],
            },
            {
                n: 'n2', g: objF.needle(), p: { x: -5, y: 6, rz: 3.14 },
            },
        ], irx: .4, iry: .64
    }),
    2: () => ({
        obj: [
            { n: 'w1', g: objF.wheel(), p: { y: 2, x: -1 } },
            { n: 'b1', g: objF.basket(), p: { parent: "w1", y: 2, ry: 2.5, add: { passDown: true } } },
            { n: 'cat', g: objF.cat(textures.tabby(), "#666", "#48F"), p: { parent: 'b1', y: 1, x: 1, ry: -4 } },
            {
                n: 'w2', g: objF.wheel(), p: { x: 11, y: 11, rx: -3.14 / 2, z: 3 },
                r: [
                    { st: 1, con: [{ o: 'n1', st: 1 }], res: .75 },
                    { st: 3, con: [{ o: 'n1', st: 0 }], res: .1 },
                ]
            },
            { n: 'gr1', g: objF.gRing(2), p: { parent: 'w2', x: 5.5, y: 3, add: { passDown: true } } },
            {
                n: 'n1', g: objF.needle(), p: { parent: 'gr1', z: 4.2, rx: 3.14 / 2 },
                r: [
                    { st: 1, con: [{ o: 'w2', st: 1 }, { o: 'w1', st: [0, 1, 3] }], res: .9 },
                    { st: 1, con: [{ o: 'w2', st: 1 }, { o: 'w1', st: 2 }], res: 10 },
                ]
            },
        ], irx: .52, iry: 3.16
    }),
    3: () => ({
        obj: [
            { n: 's1', g: objF.plat(16), p: { y: 5.5 } },
            { n: 'cat', g: objF.cat(textures.tabby(), "#FA0", "#0F0"), p: { parent: 's1', y: 1, x: 2, ry: -1 } },
            {
                n: 'n1', g: objF.needle(10), p: { x: 22, y: 7, rz: -3.14 / 2 },
                r: [
                    { st: 1, con: [{ o: 'w3', st: 0 }], res: .25 },
                    { st: 1, con: [{ o: 'w2', st: 0 }], res: .5 },
                    { st: 1, con: [{ o: 'w1', st: 0 }], res: .75 },
                    { st: 1, con: [{ o: 'w1', st: 1 }], res: 10 },

                ]
            },
            {
                n: 'w1', g: objF.wheel(), p: { x: 6, y: 10, rz: 3.14 / 2, rx: - 3.14 / 6 },
                r: [
                    { st: 1, con: [{ o: 'n3', st: 0 }], res: .25 },
                    { st: 1, con: [{ o: 'n2', st: 1 }], res: .08 },
                    { st: 1, con: [{ o: 'n4', st: 1 }], res: .9 },
                    { st: 3, con: [{ o: 'n4', st: 1 }], res: .3 },
                    { st: 4, con: [{ o: 'n4', st: 1 }], res: .6 },
                ]

            },
            {
                n: 'w2', g: objF.wheel(), p: { x: 9, y: 10, rz: -3.14 / 2, rx: - 3.14 / 6 },
                r: [
                    { st: 1, con: [{ o: 'n4', st: 1 }], res: .25 },
                    { st: 2, con: [{ o: 'n4', st: 1 }], res: .55 },
                    { st: 3, con: [{ o: 'n4', st: 1 }], res: .9 },
                    { st: 4, con: [{ o: 'n2', st: [0, 1] }], res: .7 },
                ]

            },
            {
                n: 'w3', g: objF.wheel(), p: { x: 12, y: 10, rz: 3.14 / 2, rx: -3.14 / 6 },
                r: [
                    { st: 1, con: [{ o: 'n2', st: 0 }], res: .08 },
                    { st: 1, con: [{ o: 'n3', st: 1 }], res: .25 },

                ]
            },
            { n: 'n2', g: objF.needle(2), p: { x: 11.5, y: 15, z: 6, rz: -3.14 / 2 } },
            { n: 'n3', g: objF.needle(2), p: { x: 6, y: 17, z: 5, rz: 3.14 / 2 } },
            {
                n: 'n4', g: objF.needle(6), p: { x: -1.5, y: 10, z: 3, rz: 3.14 / 2, is: 1 },
                r: [
                    { st: 1, con: [{ o: 'w1', st: 1 }], res: .1 },
                    { st: 1, con: [{ o: 'w2', st: 3 }], res: .55 },
                ]
            },

        ]
    }),

    4: () => ({
        obj: [

            { n: 's1', g: objF.plat(11), p: { y: 11.5, x: -1 } },
            { n: 'cat', g: objF.cat(textures.tabby("#FFF6", "#000"), "#FA0", "#0F0"), p: { parent: 's1', y: 1, ry: 1 } },
            {
                n: 'p1', g: objF.press(), p: { y: 2, x: 9 },
                r: [
                    { st: 1, con: [{ o: 'n3', st: 0 }], res: .65 },
                    { st: 2, con: [{ o: 'n2', st: 0 }], res: .30 },
                    { st: 2, con: [{ o: 'n1', st: 1 }], res: .4 },
                ]
            },
            { n: 'gr1', g: objF.gRing(1), p: { parent: 'p1', z: 1, y: 4.5, ry: 3.14 / 2, add: { passDown: true } } },
            { n: 'gr2', g: objF.gRing(1), p: { parent: 'p1', z: -1, y: 4.5, ry: 3.14 / 2, add: { passDown: true } } },
            {
                n: 'n1', g: objF.needle(), p: { parent: 'gr1', z: 4.2, rx: 3.14 / 2 },
                r: [{ st: 1, con: [{ o: 'p1', st: 2 }], res: 10 }]
            },
            {
                n: 'n2', g: objF.needle(), p: { parent: 'gr2', z: -4.8, rx: -3.14 / 2 },
            },
            {
                n: 'n3', g: objF.needle(), p: { x: 9, y: 13, rx: -3.14 },
                r: [
                    { st: 0, con: [{ o: 'p1', st: 1 }], res: .85 },
                    { st: 0, con: [{ o: 'p1', st: 2 }], res: .4 }]
            },

        ]
    }),
    5: () => ({
        ixr: 0,
        iyr: 0.26,
        obj: [

            { n: 'b1', g: objF.basket(), p: { y: 14, x: -5, ry: -3.14 / 2 } },
            { n: 'cat', g: objF.cat(textures.tabby(), "#FA0", "#0F0"), p: { parent: 'b1', y: 1, ry: 2 } },
            {
                n: 'p1', g: objF.press(), p: { y: 0.5, x: 5 },
                r: [
                    { st: 1, con: [{ o: 'p3', st: [1, 2] }], res: .25 },
                    { st: 0, con: [{ o: 'p3', st: 1 }], res: .65 },
                    { st: 0, con: [{ o: 'p3', st: 2 }], res: 10 },
                ]
            },
            {
                n: 'p2', g: objF.press(), p: { parent: 'p1', y: 5 },
                r: [
                    { st: 1, con: [{ o: 'p3', st: [1, 2] }], res: .25 },
                    { st: 0, con: [{ o: 'p3', st: 1 }], res: .65 },
                    { st: 0, con: [{ o: 'p3', st: 2 }], res: 10 },
                ]
            },
            {
                n: 'p3', g: objF.press(), p: { parent: 'p2', y: 5, rz: 3.14 / 2, is: 2 },
                r: [
                    { st: 1, con: [{ o: 'p1', st: [1, 2] }, { o: 'p2', st: [0, 1] }], res: .2 },
                    { st: 1, con: [{ o: 'p1', st: [0, 1] }, { o: 'p2', st: [1, 2] }], res: .2 },
                ]
            },
            { n: 'gr', g: objF.gRing(5), p: { parent: 'p3', x: 1, y: 3.7, rx: 3.14 / 2, rz: -3.14 / 2 }, },
            { n: 'gr2', g: objF.gRing(5), p: { parent: 'p3', x: 1, y: 4.2, rx: 3.14 / 2, rz: -3.14 / 2 }, },

        ]
    }),
    6: () => ({
        irx: .3,
        iry: -.7,
        obj: [
            { n: 'b1', g: objF.basket(), p: { y: 1, x: -4, ry: -3.14 / 4 } },
            { n: 'cat', g: objF.cat(textures.tabby(), "#FA0", "#0F0"), p: { parent: 'b1', y: 1, ry: 2 } },
            {
                n: 'h1', g: objF.hinge(), p: { x: 6, y: 2, },
                r: [
                    { st: 1, con: [{ o: 'h2', st: 0, }], res: .07 },
                    { st: 1, con: [{ o: 'h2', st: 1, }], res: 10 },
                ]
            },
            { n: 's1', g: objF.sign("Don't", "let", "sleeping cats", "lie"), p: { parent: 'h1', x: 1.5, y: 2.5, }, },
            {
                n: 'h2', g: objF.hinge(), p: { x: 3, y: 2, z: 3, ry: 3.14 / 2 },
                r: [
                    { st: 1, con: [{ o: 'h3', st: 0 }], res: .18 },
                    { st: 0, con: [{ o: 'h3', st: 0 }], res: .3 },
                ]
            },
            { n: 's2', g: objF.sign("PROTECT", "", "and serve ", "the cats"), p: { parent: 'h2', x: 1.5, y: 2.5, }, },
            { n: 'h3', g: objF.hinge(), p: { x: -1, y: 2, z: 8, }, },
            { n: 's3', g: objF.sign("PROTECT", "", "and serve ", "the cats"), p: { parent: 'h3', x: 1.5, y: 2.5, }, },

        ]
    }),
    6: () => ({
        irx: .3,
        iry: -.7,
        obj: [
            { n: 'b1', g: objF.basket(), p: { y: 1, x: -4, ry: -3.14 / 4 } },
            { n: 'cat', g: objF.cat(textures.tabby(), "#FA0", "#0F0"), p: { parent: 'b1', y: 1, ry: 2 } },
            {
                n: 'h1', g: objF.hinge(), p: { x: 6, y: 2, },
                r: [
                    { st: 1, con: [{ o: 'h2', st: 0, }], res: .07 },
                    { st: 1, con: [{ o: 'h2', st: 1, }], res: 10 },
                ]
            },
            { n: 's1', g: objF.sign("Don't", "let", "sleeping cats", "lie"), p: { parent: 'h1', x: 1.5, y: 2.5, }, },
            {
                n: 'h2', g: objF.hinge(), p: { x: 3, y: 2, z: 3, ry: 3.14 / 2 },
                r: [
                    { st: 1, con: [{ o: 'h3', st: 0 }], res: .18 },
                    { st: 0, con: [{ o: 'h3', st: 0 }], res: .3 },
                ]
            },
            { n: 's2', g: objF.sign("PROTECT", "", "and serve ", "the cats"), p: { parent: 'h2', x: 1.5, y: 2.5, }, },
            { n: 'h3', g: objF.hinge(), p: { x: -1, y: 2, z: 8, }, },
            { n: 's3', g: objF.sign("PROTECT", "", "and serve ", "the cats"), p: { parent: 'h3', x: 1.5, y: 2.5, }, },

        ]
    }),
    6: () => ({
        irx: .3,
        iry: -.7,
        obj: [
            { n: 'b1', g: objF.basket(), p: { y: 1, x: -4, ry: -3.14 / 4 } },
            { n: 'cat', g: objF.cat(textures.tabby(), "#FA0", "#0F0"), p: { parent: 'b1', y: 1, ry: 2 } },
            {
                n: 'h1', g: objF.hinge(), p: { x: 6, y: 2, },
                r: [
                    { st: 1, con: [{ o: 'h2', st: 0, }], res: .07 },
                    { st: 1, con: [{ o: 'h2', st: 1, }], res: 10 },
                ]
            },
            { n: 's1', g: objF.sign("Don't", "let", "sleeping cats", "lie"), p: { parent: 'h1', x: 1.5, y: 2.5, }, },
            {
                n: 'h2', g: objF.hinge(), p: { x: 3, y: 2, z: 3, ry: 3.14 / 2 },
                r: [
                    { st: 1, con: [{ o: 'h3', st: 0 }], res: .18 },
                    { st: 0, con: [{ o: 'h3', st: 0 }], res: .3 },
                ]
            },
            { n: 's2', g: objF.sign("PROTECT", "", "and serve ", "the cats"), p: { parent: 'h2', x: 1.5, y: 2.5, }, },
            { n: 'h3', g: objF.hinge(), p: { x: -1, y: 2, z: 8, }, },
            { n: 's3', g: objF.sign("PROTECT", "", "and serve ", "the cats"), p: { parent: 'h3', x: 1.5, y: 2.5, }, },

        ]
    }),
    7: () => ({
        irx: .4,
        iry: .4,
        obj: [

            {
                n: 'w1', g: objF.wheel(), p: { x: 3, y: 1 },
                r: [
                    { st: 1, con: [{ o: 'n1', st: 1 }, { o: 'w2', st: 3 }], res: .27 },
                    { st: 2, con: [{ o: 'n1', st: 1 }, { o: 'w2', st: 3 }], res: .65 },
                    { st: 3, con: [{ o: 'n1', st: 1 }, { o: 'w2', st: 3 }], res: .65 },
                    { st: 4, con: [{ o: 'n1', st: 1 }, { o: 'w2', st: 3 }], res: .65 },

                ]
            },
            { n: 'b1', g: objF.basket(), p: { parent: 'w1', y: 1.5, x: 9, ry: 3.14, add: { passDown: true } } },
            { n: 'b2', g: objF.basket(), p: { parent: 'w1', y: 1.5, x: -9, add: { passDown: true } } },
            { n: 'cat', g: objF.cat(textures.tabby(), "#FA0", "#0F0"), p: { parent: 'b1', y: 1, ry: 2 } },

            {
                n: 'w2', g: objF.wheel(), p: { y: 12, x: -15 },
                r: [
                    { st: 3, con: [{ o: 'n1', st: 1 }, { o: 'w1', st: [0, 2] }], res: .6 },
                    { st: 4, con: [{ o: 'n1', st: 1 }, { o: 'w1', st: 0 }], res: .32 },
                ]
            },
            { n: 'gr', g: objF.gRing(2), p: { parent: 'w2', z: -8, rx: -3.14 / 2 } },
            {
                n: 'n1', g: objF.needle(), p: { parent: 'gr', rx: 3.14 / 2, z: 5, is: 1 },
                r: [
                    { st: 1, con: [{ o: 'w1', st: 2 }, { o: 'w2', st: 3 }], res: 10 }
                ]
            },


        ]

    }),



};