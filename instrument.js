const majorIntervalAbsolute = [0, 4, 7, 11];
const minorIntervalAbsolute = [0, 3, 7, 10];
const powerIntervalAbsolute = [0, 7, 12];
let playing = false;

const PlayMode = {
  Voices: "voices",
  Normal: "normal",
};
let playMode = PlayMode.Voices;

const keyToScaleMap = new Map([
  ['a', 0],
  ['s', 1],
  ['d', 2],
  ['f', 3],
  ['h', 4],
  ['j', 5],
  ['k', 6],
  ['l', 7],
]);

const keyToTonicMap = new Map([
  ['q', 0],
  ['w', 1],
  ['e', 2],
  ['r', 3],
  ['t', 4],
  ['y', 5],
  ['u', 6],
  ['i', 7],
  ['o', 8],
  ['p', 9],
  ['[', 10],
  [']', 11],
]);

const keyToArpPatternMap = new Map([
  ['1', "up"],
  ['2', "down"],
  ['3', "upDown"],
  ['4', "downUp"],
  ['5', "alternateUp"],
  ['6', "alternateDown"],
  ['7', "random"],
  ['8', "randomOnce"],
  ['9', "randomWalk"],
]);

const noteToVoicingsMap = new Map([
  [0, [
    [0,3,7,9,11 /* Badd4: b,e,b,d#,f# */],
    //[0,2,3,4 /* Badd4: b,d#,e,f# */,],
    [0,4,7,9 /* b: b,f#,b,d# */],
  ]],
  [1, [
    [-3,2,3,7 /* C#madd4/G#: G#,e,f#,c# */],
    //[0,2,4 /* C#m: c#,e,g# */], 
    [0,2,4,6/* C#m7: c#,e,g#,b */],
    [0,4,7,9 /* c#m: c#,g#,c#,e */]
  ]],
  [2, [
    [0,2,6,7 /* D#m7: d#,f#,c#,d# */], 
    [0,4,6,9 /* D#m7: d#,a#,c#,f# */], 
    [0,4,7,9 /* d#m: d#,a#,d#,f# */], 
    [0,2,4,6 /* D#m7 traditional */],
  ]],
  [3, [
    [0,4,6,8 /* EM7sus2 or Badd4/E: e,b,d#,f# */],  
    [0,1,5 /* E6sus2: e,f#,c# */], 
    [0,2,6,8, /* EM9: e, g#, d#, f#*/],
  ]],
  [4, [
    [0,4,7,9 /* F#sus2: f#,c#,f#,g# */],
    [0,4,9 /* F#sus2: f#,c#,g# */],
    [-6,-1,0,4 /* F#/G# 7th sus2: g#,e,f#,c# */],
    [0,2,4],
  ]],
  [5, [
    [0,4,7,9 /* g#m: g#,d#,g#,b */],
    [0,2,4 /* g#m: g#,b#,d#*/],
    [0,4,6,9 /* g#m7: g#,d#,f#,b# */]
  ]],
  [6, [
    [0,2,4],
    [0,4,7,9 /* b: b,f#,b,d# */],
    [0,3,7,9,11 /* Badd4: b,e,b,d#,f# */],
    [0,2,3,4 /* Badd4: b,d#,e,f# */],
  ]],
])

const activelyPlaying = new Map();

// Array representing octave [C0, B0]
//24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
const keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const majorScalePattern = [0, 2, 4, 5, 7, 9, 11]; // harcoded major scale pattern (semitones above tonic)
const minorScalePattern = [0, 2, 3, 5, 7, 8, 10]; // harcoded minor scale pattern (semitones above tonic)
//const notePattern = [2, 2, 1, 2, 2, 2, 1];
let selectedScalePattern = majorScalePattern;
let selectedInterval = [0, 2, 4];
let selectedTonic = keys[11];
let selectedOctave = 1;

//const mode = Mode.Ionian;
let debugOn = true;
let scale = generateKeyOctave(selectedTonic, selectedScalePattern, selectedOctave);
let selectedArpPattern = "randomWalk";

