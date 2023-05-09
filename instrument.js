// class InstrumentGenerator {
//   activelyPlaying;

//   constructor() {
//     this.activelyPlaying = new Map();
//   }

//   /**  */
//   generate(scaleIdx);

//   startNote();

//   stopNote();
// }

// class Strings extends InstrumentGenerator {
//   selectedArpPattern;
//   activelyPlaying;

//   constructor() {
//     this.activelyPlaying = new Map();
//   }

//   /**  */
//   generate();

//   startNote();

//   stopNote();
// }

const majorIntervalAbsolute = [0, 4, 7, 11];
const minorIntervalAbsolute = [0, 3, 7, 10];
const powerIntervalAbsolute = [0, 7, 12];

const PlayMode = {
  Voices: "voices",
  Normal: "normal",
};
let playMode = PlayMode.Normal;

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
    [0,4,7,9 /* a# dim: a#,e,a#,c# */],
    [0,2,4 /* a#dim: a#,c#,e */],
  ]],
  [7, [
    [0,2,4],
    [0,4,7,11 /* b: b,f#,b,d# */],
    [0,3,7,9,11 /* Badd4: b,e,b,d#,f# */],
    [0,2,3,4 /* Badd4: b,d#,e,f# */],
    // [7,9,11],
    // [7,11,14,16 /* b: b,f#,b,d# */],
    // [7,10,14,16,18 /* Badd4: b,e,b,d#,f# */],
    // [7,9,10,11 /* Badd4: b,d#,e,f# */],
  ]],
]);

// Array representing octave [C0, B0]
//24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
const keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const majorScalePattern = [0, 2, 4, 5, 7, 9, 11]; // harcoded major scale pattern (semitones above tonic)
const minorScalePattern = [0, 2, 3, 5, 7, 8, 10]; // harcoded minor scale pattern (semitones above tonic)

class Instrument {
  #selectedScalePattern = majorScalePattern;
  #selectedInterval = [0, 2, 4];
  #selectedTonic = keys[0];
  #selectedOctave = 1;
  selectedArpPattern = "randomWalk";
  selectedPlayMode = playMode;

  arpSubdivision = "4n";
  arpNoteDuration = "4n";
  arpNoteProbability = .8;

  #scale = generateKeyOctave(this.#selectedTonic, this.#selectedScalePattern, this.#selectedOctave);

  #noteToVoicingsMap;

  //ready;

  set selectedScalePattern(val) {
    this.#selectedScalePattern = val;
    this.#scale = generateKeyOctave(this.#selectedTonic, this.#selectedScalePattern, this.#selectedOctave);
  }

  set selectedTonic(val) {
    this.#selectedTonic = val;
    this.#scale = generateKeyOctave(this.#selectedTonic, this.#selectedScalePattern, this.#selectedOctave);
  }

  set selectedOctave(val) {
    this.#selectedOctave = val;
    this.#scale = generateKeyOctave(this.#selectedTonic, this.#selectedScalePattern, this.#selectedOctave);
  }

  set noteToVoicingsMap(val) {
    this.#noteToVoicingsMap = val;
    this.selectedPlayMode = PlayMode.Voices;
  }

  set volume(val) {
    this.synth.set({"volume": val});
    this.strings.set({"volume": val});
    this.drum.set({"volume": val});
  }

  // map of notes that are actively playing
  // key = scaleidx, val = callback function to stop notes
  activelyPlaying;

  // instruments
  strings;
  synth;
  drum;
  //player;

  constructor() {
    this.activelyPlaying = new Map();
    this.setupSounds();
  }

