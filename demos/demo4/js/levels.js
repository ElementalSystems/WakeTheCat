import * as THREE from 'three';
import { textures } from './textures.js';
import { objF } from './objects.js';


export const levF = {
    test: () => [
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
        { n: 'p1', g: objF.press(), p: { parent: 'w1', x: 0, y: 2 } },
        { n: 'p2', g: objF.press(), p: { parent: 'p1', y: 5, rx: 3.14 / 2 } },
        { n: 'p3', g: objF.press(), p: { parent: 'p2', y: 5, rz: -3.14 / 2 } },
        { n: 'w2', g: objF.wheel(), p: { x: 13, y: 1, z: 10 } },
        { n: 'b2', g: objF.basket(), p: { parent: 'w2', z: 9, y: 1, add: { passDown: true } } },
        { n: 's1', g: objF.sign("Snowflake", "Trusting little", "kitten", "easy to scare"), p: { x: 0, z: -7, ry: 3.14 } },
        { n: 's2', g: objF.sign("Midnight", "", "Skittish", "sleeps safe"), p: { parent: 'w2', x: 0, z: -6, ry: 3.14 } },
        { n: 'cat', g: objF.cat(textures.blochy("#A80A", "#F82A", "#000A", 5), "#FFF", "#0F0"), p: { z: 15, y: 2 } },
        { n: 'cat2', g: objF.cat(), p: { parent: 'b2', y: 1 } },
        { n: 'cat3', g: objF.cat(textures.blochy("#000", null, null, 3), "#FFF"), p: { x: -5, z: 15, y: 10 } },
        { n: 'cat4', g: objF.cat(textures.tabby("#0004", "#FFF"), "#A80"), p: { x: 5, z: 15, y: 10 } },
        { n: 's1', g: objF.plat(), p: { x: 5, z: 10, y: 15 } },
        { n: 'cat5', g: objF.cat(textures.tabby("#0004", "#FFF"), "#CCC"), p: { parent: 's1', y: 1 } },

    ],
    l1: () => [
        { n: 's1', g: objF.plat(5), p: { y: 5, ry: 1.5 } },
        { n: 'cat5', g: objF.cat(null, "#FFC", "#48F"), p: { parent: 's1', y: 1, ry: -1 } },
        {
            n: 'n1', g: objF.needle(), p: { x: -13, y: 6, rz: 3.14 / 2 },
            r: [{ st: 1, con: [{ o: 'n2', st: 0 }], res: .3 },
            { st: 1, con: [{ o: 'n2', st: 1 }], res: 10 }],
        },
        {
            n: 'n2', g: objF.needle(), p: { x: -5, y: 6, rz: 3.14 },
        },


    ]

};