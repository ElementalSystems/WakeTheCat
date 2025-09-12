import { randA, ranR } from './util.js'

//Sound effects and music chimes system
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const mVolume = audioCtx.createGain(); //music master volume
mVolume.connect(audioCtx.destination);
mVolume.gain.setValueAtTime(.1, audioCtx.currentTime);

const fxVolume = audioCtx.createGain(); //fx master volume
fxVolume.connect(audioCtx.destination);
fxVolume.gain.setValueAtTime(.6, audioCtx.currentTime);




//make noiseBuffer
const bufferSize = 2 * audioCtx.sampleRate;
const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
const output = noiseBuffer.getChannelData(0);
for (let i = 0; i < bufferSize; i++) {
    output[i] = ranR(-1, 1); // white noise
}

function noiseS() //creates a node for white noise 
{
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    return noise;
}

export const sFX = {
    grind: (dur, cut) => {
        const noise = noiseS()
        const now = audioCtx.currentTime;
        // Low-pass filter (makes it deep/rumbling)
        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 100;

        // Distortion curve
        function makeDistortionCurve(amount) {
            const k = typeof amount === "number" ? amount : 50;
            const n_samples = 44100;
            const curve = new Float32Array(n_samples);
            const deg = Math.PI / 180;
            for (let i = 0; i < n_samples; ++i) {
                const x = (i * 2) / n_samples - 1;
                curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
            }
            return curve;
        }
        const distortion = audioCtx.createWaveShaper();
        distortion.curve = makeDistortionCurve(200);
        distortion.oversample = "4x";

        // Modulation: LFO to move filter cutoff for "scraping" feel
        const lfo = audioCtx.createOscillator();
        lfo.frequency.value = 10; // Hz, experiment 5–20
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 50; // filter modulation depth
        lfo.connect(lfoGain).connect(filter.frequency);
        lfo.start();

        // Connect chain: noise -> filter -> distortion -> destination
        noise.connect(filter);
        filter.connect(distortion);
        distortion.connect(fxVolume);

        // Play
        noise.start(now);
        noise.stop(now + Math.min(dur, cut));
    },
    woosh: (d, cut, up = false) => {
        const noise = noiseS();
        const now = audioCtx.currentTime;
        const dur = d * 1.5;
        // Bandpass filter (airy valve effect)
        const filter = audioCtx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1500; // center frequency
        filter.Q.value = 1; // resonance

        // Amplitude envelope (air blast shape)
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(1, now + dur * (up ? .5 : 0.05)); // fast attack
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur); // decay


        // Connections
        noise.connect(filter).connect(gain).connect(fxVolume);

        // Start
        noise.start();
        noise.stop(now + cut);
    },
    wooshUp: (dur, cut) => sFX.woosh(dur, cut, true),
    spin: (dur, cut) => {
        const now = audioCtx.currentTime;
        // Base oscillator (engine/flywheel tone)
        const osc = audioCtx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(100, now); // starting pitch
        osc.frequency.exponentialRampToValueAtTime(300, now + dur * .4); // spin-up to high pitch
        osc.frequency.setValueAtTime(300, now + dur * .6); // starting pitch
        osc.frequency.exponentialRampToValueAtTime(100, now + dur); // spin-up to high pitch

        const noise = noiseS();

        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = "highpass";
        noiseFilter.frequency.value = 400; // airy whirr

        // Gain envelope (fade-in and sustain)
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.2, now + dur * .4); // fade in
        gain.gain.setValueAtTime(0.2, now + dur * .6);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur); // fade out

        // Connect chain
        osc.connect(gain);
        noise.connect(noiseFilter).connect(gain);
        gain.connect(fxVolume);

        // Start/stop
        osc.start(now);
        noise.start(now);
        osc.stop(now + Math.min(dur, cut));
        noise.stop(now + Math.min(dur, cut));
    },
    bash: (dur, cut) => {
        const now = audioCtx.currentTime;
        const noise = noiseS();
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.4, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
        noise.connect(noiseGain).connect(fxVolume);
        noise.start(now);
        noise.stop(now + cut);
    },
    hng: (d, c) => sFX.mew(d, c, 0, 100, 200, 10),
    mew: (dur, cut, off = 0, fr = 600, fre = 400, rep = 30) => {
        const now = audioCtx.currentTime + off;

        // Base vocal oscillator
        const osc = audioCtx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(400, now); // base pitch (~cat meow)
        osc.frequency.exponentialRampToValueAtTime(fr, now + dur * .2); // upward screech
        osc.frequency.linearRampToValueAtTime(fre, now + dur * .8); // then settle

        // First formant filter (throat resonance)
        const formant1 = audioCtx.createBiquadFilter();
        formant1.type = "bandpass";
        formant1.frequency.value = 1000; // resonance frequency
        formant1.Q.value = 4;

        // Second formant filter (mouth resonance)
        const formant2 = audioCtx.createBiquadFilter();
        formant2.type = "bandpass";
        formant2.frequency.value = 2500;
        formant2.Q.value = 6;

        // Add jittery modulation (for angry instability)
        const lfo = audioCtx.createOscillator();
        lfo.frequency.value = rep; // jitter speed
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 40; // +/- Hz
        lfo.connect(lfoGain).connect(osc.frequency);
        lfo.start(now);

        // Amplitude envelope
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(6, now + dur * 0.05); // quick attack
        gain.gain.setValueAtTime(6, now + dur * 0.5); // sustain
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur * 1.2); // decay

        // Connect chain: osc -> formants -> gain -> out
        osc.connect(formant1).connect(formant2).connect(gain).connect(fxVolume);
        // Start/stop
        osc.start(now);
        osc.stop(now + cut);
    },
    yowl: (dur, cut) => {
        sFX.mew(dur, dur, 0, 600, 400, 30);
        sFX.mew(dur - .1, dur, .1, 800, 1000, 30);
        sFX.mew(dur - .2, dur, .2, 200, 500, 20);
        sFX.mew(dur - .5, dur, .4, 500, 100, 10);
        sFX.mew(dur - .2, dur, 0, 500, 1200, 40);
    },




}