  setupSounds() {
    // const chorusEffect = new Tone.Chorus({
    //   frequency: 1,
    //   delayTime: 2, // ms
    //   depth: .25, // [0,1]
    // });
    // chorusEffect.sync();

    // const reverbEffect = new Tone.Freeverb({
    //   roomSize: .5, dampening: 1000,
    // }).toDestination();
    // const reverbEffect = new Tone.Reverb(.8);
    // await reverbEffect.ready;
    // resolver();
    // //reverbEffect.sync();

    // const distortionEffect = new Tone.Distortion({distortion: 0.3});
    // //distortionEffect.sync();

    // const feedbackDelayEffect = new Tone.FeedbackDelay({
    //   delayTime: "8n", feedback: 0.25,
    // });
    //feedbackDelayEffect.sync();

    // this.drum = new Tone.MembraneSynth({
    //   oscillator: {
    //     type: "square"
    //   },
		// 	pitchDecay: 0.008,
		// 	octaves: 2,
		// 	envelope: {
		// 		attack: 0.0006,
		// 		decay: 0.001,
		// 		sustain: 0,
    //     release: 0,
		// 	}
		// }).toDestination();

    this.drum = new Tone.MembraneSynth({
      //volume: -10,
			pitchDecay: .0008,
			octaves: 2,
			envelope: {
				attack: 0.0006,
				decay: 1.0,
				sustain: 0,
				release: 1.0,
			}
		});
    this.drum.sync();

    // const conga = new Tone.MembraneSynth({
		// 	pitchDecay: .0008,
		// 	octaves: 2,
		// 	envelope: {
		// 		attack: 0.0006,
		// 		decay: 1.0,
		// 		sustain: 0,
		// 		release: 1.0,
		// 	}
		// }).toDestination();

    this.synth = new Tone.PolySynth({
      "envelope": {
        "attack": 0.5,
        "decay": .1,
        "sustain": 0.3,
        "release": 0,
      },
      portamento: .1,
      //partialCount: 2,
      //"volume": -10,
    });
    this.synth.sync();

    this.strings = new Tone.PolySynth({
      oscillator: {
        type: "square"
      },
      "envelope": {
        "attack": 0.1,
        "decay": 0.1,
        "sustain": 0.25,
        "release": .1,
      }
    });
    this.strings.sync();

    this.drum.toDestination();
    this.strings.toDestination();
    this.synth.toDestination();

    // this.strings = new Tone.PolySynth(
    //   Tone.MetalSynth, { 
    //     harmonicity: 12,
    //     resonance: 800,
    //     modulationIndex: 2,
    //     envelope: {
    //       decay: 0.4,
    //     },
    //   },
    // );
    // this.strings.sync();

    // feedbackDelayEffect.toDestination();
    // //distortionEffect.toDestination();
    // reverbEffect.toDestination();
    // //chorusEffect.toDestination();

    // this.synth.chain(chorusEffect, reverbEffect);
    // this.drum.connect(feedbackDelayEffect);
    // //this.synth.toDestination();
    // // this.synth.chain(distortionEffect, feedbackDelayEffect, reverbEffect);
    // //this.synth.chain(feedbackDelayEffect, reverbEffect);
    // this.strings.chain(distortionEffect, feedbackDelayEffect);
    // //dthis.strings.toDestination();
  }

  isPlayingSound() {
    if (this.synth.activeVoices == 0 && this.strings.activeVoices == 0) {
      return false;
    } else {
      return true;
    }
  }

  silence() {
    this.activelyPlaying.forEach((stop) => stop());
    this.synth.releaseAll();
    this.strings.releaseAll();
  }

  setupDefaultEventListeners() {
    document.addEventListener('keydown', (event) => {
      if (event.repeat) { return }
      console.log("keydown: " + event.key);
  
      const newArpPattern = getArpPatternForKey(event.key);
      if (newArpPattern != undefined) {
        this.selectedArpPattern = newArpPattern;
      }
  
      const newScalePattern = getScalePatternForKey(event.key);
      if (newScalePattern != undefined) {
        this.selectedScalePattern = newScalePattern;
      }
  
      const newTonic = getTonicForKey(event.key);
      if (newTonic != undefined) {
        this.selectedTonic = newTonic;
      }
  
      const scaleIdx = getScaleNoteIndexForKey(event.key);
      if (scaleIdx != undefined) {
        // stop the currently playing note, if it exists
        this.startNote(scaleIdx);
      }
    });

    document.addEventListener('keyup', (event) => {
      const scaleIdx = getScaleNoteIndexForKey(event.key);
      this.stopNote(scaleIdx);
    });
  }

  startNote(scaleIdx) {
    console.log('instrument start note ' + scaleIdx);
    this.stopNote(scaleIdx);
    let stopcb = this.#startNote(scaleIdx);
    this.activelyPlaying.set(scaleIdx, stopcb);
  }

  #startNote(scaleIdx) {
    //let chord = generateTriad(scaleIdx);
    // let chord = generateInterval(scaleIdx, selectedInterval);
    // let arp = makeArp(strings, chord, arpPattern);
    // let playChordStop = playChord(synth, chord);
  
