import * as THREE from 'three';
import { textures } from './textures.js';
import { objF, cat } from './objects.js';
import { inter, getFIL } from './util.js'


const mkLevP = (l) =>
({
    x: (21 - l / 2.4) * Math.sin(l * 3.14 / 6), z: (21 - l / 2.4) * Math.cos(l * 3.14 / 6), y: l + 1, ry: l * 3.14 / 6, add: { passDown: false }
});

const mkL = (l, t1, t2, t3, t4) => {

    return (
        [
            cat(l,
                { x: (21 - l / 2.4) * Math.sin(l * 3.14 / 6), z: (21 - l / 2.4) * Math.cos(l * 3.14 / 6), y: l + 1, ry: l * 3.14 / 6, add: { passDown: false } },
                [{ st: 1, con: [], res: 100 + l }], true),
            { n: 'p' + l, g: objF.plat(10), p: { parent: 'cat' + l, x: 0, z: 0, y: -1 } },
            { n: 's' + l, g: objF.sign(t1, t2, t3, t4), p: { parent: 'cat' + l, y: -3, z: -4 } },
        ]
    )
}

export const levF = {
    start: () => ({
        irx: inter(getFIL() / 13, 0, .7),
        iry: -getFIL() / 6 * 3.14,
        obj: [
            ...mkL(0, "1 Snowy", "loves her", "knitting", "needles"),
            ...mkL(1, "2 Tigress", "a free", "wheeling", "queen"),
            ...mkL(2, "3 Minx", "", "innocent and", "so fluffy"),
            ...mkL(3, "4 Spot", "feels safe ", "at", "altitude"),
            ...mkL(4, "5 Inked", "a sign ", "of our", "times"),
            ...mkL(5, "6 Splat", "feels safe ", "when he's", "high"),
            ...mkL(6, "7 Gambit", "", "built", "a lock"),
            ...mkL(7, "8 Ginger", "", "is safe in", "a box"),
            ...mkL(8, "9 Jack", "the old man", "stays under", "cover"),
            ...mkL(9, "10 Rogue", "", "has become", "unhinged"),
            ...mkL(10, "11 Thomas", "", "the engineer", ""),
            ...mkL(11, "12 Cy", "built", "a robot", "arm"),
            ...mkL(12, "13 Midnight", "needs to", "be brought", "down"),
        ]
    }),
    /*
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
            { n: 'w2', g: objF.wheel(), p: { x: 13, y: 10, z: 10 } },
            { n: 'b2', g: objF.basket(), p: { parent: 'w2', z: 9, y: 1, add: { passDown: true } } },
            { n: 's1', g: objF.sign("✔Snowy✔", "Trusting little", "kitten", "easy to scare"), p: { x: 0, z: -7, ry: 3.14, s: .6 } },
            { n: 's2', g: objF.sign("Midnight", "", "Skittish", "sleeps safe"), p: { parent: 'w2', x: 0, z: -6, ry: 3.14 } },
            cat(5, { z: 15, y: 1 }),
            { n: 'cat2', g: objF.cat(), p: { parent: 'b2', y: 1 } },
            { n: 'cat3', g: objF.cat(textures.blochy("#000", null, null, 3), "#FFF"), p: { x: -5, z: 15, y: 1, is: 1 } },
            { n: 'cat4', g: objF.cat(textures.tabby("#0004", "#FFF"), "#A80"), p: { x: 5, z: 15, y: 1, is: 2 } },
            { n: 's1', g: objF.plat(), p: { x: 5, z: 10, y: 15 } },
            { n: 'cat5', g: objF.cat(textures.tabby("#0004", "#FFF"), "#CCC"), p: { parent: 's1', y: 1 } },
            { n: 'gr1', g: objF.gRing(4), p: { parent: 'w1', x: -6, y: 4, add: { passDown: true } } },
            { n: 'n4', g: objF.needle(), p: { parent: 'gr1', z: 4.5, y: 0, rx: 3.14 / 2 } },
            { n: 'h4', g: objF.hinge(), p: { z: -20, y: 3, x: -5 } },
            { n: 'h5', g: objF.hinge(), p: { parent: 'h4', y: 4, ry: 3.14 / 2, x: 1.2, z: 1.2 } },
            { n: 's3', g: objF.sign("HELLO!"), p: { parent: 'h5', y: 1, x: 1, s: .5 } },

        ]
    }),*/
    0: () => ({ //needle teacher
        obj: [
            { n: 's1', g: objF.plat(5), p: { y: 5, ry: 1.5 } },
            cat(0, { parent: 's1', y: .6, ry: -1 }),
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
    1: () => ({ //wheel teacher
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
            { n: 'b1', g: objF.basket(), p: { parent: 'w1', y: 1.5, x: 9, ry: 3.14 } },
            { n: 'b2', g: objF.basket(), p: { parent: 'w1', y: 1.5, x: -9, } },
            cat(1, { parent: 'b1', y: 1, ry: 2 }),

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
    2: () => ({ //easy wheel level
        lev: 2,
        obj: [
            { n: 'w1', g: objF.wheel(), p: { y: 2, x: -1 } },
            { n: 'b1', g: objF.basket(), p: { parent: "w1", y: 2, ry: 2.5, add: { passDown: true } } },
            cat(2, { parent: 'b1', y: 1, x: 1, ry: -4 }),
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
    3: () => ({  //press teacher
        obj: [
            { n: 's1', g: objF.plat(11), p: { y: 11.5, x: -1 } },
            cat(3, { parent: 's1', y: 1, ry: 1 }),
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
    4: () => ({ //hinge teacher
        irx: .3,
        iry: -.7,
        obj: [
            { n: 'b1', g: objF.basket(), p: { y: 1, x: -4, ry: -3.14 / 4 } },
            cat(4, { parent: 'b1', y: 1, ry: 2 }),
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
    5: () => ({ //int hard high presses
        ixr: 0,
        iyr: 0.26,
        obj: [

            { n: 'b1', g: objF.basket(), p: { y: 14, x: -5, ry: -3.14 / 2 } },
            cat(5, { parent: 'b1', y: 1, ry: 2 }),
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
    6: () => ({ //hard combo lock
        obj: [
            { n: 's1', g: objF.plat(16), p: { y: 5.5 } },
            cat(6, { parent: 's1', y: 1, x: 2, ry: -1 }),
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
    7: () => ({ //cat in a box - low - hard
        irx: 0,
        iry: 0,
        obj: [

            { n: 'p1', g: objF.plat(10), p: { y: 8, z: 0 } },
            cat(7, { parent: 'p1', y: 1, x: 0, ry: -1 }),
            {
                n: 'h1', g: objF.hinge(), p: { z: 5, y: 2, },
                r: [
                    { st: 1, con: [{ o: 'h2', st: 0 },], res: .2 },
                    { st: 0, con: [{ o: 'h2', st: 0 },], res: .2 },
                ],
            },
            { n: 's1', g: objF.sign("QUIET", "", "sleeping ", "cat"), p: { parent: 'h1', x: 1.5, y: 1, }, },
            {
                n: 'h2', g: objF.hinge(), p: { x: -5, y: 2, z: 1, ry: -3.14 / 2 },
                r: [
                    { st: 1, con: [{ o: 'h3', st: 0 },], res: .25 },
                    { st: 0, con: [{ o: 'h3', st: 0 },], res: .15 },
                ],
            },
            { n: 's2', g: objF.sign("QUIET", "", "sleeping ", "cat"), p: { parent: 'h2', x: 1.5, y: 1, }, },
            {
                n: 'h3', g: objF.hinge(), p: { x: -1, y: 2, z: -5, ry: -3.14 },
                r: [
                    { st: 1, con: [{ o: 'h4', st: 0 },], res: .25 },
                    { st: 0, con: [{ o: 'h4', st: 0 },], res: .15 },
                ],
            },
            { n: 's3', g: objF.sign("QUIET", "", "sleeping ", "cat"), p: { parent: 'h3', x: 1.5, y: 1, }, },
            {
                n: 'h4', g: objF.hinge(), p: { x: 5, y: 2, z: -1, ry: 3.14 / 2 },
                r: [
                    { st: 1, con: [{ o: 'w1', st: 1 },], res: .69 },
                    { st: 1, con: [{ o: 'w1', st: 2 },], res: .65 },
                ],
            },
            { n: 's4', g: objF.sign("QUIET", "", "sleeping ", "cat"), p: { parent: 'h4', x: 1.5, y: 1, }, },

            //{ n: 'n1', g: objF.needle(), p: { x: 1, y: 6, z: 12, rx: -3.14 / 2 }, },

            {
                n: 'w1', g: objF.wheel(), p: { s: .5, y: 5, x: 1, z: 8, is: 1, rx: -3.14 / 2 },
                r: [
                    { st: 1, con: [{ o: 'h4', st: 1 },], res: .75 },
                ],

            },
            { n: 'gr', g: objF.gRing(1), p: { parent: 'w1', y: 0, x: -4, z: 0, rx: 3.14 / 2, rz: 3.14 / 2 }, },
            {
                n: 'n1', g: objF.needle(), p: { parent: 'gr', z: 4.5, rx: 3.14 / 2 },
                r: [
                    { st: 1, con: [{ o: 'h1', st: 0 }, { o: 'w1', st: 1 },], res: .2 },
                    { st: 1, con: [{ o: 'h1', st: 1 }, { o: 'w1', st: 1 },], res: 10 },
                    { st: 1, con: [{ o: 'w1', st: [0, 2, 3] },], res: .15 },
                ],
            },



        ]

    }),
    8: () => ({ //hard guarded everything
        irx: 0,
        iry: 0,
        obj: [

            { n: 'b1', g: objF.basket(), p: { y: 14.5, z: -5, ry: 3.14, add: { passDown: true } } },
            { n: 'b2', g: objF.basket(), p: { y: 19, z: -5, ry: 3.14 / 4 - .5, rz: 3.14, } },
            cat(8, { parent: 'b1', y: 1, x: 2, ry: 2 }),
            {
                n: 'p1', g: objF.press(), p: { is: 1, y: 1, x: -10 },
                r: [
                    { st: 2, con: [{ o: 'w1', st: 0 }, { o: 'h1', st: 0 },], res: .1 },
                    { st: 0, con: [{ o: 'n1', st: 1 }, { o: 'h1', st: 0 },], res: .45 },
                    { st: 0, con: [{ o: 'h1', st: 1 }, { o: 'w1', st: 3 },], res: .8 },
                ],
            },
            {
                n: 'h1', g: objF.hinge(), p: { parent: 'p1', y: 5, x: -1.1, z: .1 },
                r: [
                    { st: 1, con: [{ o: 'w1', st: 0 },], res: .03 },
                    { st: 0, con: [{ o: 'w1', st: 0 }, { o: 'n1', st: 0 },], res: .9 },

                ],
            },
            {
                n: 'w1', g: objF.wheel(), p: { parent: 'h1', y: 3, x: 1.1 },
                r: [
                    { st: 2, con: [{ o: 'n1', st: 1 }, { o: 'h1', st: 1 },], res: .55 },
                    { st: 2, con: [{ o: 'p1', st: 0 }, { o: 'h1', st: 1 },], res: .45 },
                    { st: 3, con: [{ o: 'p1', st: 0 }, { o: 'h1', st: 1 },], res: .45 },
                    { st: 4, con: [{ o: 'p1', st: 1 }, { o: 'h1', st: 1 }, { o: 'n1', st: 1 },], res: .75 },
                    { st: 4, con: [{ o: 'p1', st: 2 }, { o: 'h1', st: 1 }, { o: 'n1', st: 1 },], res: .95 },
                    { st: 2, con: [{ o: 'p1', st: 2 }, { o: 'h1', st: 0 },], res: .05 },
                    { st: 4, con: [{ o: 'h1', st: 0 }, { o: 'p1', st: [0, 2] },], res: .7 },

                ],
            },
            {
                n: 'gr', g: objF.gRing(2), p: { parent: 'w1', y: 0, x: 6.5, z: -3.5, rx: 3.14 / 2, rz: 3.14 * 1.33 },
            },
            {
                n: 'n1', g: objF.needle(10), p: { parent: 'gr', is: 1, y: 0, x: 0, z: -6.5, rx: -3.14 / 2 },
                r: [
                    { st: 0, con: [{ o: 'p1', st: 1 }, { o: 'w1', st: 0 }, { o: 'h1', st: 0 },], res: .05 },
                    { st: 1, con: [{ o: 'p1', st: 0 }, { o: 'h1', st: 0 },], res: .7 },
                    { st: 1, con: [{ o: 'p1', st: 2 }, { o: 'h1', st: 1 }, { o: 'w1', st: 0 },], res: .8 },
                    { st: 1, con: [{ o: 'p1', st: 1 }, { o: 'h1', st: 1 }, { o: 'w1', st: 0 },], res: 10 },
                ],
            },




        ]

    }),
    9: () => ({ //unhinged
        irx: .6,
        iry: .6,
        obj: [

            {
                n: 'w1', g: objF.wheel(), p: { x: 0, z: 0, y: 3, rz: .3, is: 3 },
                r: [
                    { st: 4, con: [{ o: 'h2', st: 0 },], res: .7 },
                    { st: 1, con: [{ o: 'l1', st: [1, 2] },], res: .9 },
                    { st: 2, con: [{ o: 'h2', st: 0 },], res: .05 },
                    { st: 3, con: [{ o: 'h2', st: 0 },], res: .5 },
                ],
            },
            {
                n: 'h1', g: objF.hinge(), p: { parent: 'w1', y: 3, x: 0, z: 1.1, ry: 3.14 / 2 },
                r: [
                    { st: 1, con: [{ o: 'w1', st: 3 },], res: .1 },
                    { st: 1, con: [{ o: 'w1', st: 0 },], res: .55 },
                    { st: 1, con: [{ o: 'w1', st: 1 },], res: .16 },
                    { st: 1, con: [{ o: 'w1', st: 2 },], res: 10 },
                ],
            },

            { n: 'p1', g: objF.plat(4), p: { parent: 'h1', y: 6, x: 1.25 } },
            cat(9, { parent: 'p1', y: 1, ry: -3.14 * .4 }),
            {
                n: 'h2', g: objF.hinge(), p: { y: 2, x: 0, z: 9, ry: 3.14 / 2 },
                r: [
                    { st: 1, con: [{ o: 'h3', st: 0 },], res: .55 },
                    { st: 0, con: [{ o: 'w1', st: 0 },], res: .2 },
                ],
            },
            { n: 'gh1', g: objF.gRing(5), p: { parent: 'h2', sx: 6.5, sz: 5, y: 3, x: 6, z: .75, rx: 0, rz: 3.14 / 2, ry: 3.14 } },
            {
                n: 'h3', g: objF.hinge(), p: { parent: 'h2', y: 6, x: 0, z: 0, rz: 3.14 / 2, rx: 3.14 },
                r: [
                    { st: 0, con: [{ o: 'h2', st: 1 },], res: .05 },

                ],
            },
            { n: 'gr2', g: objF.gRing(5), p: { parent: 'h3', y: 6, x: 1.25, z: 0, rx: 0, rz: 0, ry: 3.14 } },

            { n: 's1', g: objF.sign("🐈‍⬛🐈‍⬛🐈‍⬛", "UNHINGED"), p: { y: 0, x: -13, z: 0, rx: 0, rz: -.5 } },

            {
                n: 'l1', g: objF.press(), p: { is: 1, y: 0, x: 9, z: 0, rx: 0, rz: 0 },
                r: [
                    { st: 1, con: [{ o: 'w1', st: 1 },], res: .3 },
                ],
            },
            { n: 's2', g: objF.sign("🐈🐈🐈", "UNHINGED"), p: { parent: 'l1', y: 3.8, x: 1.3, z: 0, rx: 0, rz: .5 } },



        ]

    }),
    10: () => ({ //combo lock 2
        irx: 0,
        iry: 1,
        obj: [
            {
                n: 'w0', g: objF.wheel(), p: { x: 5, z: 2, y: 22, ry: 3.14 / 2, sx: 3, sz: 3 },
                r: [
                    { st: 2, con: [{ o: 'n1', st: 0 }, { o: 'n2', st: 1 }, { o: 'w1', st: 2 },], res: .89 },
                    { st: 1, con: [{ o: 'n2', st: 0 }, { o: 'w1', st: 2 },], res: .05 },
                ],
            },
            { n: 'p1', g: objF.plat(), p: { parent: 'w0', y: -8, z: 15, rx: 3.14 } },
            cat(10, { parent: 'p1', s: 1.3, y: -1.5, x: -2.5, z: 1, rx: 3.14 }),

            {
                n: 'n1', g: objF.needle(8), p: { y: 9, x: 4, z: 0, rz: 3.14 / 2 }, r: [
                    { st: 1, con: [{ o: 'w2', st: [0, 2, 3] },], res: .2 },
                    { st: 0, con: [{ o: 'w2', st: [0, 2, 3] },], res: .65 },

                ],
            },
            {
                n: 'w1', g: objF.wheel(), p: { parent: 'n1', y: -1, ry: 3.14 / 2 },
                r: [
                    { st: 1, con: [{ o: 'n2', st: 1 },], res: .05 },
                    { st: 2, con: [{ o: 'n2', st: 1 }, { o: 'w2', st: 1 },], res: .05 },
                    { st: 2, con: [{ o: 'n2', st: 1 }, { o: 'w2', st: 2 },], res: .85 },
                    { st: 3, con: [{ o: 'n2', st: 1 }, { o: 'w2', st: 2 },], res: .05 },
                    { st: 3, con: [{ o: 'n2', st: 1 }, { o: 'w2', st: 3 },], res: .85 },
                    { st: 4, con: [{ o: 'n2', st: 1 }, { o: 'w2', st: 3 },], res: .05 },
                    { st: 1, con: [{ o: 'n1', st: 0 },], res: .7 },
                    { st: 2, con: [{ o: 'w0', st: 0 }, { o: 'n2', st: 0 },], res: .48 },
                    { st: 3, con: [{ o: 'n1', st: 0 },], res: .65 },
                ],
            },
            {
                n: 'gr1', g: objF.gRing(2), p: { parent: 'w1', z: -7, rx: -3.14 / 2 },
            },
            {
                n: 'w2', g: objF.wheel(), p: { parent: 'n1', y: 3, ry: 3.14 / 2 },
                r: [
                    { st: 1, con: [{ o: 'n2', st: 1 },], res: .05 },
                    { st: 2, con: [{ o: 'n2', st: 1 }, { o: 'w1', st: 0 },], res: .95 },
                    { st: 2, con: [{ o: 'n2', st: 1 }, { o: 'w1', st: 1 },], res: .05 },

                    { st: 3, con: [{ o: 'n2', st: 1 }, { o: 'w1', st: 1 },], res: .95 },
                    { st: 3, con: [{ o: 'n2', st: 1 }, { o: 'w1', st: 2 },], res: .05 },
                    { st: 4, con: [{ o: 'n2', st: 1 }, { o: 'w1', st: 3 },], res: .05 },
                    { st: 4, con: [{ o: 'n2', st: 1 }, { o: 'w1', st: 2 },], res: .95 },

                    //{ st: 1, con: [{ o: 'n1', st: 0 },], res: .7 },
                    //{ st: 2, con: [{ o: 'w0', st: 0 }, { o: 'n2', st: 0 },], res: .6 },
                ],
            },
            {
                n: 'gr2', g: objF.gRing(.5), p: { parent: 'w2', z: -7, rx: -3.14 / 2, s: 2 },
            },
            {
                n: 'gr2-2', g: objF.gRing(.5), p: { parent: 'w2', x: -7, rz: 3.14 / 2, s: 2 },
            },
            {
                n: 'n2', g: objF.needle(15), p: { parent: 'gr1', is: 1, y: 0, x: 0, z: -9, rx: -3.14 / 2 },
                r: [
                    { st: 1, con: [{ o: 'w1', st: 0 }, { o: 'w2', st: [2, 3] },], res: .1 },
                    { st: 1, con: [{ o: 'w1', st: 1 }, { o: 'w2', st: [0, 3] },], res: .1 },
                    { st: 1, con: [{ o: 'w1', st: 2 }, { o: 'w2', st: [0, 1] },], res: .1 },
                    { st: 1, con: [{ o: 'w1', st: 3 }, { o: 'w2', st: [1, 2] },], res: .1 },
                    { st: 1, con: [{ o: 'n1', st: 0 }, { o: 'w1', st: 2 }, { o: 'w2', st: 2 }, { o: 'w0', st: 2 }], res: 10 },
                ],
            },
            {
                n: 'gr3', g: objF.gRing(3), p: { x: 3, y: 2, rx: -3.14 / 2, sx: 2, sz: 2, ry: 3.14 / 2, rz: 3.14 / 2 },
            },
            {
                n: 'gr3-2', g: objF.gRing(3), p: { x: -2, y: 2, rx: -3.14 / 2, sx: 2, sz: 2, ry: 3.14 / 2, rz: 3.14 / 2 },
            },
            {
                n: 'gr4', g: objF.gRing(8), p: { z: 8, y: 6, x: 4.75, s: 2, ry: 3.14 / 2, },
            },
            {
                n: 'gr5', g: objF.gRing(8), p: { z: -8, y: 6, x: 4.75, s: 2, ry: 3.14 / 2, },
            },




        ]

    }),
    11: () => ({ //Arm thing
        irx: .8,
        iry: 1.3,
        obj: [
            {
                n: 'w1', g: objF.wheel(), p: { y: 2, s: .8 },
                r: [
                    { st: 1, con: [{ o: 'h1', st: 0 }, { o: 'h2', st: 0 }], res: .35 },
                    { st: 1, con: [{ o: 'h1', st: 0 }, { o: 'h2', st: 1 }, { o: 'l1', st: [1, 2] }], res: .1 },
                    { st: 2, con: [{ o: 'h1', st: 0 }, { o: 'h2', st: 0 },], res: .9 },
                    { st: 2, con: [{ o: 'h1', st: 1 }, { o: 'h2', st: 0 },], res: .85 },
                    { st: 2, con: [{ o: 'h1', st: 0 }, { o: 'h2', st: 1 },], res: .7 },
                    { st: 2, con: [{ o: 'h1', st: 1 }, { o: 'h2', st: 1 }, { o: 'l1', st: [1, 2] }], res: .6 },
                    { st: 2, con: [{ o: 'h1', st: 1 }, { o: 'h2', st: 1 }, { o: 'w2', st: 1 }], res: .85 },
                    { st: 2, con: [{ o: 'h1', st: 1 }, { o: 'h2', st: 1 }, { o: 'w2', st: 2 }], res: .65 },
                    { st: 2, con: [{ o: 'h1', st: 1 }, { o: 'h2', st: 1 }, { o: 'w2', st: 3 }], res: .15 },
                    { st: 4, con: [], res: .15 },
                ],
            },
            {
                n: 'l1', g: objF.press(), p: { parent: 'w1', z: -2, y: 2, rx: -3.14 / 2, is: 1 },
                r: [
                    { st: 0, con: [{ o: 'w1', st: 0 }, { o: 'h2', st: 1 }, { o: 'l2', st: [1, 2] }, { o: 'w2', st: 3 }], res: .5 },
                    { st: 1, con: [{ o: 'w1', st: 2 },], res: .6 },

                    { st: 2, con: [{ o: 'w1', st: 3 }, { o: 'w2', st: 3 }, { o: 'h1', st: 1 }, { o: 'h2', st: 1 }, { o: 'n1', st: 1 }, { o: 'l2', st: 2 }], res: 10 },


                ],
            },
            {
                n: 'h1', g: objF.hinge(), p: { parent: 'l1', z: .5, y: 5, ry: 3.14 / 2 },
                r: [
                    { st: 1, con: [{ o: 'w1', st: 0 },], res: .03 },
                    //    { st: 0, con: [{ o: 'w1', st: 0 },], res: .8 },
                ],
            },
            {
                n: 'w2', g: objF.wheel(), p: { parent: 'h1', y: 2.5, x: 1.2, s: .5 },
                r: [
                    { st: 1, con: [{ o: 'w1', st: 0 }, { o: 'h1', st: 0 }, { o: 'h2', st: 0 }, { o: 'l1', st: 0 }, { o: 'l2', st: [0, 1] }], res: .15 },
                    { st: 1, con: [{ o: 'w1', st: 0 }, { o: 'h1', st: 0 }, { o: 'h2', st: 0 }, { o: 'l1', st: [0, 1] }, { o: 'l2', st: 0 }], res: .15 },
                    { st: 2, con: [{ o: 'h1', st: 0 }, { o: 'h2', st: 1 }], res: .1 },
                    { st: 4, con: [{ o: 'w1', st: 0 }, { o: 'h1', st: 0 }, { o: 'h2', st: 1 },], res: .3 },

                    { st: 1, con: [{ o: 'w1', st: 2 },], res: .75 },
                    { st: 1, con: [{ o: 'w1', st: 3 }, { o: 'h1', st: 1 }, { o: 'h2', st: 1 }, { o: 'l1', st: 2 }, { o: 'l2', st: 2 }], res: .4 },


                ],
            },
            {
                n: 'h2', g: objF.hinge(), p: { parent: 'w2', x: -1.1, y: 2.5 },
                r: [
                    { st: 1, con: [{ o: 'w1', st: 0 }, { o: 'h1', st: 0 }, { o: 'w2', st: 0 }], res: .1 },
                    { st: 1, con: [{ o: 'h1', st: 0 }, { o: 'w2', st: 2 }], res: .1 },
                    { st: 1, con: [{ o: 'w1', st: 0 }, { o: 'h1', st: 0 }, { o: 'w2', st: 1 }, { o: 'l1', st: [0, 1] }], res: .2 },
                    { st: 1, con: [{ o: 'w1', st: 0 }, { o: 'h1', st: 0 }, { o: 'w2', st: 1 }, { o: 'l1', st: 2 }], res: .6 },
                    { st: 1, con: [{ o: 'w1', st: 0 }, { o: 'h1', st: 0 }, { o: 'w2', st: 3 }, { o: 'l1', st: [0, 1] }, { o: 'l2', st: [1, 2] }], res: .9 },

                    { st: 0, con: [{ o: 'w1', st: 2 },], res: .8 },
                    { st: 1, con: [{ o: 'w1', st: 3 }, { o: 'w2', st: 3 }, { o: 'h1', st: 1 }, { o: 'n1', st: 1 }, { o: 'l1', st: 2 }, { o: 'l2', st: 2 }], res: 10 },


                ],
            },
            {
                n: 'l2', g: objF.press(), p: { parent: 'h2', x: 1, y: 4 },
                r: [
                    { st: 1, con: [{ o: 'w1', st: 0 }, { o: 'h2', st: 1 }, { o: 'l1', st: [0, 1] }, { o: 'w2', st: 3 }], res: .5 },
                    { st: 2, con: [{ o: 'w1', st: 3 }, { o: 'w2', st: 3 }, { o: 'h1', st: 1 }, { o: 'h2', st: 1 }, { o: 'l1', st: 2 }, { o: 'n1', st: 1 }], res: 10 },

                ],
            },
            {
                n: 'gr', g: objF.gRing(1), p: { parent: 'l2', x: -2, y: 4, ry: 3.14 / 2 },

            },
            {
                n: 'n1', g: objF.needle(1), p: { parent: 'gr', z: 2, rx: 3.14 / 2 },
                r: [
                    { st: 1, con: [{ o: 'w1', st: 3 }, { o: 'w2', st: 3 }, { o: 'h1', st: 1 }, { o: 'h2', st: 1 }, { o: 'l1', st: 2 }, { o: 'l2', st: 2 }], res: 10 },
                ],
            },

            { n: 'p2', g: objF.plat(12), p: { y: 10, x: 0, z: 13 } },
            { n: 'p3', g: objF.plat(6), p: { y: 6, x: 5, z: -20 } },
            { n: 'p4', g: objF.plat(20), p: { y: 8, x: -12, z: -14 } },
            { n: 'gr2', g: objF.gRing(4), p: { y: 4, x: 7, z: -3 } },
            { n: 'p1', g: objF.plat(), p: { y: 3, x: 14, z: -16, ry: 3.14 } },
            cat(11, { parent: 'p1', y: 1.5, x: -.5, z: 1, }),
        ]

    }),
    12: () => ({ //tower
        irx: 1,
        iry: .2,
        obj: [
            {
                n: 'l1', g: objF.press(), p: { is: 2 },
                r: [
                    { st: 0, con: [{ o: 'l2', st: 2 }, { o: 'w1', st: 0 }], res: .08 },
                    { st: 0, con: [{ o: 'l2', st: 2 }, { o: 'h1', st: 0 }], res: .15 },
                    { st: 0, con: [{ o: 'l2', st: [0, 1] }, { o: 'h1', st: 1 }], res: .1 },
                    { st: 0, con: [{ o: 'l2', st: [0, 1] }, { o: 'w1', st: [1, 3] }], res: .5 },


                ],
            },

            {
                n: 'l2', g: objF.press(), p: { parent: 'l1', is: 2, y: 5 },
                r: [
                    { st: 0, con: [{ o: 'l1', st: 2 }, { o: 'w1', st: 0 }], res: .08 },
                    { st: 0, con: [{ o: 'l1', st: 2 }, { o: 'h1', st: 0 }], res: .15 },
                    { st: 0, con: [{ o: 'l1', st: [0, 1] }, { o: 'h1', st: 1 }], res: .1 },
                    { st: 0, con: [{ o: 'l1', st: [0, 1] }, { o: 'w1', st: [1, 3] }], res: .5 },

                ],
            },
            {
                n: 'p1', g: objF.plat(), p: { parent: 'l2', y: 3.5 },
            },
            cat(12, { parent: 'p1', y: 1, x: -.5, ry: 1 }),
            {
                n: 'p2', g: objF.plat(10), p: { x: 8.2, y: 10 },
            },
            {
                n: 'w1', g: objF.wheel(), p: { parent: 'p2', x: -1, y: 1, s: .5 },
            },
            { n: 'gr1', g: objF.gRing(2), p: { parent: 'w1', z: -4, s: .5, rx: -3.14 / 2 }, },
            { n: 's1', g: objF.sign("TOP CAT", "humans", "live to", "serve us"), p: { parent: 'w1', sx: 1.5, sy: .8 }, },
            { n: 'p3', g: objF.plat(10), p: { x: -8.2, y: 10, z: -1 }, },
            {
                n: 'h1', g: objF.hinge(), p: { parent: 'p3', y: 2.3, x: 1.9, z: 3 },
                r: [
                    { st: 1, con: [{ o: 'n1', st: 1 }, { o: 'l4', st: [1, 2] }, { o: 'l3', st: 2 }], res: .1 },
                    { st: 0, con: [{ o: 'n1', st: 1 }, { o: 'l4', st: [1, 2] }, { o: 'l3', st: 2 }], res: .45 },
                ]
            },
            { n: 'gr2', g: objF.gRing(5), p: { parent: 'h1', z: 1.1, x: 1.2, y: 1 }, },

            { n: 's1', g: objF.sign("Queen", "of", "the", "cats"), p: { parent: 'h1', y: .5, x: 1, s: .6, rz: -.2 }, },

            {
                n: 'l3', g: objF.press(), p: { y: 2, x: 4, z: 8, rz: 3.14 / 2, is: 2 },
                r: [
                    { st: 2, con: [{ o: 'n1', st: 0 }, { o: 'l4', st: 0 },], res: .8 },
                    { st: 0, con: [{ o: 'n1', st: 1 }, { o: 'h1', st: 0 }], res: .1 },

                ],
            },
            {
                n: 'l4', g: objF.press(), p: { parent: 'l3', y: 5, x: .5, rz: -3.14 / 2, is: 2 },
                r: [

                    { st: 0, con: [{ o: 'n1', st: 0 }, { o: 'l3', st: 2 },], res: .85 },

                ],
            },
            {
                n: 'gr2', g: objF.gRing(5), p: { parent: 'l4', y: 8 },
            },
            {
                n: 'n1', g: objF.needle(), p: { parent: 'gr2', rx: 3.14 / 2, is: 1, z: 4.5 },
                r: [
                    { st: 0, con: [{ o: 'n2', st: 0 }, { o: 'l3', st: 2 }], res: .3 },
                    { st: 0, con: [{ o: 'l4', st: 0 }, { o: 'l3', st: 2 },], res: .3 },
                    { st: 1, con: [{ o: 'l4', st: [1, 2] }, { o: 'l3', st: 0 }], res: .2 },
                    { st: 1, con: [{ o: 'l4', st: 0 }, { o: 'l3', st: 0 }, { o: 'l1', st: 0 }, { o: 'l2', st: [1, 2] }], res: .8 },
                    { st: 1, con: [{ o: 'l4', st: 0 }, { o: 'l3', st: 0 }, { o: 'l1', st: [1, 2] }, { o: 'l2', st: 0 }], res: .8 },
                    { st: 1, con: [{ o: 'l4', st: 0 }, { o: 'l3', st: 0 }, { o: 'l1', st: 0 }, { o: 'l2', st: 0 }], res: 10 },
                ]
            },
            {
                n: 'n2', g: objF.needle(), p: { y: 14, z: 12, x: -7, is: 1 },
                r: [
                    { st: 0, con: [{ o: 'n1', st: 0 }, { o: 'l3', st: 2 }], res: .6 },

                ]
            },
            { n: 'gr3', g: objF.gRing(10), p: { y: 10.5, z: 5, x: -1, ry: 0 }, },
            { n: 'gr4', g: objF.gRing(5), p: { y: 16, z: 5, x: -1, ry: 0 }, },

        ]

    }),




};