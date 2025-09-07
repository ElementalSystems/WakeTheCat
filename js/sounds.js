import { randA, ranR } from './util.js'

//Sound effects and music chimes system
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const mVolume = audioCtx.createGain(); //music master volume
mVolume.connect(audioCtx.destination);
export const setMVol = (v) => mVolume.gain.setValueAtTime(v, audioCtx.currentTime);
setMVol(.33);

const fxVolume = audioCtx.createGain(); //fx master volume
fxVolume.connect(audioCtx.destination);
export const setFXVol = (v) => fxVolume.gain.setValueAtTime(v, audioCtx.currentTime);
setFXVol(.33);



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
    }

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

function _chime() { //time to strike a random chime
    if (!_c) return;
    playGong(randA(_c.t), randA(_c.o), randA(_c.d), ranR(_c.vs, _c.ve));
    setTimeout(_chime, ranR(_c.gs, _c.ge) * 1000);
}

export function pChimes(c = null) //start the chimes with a set up or null to silence  
{
    console.log("Starting", c);
    if (!_c) setTimeout(_chime, 10); //start it if we need to
    _c = c;
}