// instruments
let strings;
let synth;
let drum;
let player;

window.addEventListener("DOMContentLoaded", async (event) => {
  console.log("DOM fully loaded and parsed");
  await setup();
});

let canPlayPromise, canPlayRes, canPlayRe;
[canPlayPromise, canPlayRes, canPlayRej] = thread();

async function setup() {
  // TODO: drum
  drum = new Tone.MembraneSynth();
  synth = new Tone.PolySynth({
    // "envelope": {
    //   "attack": 0.5,
    //   "decay": 0,
    //   "sustain": 0.3,
    //   "release": 0,
    // },
    // portamento: .1,
    //partialCount: 2,
    "volume": -10,
  }).toDestination();
  synth.sync()
  strings = new Tone.PolySynth({
    "volume": -10,
    "envelope": {
      "attack": 0.25,
      "decay": .1,
      "sustain": 0.25,
      "release": .1,
    }
  }).toDestination();
  strings.sync();

  // todo: effects / reverb/ etc
  // todo: wind sounds
   player = new Tone.Player({
    onload: () => {
      console.log('loaded audio');
      canPlayRes();
    },
    onerror: (e) => canPlayRej(err),
    onstop: (s) => {
      console.log('player stopped');
      console.log(s);
    },
    loop: true,
    url: "assets/letting_go_of_the_kite.m4a",
    playbackRate: 1,
   }).toDestination();
   player.sync();

  // set up event listeners
  const playButton = document.getElementById("playing");
  playButton.addEventListener('click', async (event) => {
    const isPlaying = await togglePlaying();
    if (isPlaying) {
      playButton.textContent = "pause";
    } else {
      playButton.textContent = "play";
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.repeat) { return }
    console.log("keydown: " + event.key);

    const newArpPattern = getArpPatternForKey(event.key);
    if (newArpPattern != undefined) {
      selectedArpPattern = newArpPattern;
    }

    if (playMode == PlayMode.Normal) {
      const newScalePattern = getScalePatternForKey(event.key);
      if (newScalePattern != undefined) {
        console.log("newScalePattern");
        selectedScalePattern = newScalePattern;
        scale = generateKeyOctave(selectedTonic, selectedScalePattern, selectedOctave);
      }
  
      const newTonic = getTonicForKey(event.key);
      if (newTonic != undefined) {
        scale = generateKeyOctave(newTonic, selectedScalePattern, selectedOctave);
        selectedTonic = newTonic;
        console.log(scale);
        console.log(scale.map((note) => Tone.Frequency(note, "midi").toNote()));
      }
    }

    const scaleIdx = getScaleNoteIndexForKey(event.key);
    if (scaleIdx != undefined) {
      // stop the currently playing note, if it exists
      stopNote(scaleIdx);

      let stopcb = startNote(scaleIdx);
      activelyPlaying.set(scaleIdx, stopcb);
    }
  });

  const intervalEl = document.getElementById("interval");
  selectedInterval = getIntervalFromString(intervalEl.value);
  intervalEl.addEventListener('change', (event) => {
    if (playMode = PlayMode.Normal) {
      let interval = event.target.value;
      console.log(`new interval ${interval}`);
      selectedInterval = getIntervalFromString(event.target.value);
    }
  });

  document.addEventListener('keyup', (event) => {
    const scaleIdx = getScaleNoteIndexForKey(event.key);
    stopNote(scaleIdx);
  });
}

function getIntervalFromString(str) {
  return str.split(',').map((e) => parseInt(e, 10));
}

function startNote(scaleIdx) {
  console.log('start note ' + scaleIdx);
  //let chord = generateTriad(scaleIdx);
  // let chord = generateInterval(scaleIdx, selectedInterval);
  // let arp = makeArp(strings, chord, arpPattern);
  // let playChordStop = playChord(synth, chord);

  let [arpNotes, chordNotes] = generateNotes(scaleIdx, selectedInterval);
  console.log("arpNotes, chordNotes");
  console.log(arpNotes, arpNotes.map((n) => Tone.Frequency(n, "midi").toNote()));
  console.log(chordNotes, chordNotes.map((n) => Tone.Frequency(n, "midi").toNote()));
  let arp = makeArp(strings, arpNotes, selectedArpPattern);
  let playChordStop = playChord(synth, chordNotes);
  arp.start(0);
  player.start();
  let stopCb = () => {
    player.stop();
    // cancel necessary?
    playChordStop();
    arp.cancel();
    arp.stop();
    arp.dispose()
  }
  return stopCb;
}

