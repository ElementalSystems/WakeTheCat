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
        { n: 'p1', g: objF.press(), p: { parent: 'w1', x: 0, y: 3 } },
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
        { n: 'gr1', g: objF.gRing(4), p: { parent: 'w1', x: -6, y: 4, add: { passDown: true } } },
        { n: 'n4', g: objF.needle(), p: { parent: 'gr1', z: 4.5, y: 0, rx: 3.14 / 2 } },
    ],
    l1: () => [
        { n: 's1', g: objF.plat(5), p: { y: 5, ry: 1.5 } },
        { n: 'cat', g: objF.cat(null, "#FFC", "#48F"), p: { parent: 's1', y: 1, ry: -1 } },
        {
            n: 'n1', g: objF.needle(), p: { x: -13, y: 6, rz: 3.14 / 2 },
            r: [{ st: 1, con: [{ o: 'n2', st: 0 }], res: .3 },
            { st: 1, con: [{ o: 'n2', st: 1 }], res: 10 }],
        },
        {
            n: 'n2', g: objF.needle(), p: { x: -5, y: 6, rz: 3.14 },
        },
    ],
    l2: () => [

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
            n: 'n1', g: objF.needle(1), p: { parent: 'gr1', z: 4.2, rx: 3.14 / 2 },
            r: [
                { st: 1, con: [{ o: 'w2', st: 1 }, { o: 'w1', st: [0, 1, 3] }], res: .9 },
                { st: 1, con: [{ o: 'w2', st: 1 }, { o: 'w1', st: 2 }], res: 10 },
            ]
        },


    ],
    l3: () => [
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

    ],
    l3x: () => [
        { n: 'w1', g: objF.wheel(), p: { y: 2 } },
        { n: 's1', g: objF.plat(16), p: { parent: 'w1', y: 5, add: { passDown: true } } },
        { n: 's2', g: objF.plat(12), p: { parent: 'w1', y: 9, x: 4, z: 4, add: { passDown: true } } },
        { n: 's3', g: objF.plat(12), p: { parent: 'w1', y: 9, x: -4, z: -4, add: { passDown: true } } },
        { n: 'cat', g: objF.cat(textures.tabby(), "#FA0", "#0F0"), p: { parent: 's1', y: 1, x: 2, ry: 3 } },

        { n: 'n1', g: objF.needle(), p: { x: -7, y: 18, z: -3, is: 1 } },

        { n: 'w2', g: objF.wheel(), p: { parent: 'n1', y: 3, ry: 3.14 / 8 } },
    ],

    l4: () => [

        { n: 's1', g: objF.plat(11), p: { y: 11.5, x: -1 } },
        { n: 'cat', g: objF.cat(textures.tabby(), "#FA0", "#0F0"), p: { parent: 's1', y: 1, ry: 1 } },
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

    ],
    l5: () => [

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
        { n: 'gr', g: objF.gRing(5), p: { parent: 'p3', x: 1, y: 3.7, rx: 3.14 / 2, rz: -3.14 / 2, is: 2 }, },
        { n: 'gr2', g: objF.gRing(5), p: { parent: 'p3', x: 1, y: 4.2, rx: 3.14 / 2, rz: -3.14 / 2, is: 2 }, },

    ]



};