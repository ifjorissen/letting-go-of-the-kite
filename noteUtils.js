async function togglePlaying(playing, playerState) {
  await Tone.start();
  playing = !playing;
  console.log(`togglePlaying isPlaying ${playing}`);
  
  if (playing) {
    Tone.Transport.start();
  } else {
    if (playerState == "started") {
      console.log("pause");
      // Use the Tone.Transport to pause audio
      Tone.Transport.cancel();
      Tone.Transport.pause();
    } else {
      Tone.Transport.cancel();
      Tone.Transport.stop();
    }
  }
  return playing;
}

function thread() {
  let res, rej;
  let p = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  return [p, res, rej];
}

/**
 * @param synth the synth to play the note of the arpeggio
 * @param midiNotes the notes to use in the arpeggio
 * @param arpPattern how the notes in the arpeggio are cycled
 * @param subdivision time in seconds or relative time between notes
 * @param duration duration of arpeggio
 */
 function makeArp(synth, midiNotes, arpPattern, subdivision="8n", duration="4n", probability = .8) {
  let initialDuration = duration;
  let notes = midiNotes.map((m) => frequencyFromNoteNumber(m));
  // const seq = new Tone.Sequence((time, note) => {
  //   synth.triggerAttackRelease(note, noteDuration, time);
  // }, notes, subdivision).start(0);
  const durations = ["2n", "4n", "4n.", "8n", "8n.", "16n"];

  const pattern = new Tone.Pattern({
    callback: (time, note) => {
      // the order of the notes passed in depends on the pattern
      const randomIndex = Math.floor(Math.random() * durations.length);
      if (duration == undefined || duration == "randomOnce" || initialDuration == "random") {
        duration = durations[randomIndex];
      }
      //console.log(`pattern n:${note.toNote()} t:${time} d:${duration} ${randomIndex} ${arpPattern}`);
      synth.triggerAttackRelease(note, duration, time);
    },
    //iterations: 4,
    probability:  probability,
    humanize: "32n",
    interval: subdivision,
    values: notes,
    pattern: arpPattern,
  });
  return pattern;
}

// function makeDrumPart(synth) {
//   const seq = new Tone.Sequence((time, note) => {
//     synth.triggerAttackRelease(note, 0.1, time);
//     // subdivisions are given as subarrays
//   }, ["A0", null, ["A0", "A0"], null], "4n");
//   return seq;
// }

function generateInterval(rootNoteScaleIdx, interval, scale) {
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


function generateKeyOctave(tonic, scalePattern, octaveNum = 0) {
  let notes = scalePattern;
  let octave = notes.map((i) => tonic + i + 12*octaveNum + 24);
  return octave;
}

function frequencyFromNoteNumber(note) {
  return Tone.Frequency(note, "midi");
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

function getIntervalFromString(str) {
  return str.split(',').map((e) => parseInt(e, 10));
}