function stopNote(scaleIdx) {
  let stopcb = activelyPlaying.get(scaleIdx);
  if (stopcb != undefined) {
    console.log('stop note ' + scaleIdx);
    activelyPlaying.delete(scaleIdx);
    stopcb();
  }
}

function generateTriad(rootNoteScaleIdx, seventhChance = .5) {
  const interval = [0,2,4]; 
  if (Math.random() < seventhChance) {
    interval.push(6);
  }
  console.log(`generate chord ${rootNoteScaleIdx + 1}`);
  return generateInterval(rootNoteScaleIdx, interval);
}

function generateInterval(rootNoteScaleIdx, interval) {
  console.log(`generate interval ${rootNoteScaleIdx}`);
  //console.log(interval, scale);
  // TODO: use tone.Frequency https://tonejs.github.io/docs/14.7.77/fn/Frequency
  // todo: consider using Tone.Frequency.harmonize
  const notes = interval.map((i) => {
    let idx = i + rootNoteScaleIdx;
    // if idx < 0:
    // pitch note down an octave
    // if idx > 7 pitch note up an octave
    let scaleIndex = idx % scale.length;
    if (scaleIndex < 0) {
      console.log(`scale index ${scaleIndex} newidx: ${(scale.length) + scaleIndex}`)
      scaleIndex = (scale.length) + scaleIndex;
    }
    let scaleNote = scale[scaleIndex];
    // if ((idx / scale.length) >= 1) {
    //   scaleNote += 12;
    // }
    let original = scaleNote;
    scaleNote += Math.floor(Math.abs(idx/scale.length)) * (Math.sign(idx)) * 12;
    console.log(`i ${i} idx: ${idx} rootnoteid: ${rootNoteScaleIdx} original output: ${original} scaled: ${scaleNote}`);
    return scaleNote;
  });
  // const notes = interval.map((i) => {
  //   let idx = i + rootNoteScaleIdx;
  //   let scaleNote = scale[idx % (scale.length)];
  //   if ((idx / (scale.length)) >= 1) {
  //     scaleNote += 12;
  //   }
  //   return scaleNote;
  // });
  console.log(notes);
  console.log(notes.map((note) =>Tone.Frequency(note, "midi").toNote()));
  return notes;
}

function generateNotes(rootNoteScaleIdx, interval) {
  if (playMode == PlayMode.Voices) {
    let voicings = noteToVoicingsMap.get(rootNoteScaleIdx) ?? [[0,2,4]];
    let vid = Math.floor(Math.random() * voicings.length);
    let voicing = voicings[vid];
    let rootScaleNote = scale[rootNoteScaleIdx % (scale.length)];
    console.log(`voices playmode for note#: ${rootNoteScaleIdx} ${frequencyFromNoteNumber(rootScaleNote).toNote()} voicing: ${voicing}`);
    console.log(scale);
    let arpNotes = generateInterval(rootNoteScaleIdx, voicing);
    let chordNotes = arpNotes;
    return [arpNotes, chordNotes];
  } else {
    // generate all notes of the interval for the arpeggio
    // todo, add more notes to interval at random? like the octave 
    // or something.
    // or randomize the voicing
    let arpNotes = generateInterval(rootNoteScaleIdx, interval);

    // pick a chord that can sit under the arpeggio
    // take the root note and pitch it down one octave
    let rootScaleNote = scale[rootNoteScaleIdx % (scale.length)];
    let pitchedDown = rootScaleNote;
    if (rootScaleNote > 24) {
      pitchedDown -= 12;
    }
    let pitchedUp = rootScaleNote + 12;

    let chordNotes = new Set([pitchedDown, ...generateTriad(rootNoteScaleIdx, 0), pitchedUp]);
    chordNotes.delete(rootScaleNote);
    return [arpNotes, Array.from(chordNotes)];
  }
}