//code for wind chimes


function playGong(STC, oct, dur = 10, v = 1) { //play a single chime
    const baseFreq = 440 * Math.pow(2, (oct * 12 + STC - 57) / 12);
    const now = audioCtx.currentTime;

    const master = audioCtx.createGain();
    master.gain.setValueAtTime(0.2 * v, now).exponentialRampToValueAtTime(0.0001, now + dur);
    master.connect(mVolume);

    // Fundamental
    makeTone(baseFreq, master, now, dur);

    // Gong-like inharmonic partials
    makeTone(baseFreq * 2.01, master, now, dur * 0.9);
    makeTone(baseFreq * 2.62, master, now, dur * 0.7);
    makeTone(baseFreq * 3.95, master, now, dur * 0.5);
}

// Helper: tone with exponential decay
function makeTone(freq, destination, startTime, duration) {
    const osc = audioCtx.createOscillator();
    osc.frequency.setValueAtTime(freq, startTime);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(1, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain).connect(destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
}

var _c = null;

var _k = [
    [0, 2, 4, 7, 9], //0:Major
    [0, 3, 5, 7, 10],//1:minor
    [0, 2, 5, 7, 10],//2:egyptian
    [0, 1, 5, 7, 10],//3:In Sen
    [0, 2, 5, 7, 9], //4: Yo
]

function _chime() { //time to strike a random chime
    if (!_c) return;
    playGong(randA(_k[_c.t]), randA(_c.o), randA(_c.d || [10, 20, 25]), ranR(_c.vs || .1, _c.ve || .5));
    setTimeout(_chime, ranR(_c.gs || .5, _c.ge || 1) * 1000);
}

export function pChimes(c = null) //start the chimes with a set up or null to silence  
{
    if (!_c) setTimeout(_chime, 10); //start it if we need to
    _c = c;
}

