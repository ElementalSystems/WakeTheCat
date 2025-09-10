
//general utility code

function setElementClass(e, cls) {
    if (!e.classList.contains(cls))
        e.classList.add(cls);
}

function unsetElementClass(e, cls) {
    if (e.classList.contains(cls))
        e.classList.remove(cls);
}


//random numbers
export const ranR = (s, e) => s + Math.random() * (e - s); //random in range s to e smooth
export const randA = (a) => a[Math.floor(Math.random() * a.length)]; //select a random element of array


//call each frame
var _onFrameList = [];
var _lastFrameT = 0;
export const onFrame = (f) => _onFrameList.push(f)

export const frame = (t) => {
    if (!_lastFrameT) _lastFrameT = t - 10;
    const ft = t - _lastFrameT;
    _lastFrameT = t;
    const ofl = _onFrameList;
    _onFrameList = [];
    ofl.forEach(f => f(t, ft));
}

//a general animation or slow effect utility
export function callEachFrame(time, each, end) {
    var startTime = 0;
    var endTime = 0;
    function func(t) {
        if (!startTime) {
            startTime = t;
            endTime = t + time;
        }
        var r = (t - startTime) / (time);
        if (r < 0) r = 0;
        if (r > 1) r = 1;
        each(r);
        if (r < 1)
            onFrame(func);
        else {
            if (end) end();
        }
    };
    //call it the first time
    onFrame(func);
}

//clamping and ease functions
export function inRange(s, e, v) {
    if (v < s) return s;
    if (v > e) return e;
    return v;
}

export function siso(r) { return 3 * r * r - 2 * r * r * r; }
export function so(r) { return 2 * r - r * r; }
export function si(r) { return r * r; }

export function reRange(st, ed, func) {
    return function (r) {
        if (r < st) return 0;
        if (r > ed) return 1;
        r = (r - st) / (ed - st);
        if (func) return func(r);
        return r;
    }
}

export function inter(r, st, end, func = null) {
    if (r < 0) r = 0;
    if (r > 1) r = 1;
    if (func) r = func(r);
    return (r * end) + ((1 - r) * st);
}

export function tickCount() {
    return new Date().getTime();
}

function setMaterialIndex(geo, index) {
    for (var i = 0; i < geo.faces.length; i += 1)
        geo.faces[i].materialIndex = index;
}


//local Storage
var _complete = JSON.parse(localStorage.getItem("js13k2025-WakeTheCat") || "[]");
export const setLC = (lev, set = true) => {
    _complete[lev] = set;
    localStorage.setItem("js13k2025-WakeTheCat", JSON.stringify(_complete));
}

export const getLC = (lev) => _complete[lev];

export const getFIL = () => _complete.findIndex(v => !v); //Returns index of first false