/** 
 * Generates one octave of a key given a [tonic] and [scalePattern]
 */
function generateKeyOctave(tonic, scalePattern, octaveNum = 0) {
  let notes = scalePattern;
  let octave = notes.map((i) => tonic + i + 12*octaveNum + 24);
  return octave;
}

function playChord(synth, midiNotes, duration) {
  let notes = midiNotes.map((m) => frequencyFromNoteNumber(m));
  if (duration) {
    synth.triggerAttackRelease(notes, duration);
  } else {
    synth.triggerAttack(notes);
  }

  let stopcb = () => {
    synth.triggerRelease(notes, Tone.immediate());
    console.log(`stopped notes ${notes.map((n) => n.toNote())} . ${synth.activeVoices}`);
  }
  return stopcb;
}

/**
 * @param interval time in seconds or relative time between notes
 * @param arpPattern how the notes in the arpeggio are cycled
 * @param duration duration of arpeggio
 */
function makeArp(synth, midiNotes, arpPattern) {
  let notes = midiNotes.map((m) => frequencyFromNoteNumber(m));
  let subdivision = "8n";
  // const seq = new Tone.Sequence((time, note) => {
  //   synth.triggerAttackRelease(note, noteDuration, time);
  // }, notes, subdivision).start(0);
  const durations = ["2n", "4n", "4n.", "8n", "8n.", "16n"];

  const pattern = new Tone.Pattern({
    callback: (time, note) => {
      // the order of the notes passed in depends on the pattern
      const randomIndex = Math.floor(Math.random() * durations.length);
      let duration = "4n";
      console.log(`pattern n:${note.toNote()} t:${time} d:${duration} ${arpPattern}`);
      
      synth.triggerAttackRelease(note, duration, time);
    },
    //iterations: 4,
    probability: 1.0,
    //humanize: true,
    interval: subdivision,
    values: notes,
    pattern: arpPattern,
  });
  return pattern;
}

/** Converts from a midi note number to a frequency in hz */
// function frequencyFromNoteNumber(note) {
//   return 440 * Math.pow(2, (note - 69) / 12);
// }

function frequencyFromNoteNumber(note) {
  return Tone.Frequency(note, "midi");
}

async function togglePlaying() {
  await Tone.start();
  await canPlayPromise;
  playing = !playing;
  console.log(`togglePlaying isPlaying ${playing}`);
  
  if (playing) {
    Tone.Transport.start();
  } else {
    Tone.Transport.cancel();
    Tone.Transport.stop();
  }
  return playing;
}

function getArpPatternForKey(key) {
  let pattern = keyToArpPatternMap.get(key);
  if (pattern != undefined) {
    console.log(`get arp pattern for key ${key} pattern ${pattern}`);
  }
  return pattern;
}

function getTonicForKey(key) {
  let tonic = keyToTonicMap.get(key);
  if (tonic != undefined) {
    console.log(`get tonic note for key ${key} tonic ${tonic}`);
  }
  return tonic;
}

function getScaleNoteIndexForKey(key) {
  let id = keyToScaleMap.get(key);
  if (id != undefined) {
    console.log(`get scale idx note for key ${key} id ${id}`);
  }
  return id;
}

function getMidiNoteForKey(key) {
  let idx = keyToScaleMap.get(key);
  if (idx != undefined) {
    console.log(`get midi note for key ${key}`);
  }
  return scale[idx];
}

function getScalePatternForKey(key) {
  let pattern;
  if (key == 'm') {
    pattern = majorScalePattern;
  } else if (key == 'n') {
    pattern = minorScalePattern;
  }

  if (pattern != undefined) {
    console.log(`get scale pattern for key ${key} scale ${pattern}`);
  }
  return pattern;
}

function thread() {
  let res, rej;
  let p = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  return [p, res, rej];
}