    let [arpNotes, chordNotes] = this.generateNotes(scaleIdx);
    let drumSeq = this.makeDrumPart(this.drum);
    //console.log("arpNotes, chordNotes");
    //console.log(arpNotes, arpNotes.map((n) => Tone.Frequency(n, "midi").toNote()));
    //console.log(chordNotes, chordNotes.map((n) => Tone.Frequency(n, "midi").toNote()));
    //let arp = makeArp(this.strings, arpNotes, this.selectedArpPattern, "8n", "random");
    //let arp = makeArp(this.strings, arpNotes, this.selectedArpPattern, "4n", "random");

    let arp = makeArp(this.strings, arpNotes, this.selectedArpPattern, this.arpSubdivision, this.arpNoteDuration, this.arpNoteProbability);

    let playChordStop = playChord(this.synth, chordNotes);
    arp.start(0);
    drumSeq.start(0);
    let stopCb = () => {
      // cancel necessary?
      playChordStop();
      drumSeq.stop();
      arp.cancel();
      arp.stop();
      arp.dispose();
    }
    return stopCb;
  }
  
  stopNote(scaleIdx) {
    let stopcb = this.activelyPlaying.get(scaleIdx);
    if (stopcb != undefined) {
      console.log('stop note ' + scaleIdx);
      this.activelyPlaying.delete(scaleIdx);
      stopcb();
    }
    this.synth.releaseAll();
  }

  makeDrumPart(synth) {
    // const seq = new Tone.Sequence((time, note) => {
    //   synth.triggerAttackRelease(note, 0.1, time);
    //   // subdivisions are given as subarrays
    // }, ["B0", null, [null, "B0", "B0"], null], "4n");
    // const seq = new Tone.Sequence((time, note) => {
    //   synth.triggerAttackRelease(note, 0.1, time);
    //   // subdivisions are given as subarrays
    // }, ["A0", null, ["A0", "A0"], null], "8n");
    const seq = new Tone.Sequence((time, note) => {
      synth.triggerAttackRelease(note, 0.1, time);
      // subdivisions are given as subarrays
    }, [null, "B0", null, null], "8n");
    return seq;
  }
  
  generateNotes(rootNoteScaleIdx) {
    let scale = this.#scale;
    if (this.selectedPlayMode == PlayMode.Voices) {
      let voicings = this.#noteToVoicingsMap.get(rootNoteScaleIdx) ?? [[0,2,4]];
      let vid = Math.floor(Math.random() * voicings.length);
      let voicing = voicings[vid];
      let rootScaleNote = scale[rootNoteScaleIdx % (scale.length)];
      //console.log(`voices playmode for note#: ${rootNoteScaleIdx} ${frequencyFromNoteNumber(rootScaleNote).toNote()} voicing: ${voicing}`);
      //console.log(scale);
      let arpNotes = generateInterval(rootNoteScaleIdx, voicing, scale);
      let chordNotes = arpNotes;
      return [arpNotes, chordNotes];
    } else {
      // generate all notes of the interval for the arpeggio
      // todo, add more notes to interval at random? like the octave 
      // or something.
      // or randomize the voicing
      let interval = this.#selectedInterval;
      let arpNotes = generateInterval(rootNoteScaleIdx, interval, scale);
  
      // pick a chord that can sit under the arpeggio
      // take the root note and pitch it down one octave
      let rootScaleNote = scale[rootNoteScaleIdx % (scale.length)];
      let pitchedDown = rootScaleNote;
      if (rootScaleNote > 24) {
        pitchedDown -= 12;
      }
      let pitchedUp = rootScaleNote + 12;
  
      let chordNotes = new Set([pitchedDown, ...generateTriad(rootNoteScaleIdx, 0, scale), pitchedUp]);
      chordNotes.delete(rootScaleNote);
      return [arpNotes, Array.from(chordNotes)];
    }
  }
}

function generateTriad(rootNoteScaleIdx, seventhChance = .5, scale) {
  const intervals = [[0,2,4], [0,4,9], [0,4,7,9]]; 
  let vid = Math.floor(Math.random() * intervals.length);
  let interval = intervals[vid];

  if (Math.random() < seventhChance) {
    interval.push(6);
  }
  console.log(`generate chord ${rootNoteScaleIdx + 1}`);
  return generateInterval(rootNoteScaleIdx, interval, scale);
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