
let canPlayPromise, canPlayRes, canPlayRe;
[canPlayPromise, canPlayRes, canPlayRej] = thread();

let playing = false;

//let audioPlayer;
//let instrument;

//let phraseProgress = 0;

const lettingGoOfTheKiteTimeStamps = [
  2.23, /* wind */
  4.42, /* letting go of the kite */ 
  //7.58, /* pulled into a strip of the blue */
  10.55, /* led by two clouds */
  12.87, /* up up */
  15.03, /* and a wayward gust */
  17.66, /* sends my winking macaw */
  //18.77, /* right */
  20.39, /* down */
  22.43, /* she stutters, */
  //24.74, /* tail streaming */
  26.96, /* wings aflutter */
  28.71, /* and then */
  30.87, /* aloft */
  34.26, /* a leash far too long, */
  37.18, /* hindsight looks like a speck, */
  40.64, /* a winking macaw in the great blue, */
  44.24, /* open palms laced with rope burn, */
  47.75, /* and us, left  squinting into the light */
];

let lastPhraseStart = 0;
let lastPhraseEnd = 0;

const hasListenedToPhrase = new Array(lettingGoOfTheKiteTimeStamps.length-1);
hasListenedToPhrase.fill(false);
//hasListenedToPhrase[0] = true;

// TODO: keymap of active keys
// https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript

// TODO: double check off by one-- there could be an error
// phrase progress in viz. js might be skipping the first bc 
// event in updateProgress emits count+1

const windGusts = [
 8,
 11,
];

const transportEventIds = new Map(); // or a map

window.addEventListener("DOMContentLoaded", async (_) => {
  console.log("DOM fully loaded and parsed");
  let instrument = await instrumentSetup();
  // instrument.noteToVoicingsMap = noteToVoicingsMap;
  // instrument.selectedScalePattern = majorScalePattern;
  // instrument.selectedInterval = [0, 2, 4];
  // instrument.selectedTonic = keys[11]; // B0
  // instrument.selectedOctave = 1;
  instrument.selectedArpPattern = "randomWalk";
  instrument.arpNoteDuration = "random";
  instrument.arpSubdivision = "2n";
  instrument.arpNoteProbability = .5;

  let body = document.getElementById('content');
  body.addEventListener("phraseProgress", (e) => {
    let phraseId = e.detail.phraseId;
    // if (phraseId == 0) {
    //   console.log('resetting has listened to phrase');
    //   hasListenedToPhrase.fill(false);
    // }
    if (phraseId == 14) {
      kitePlayer.loop = false;
      //kitePlayer.stop();
    }

    console.log('phraseprogress');
    console.log(e);
    if (phraseId == 3) {
      instrument.selectedArpPattern = "randomWalk";
      instrument.arpNoteDuration = "random";
      instrument.arpSubdivision = "4n";
      instrument.arpNoteProbability = .6;
    } else if (phraseId == 5) {
      instrument.selectedArpPattern = "randomWalk";
      instrument.arpNoteDuration = "random";
      instrument.arpSubdivision = "16n";
      instrument.arpNoteProbability = .6;
    } else if (phraseId == 8) {
      instrument.selectedArpPattern = "randomWalk";
      instrument.arpNoteDuration = "32n";
      instrument.arpSubdivision = "16n";
      instrument.arpNoteProbability = .7;
    } else if (phraseId == 9) {
      instrument.selectedArpPattern = "randomWalk";
      instrument.arpNoteDuration = "random";
      instrument.arpSubdivision = "8n";
      instrument.arpNoteProbability = .5;
    } else if (phraseId == 12) {
      instrument.selectedArpPattern = "randomWalk";
      instrument.arpNoteDuration = "random";
      instrument.arpSubdivision = "4n";
      instrument.arpNoteProbability = .3;
    } else if (phraseId == 14){
      instrument.selectedArpPattern = "randomWalk";
      instrument.arpNoteDuration = "random";
      instrument.arpSubdivision = "2n";
      instrument.arpNoteProbability = .5;
    }
  });

  document.addEventListener('click', async () => {
    await Tone.start();
    Tone.Transport.start();
  });

  document.addEventListener('keydown', async () => {
    await Tone.start();
    Tone.Transport.start();
  });
});

let audioSamples;
let kitePlayer;
let windPlayer;


async function instrumentSetup() {
  // audioSamples = new Tone.Players({
  //   kite: "assets/letting_go_of_the_kite.m4a",
  //   wind: "assets/santa_fe_wind.m4a",
  // });


  // audioSamples.player('wind').sync();
  // audioSamples.player('kite').onstop = (s) => {
  //   // let position = s.toSeconds(Tone.Transport.position);
  //   // console.log(`KITE PLAYER STOPPED: ${position}`);
  //   // console.log(s);
  // }
  //audioSamples.player('kite').sync();

  kitePlayer = new Tone.Player("assets/letting_go_of_the_kite.m4a");
  windPlayer = new Tone.Player("assets/santa_fe_wind.m4a");

  const reverbEffect = new Tone.Reverb({delay: .5, preDelay: .05, wet: .75});
  await reverbEffect.ready;

  const chorusEffect = new Tone.Chorus({
    frequency: 1,
    delayTime: 2, // ms
    depth: .25, // [0,1]
  });
  chorusEffect.sync();

  const distortionEffect = new Tone.Distortion({distortion: 0.1});
  reverbEffect.toDestination();
  kitePlayer.chain(distortionEffect, reverbEffect);
  windPlayer.connect(reverbEffect);

  kitePlayer.sync();
  windPlayer.sync();
  //audioSamples.player('kite').chain(distortionEffect, reverbEffect);
  //audioSamples.player('wind').connect(reverbEffect);


  // setup instrument
  const instrument = new Instrument();
  instrument.noteToVoicingsMap = noteToVoicingsMap;
  instrument.selectedScalePattern = majorScalePattern;
  instrument.selectedInterval = [0, 2, 4];
  instrument.selectedTonic = keys[11]; // B0
  instrument.selectedOctave = 1;
  instrument.selectedArpPattern = "randomWalk";
  instrument.arpNoteDuration = "32n";
  instrument.arpSubdivision = "16n";
  await setupInstrumentEffects(instrument);

  //const playButton = document.getElementById("playing");

  //await checkPlayerLoaded(audioSamples);
  await checkPlayerLoaded(kitePlayer);
  await checkPlayerLoaded(windPlayer);
  // playButton.textContent = "play";

  // // set up event listeners on dom
  // playButton.addEventListener('click', async (_) => {
  //   playing = await togglePlaying(playing, audioSamples.state);
  //   if (playing) {
  //     playButton.textContent = "pause";
  //   } else {
  //     playButton.textContent = "play";
  //   }
  // });

  setupEventListeners(null, instrument);
  return instrument;
}

async function checkPlayerLoaded(player, resolver) {
  if (resolver == undefined) {
    [promise, resolver, rejecter] = thread();
  }

  if (player.loaded) {
    console.log('loaded');
    resolver();
  } else {
    setTimeout(() => {
      checkPlayerLoaded(player, resolver);
    }, 500);
  }
  return promise;
}

async function setupInstrumentEffects(instrument) {
  let destination = Tone.getDestination();
  // unhook all the sounds from dest
  instrument.synth.disconnect(destination);
  instrument.drum.disconnect(destination);
  instrument.strings.disconnect(destination);

  const chorusEffect = new Tone.Chorus({
    frequency: 1,
    delayTime: 2, // ms
    depth: .25, // [0,1]
    wet: .8,
  });
  chorusEffect.sync();

  const reverbEffect = new Tone.Reverb({delay: .5, preDelay: .1, wet: .7});
  await reverbEffect.ready;

  const distortionEffect = new Tone.Distortion({distortion: 0.3, wet: .7});

  const feedbackDelayEffect = new Tone.FeedbackDelay({
    delayTime: "8n", feedback: 0.25, wet: .75,
  });

  feedbackDelayEffect.toDestination();
  reverbEffect.toDestination();

  instrument.volume = -10;
  instrument.strings.set({volume: -15});

  instrument.synth.chain(chorusEffect, reverbEffect);
  instrument.drum.connect(feedbackDelayEffect);
  instrument.strings.chain(distortionEffect, feedbackDelayEffect);
}

function setupEventListeners(samples, instrument) {
  // let phraseProgress = phr;
  // let kitePlayer = samples.player('kite');
  // let windPlayer = samples.player('wind'); 

  document.addEventListener('keydown', (event) => {
    // let phraseProgress = hasListenedToPhrase.findIndex((e) => !e);
    // updatePhraseProgress(phraseProgress);
    //phraseProgress = updatePhraseProgress(phraseProgress);

    if (event.repeat) { return }
    let phraseProgress = hasListenedToPhrase.findIndex((e) => !e);
    updatePhraseProgress(phraseProgress);
    console.log("keydown: " + event.key + " prog " + phraseProgress);

    const newArpPattern = getArpPatternForKey(event.key);
    if (newArpPattern != undefined) {
      instrument.selectedArpPattern = newArpPattern;
    }

    const scaleIdx = getScaleNoteIndexForKey(event.key);
    if (scaleIdx != undefined) {
      lastPhraseEnd = Tone.Transport.now();
      instrument.startNote(scaleIdx);
      setKiteLoop(kitePlayer, phraseProgress);
      if (phraseProgress == 3) {
        // set wind loop
        if (windPlayer.state != 'started') {
          console.log('wind!');
          windPlayer.loop = true;
          windPlayer.loopStart = windGusts[0];
          windPlayer.loopEnd = windGusts[1];
          windPlayer.start("+.75d");
        } else {
          console.log('wind already started');
        }
      } else if (windPlayer.state == 'started') {
        console.log('STOP WIND???');
        console.log(windPlayer.state);
        windPlayer.loop = false;
        windPlayer.stop();
      }

      // uncomment and remove the chek on hasListenedToPhrase to 
      // restore original behavior
      // phraseProgress = updatePhraseProgress(phraseProgress);
    }
  });

  document.addEventListener('keyup', (event) => {
    const scaleIdx = getScaleNoteIndexForKey(event.key);
    instrument.stopNote(scaleIdx);
    // if (scaleIdx != undefined || !instrument.isPlayingSound()) {
    //   updatePhraseProgress(phraseProgress);
    //   lastPhraseEnd = Tone.Transport.now();
    //   samples.stopAll();
    // }

    if (scaleIdx != undefined) {
      let phraseProgress = hasListenedToPhrase.findIndex((e) => !e);
      updatePhraseProgress(phraseProgress);
    }

    // stop the samples if there's nothing playing
    if (!instrument.isPlayingSound()) {
      console.log('should stop all samples');
      lastPhraseEnd = Tone.Transport.now();
      //samples.stopAll();
      windPlayer.stop();
      kitePlayer.stop();
    }
    console.log('keyup next phrase' + phraseProgress);
  });
}

function updatePhraseProgress(nextPhrase) {
  // only update the phrase progress if we've listened to it at least once
  let current = nextPhrase;
  let elapsed = (lastPhraseEnd-lastPhraseStart)/1000;
  console.log(`updatePhrase progress before: ${current} ${lastPhraseStart} ${lastPhraseEnd} ${elapsed}`);
  if (current < 0) return;
  console.log(hasListenedToPhrase);
  if (hasListenedToPhrase[current-1]) {
    console.log('inner loop LISTENED UPDATE PHRASE PROGRESS before: ', current);
    //let phraseProgress = (1 + current) % lettingGoOfTheKiteTimeStamps.length;
    let phraseProgress = (current) % lettingGoOfTheKiteTimeStamps.length;

    let body = document.getElementById('content');
    const phraseEvent = new CustomEvent("phraseProgress", {
      bubbles: true,
      detail: {
        phraseId: phraseProgress,
      }
    });
    body.dispatchEvent(phraseEvent);
    lastPhraseStart = 0;
    lastPhraseEnd = 0;
  }

  return phraseProgress;
}

function setKiteLoop(player, count) {
  let phraseStartIdx = count % (lettingGoOfTheKiteTimeStamps.length-1);
  let phraseEndIdx = (count + 1) % (lettingGoOfTheKiteTimeStamps.length-1);
  let duration = lettingGoOfTheKiteTimeStamps[phraseEndIdx] - lettingGoOfTheKiteTimeStamps[phraseStartIdx];
  
  // the effect of this setup is that you have to have a keydown the the entire duration of the loop
  // at least once.
  // let eventId = Tone.Transport.scheduleOnce(() => {
  //   hasListenedToPhrase[count] = true;
  //   console.log(`finished playing kite section ${count} duration ${duration}`);
  // }, `+${duration - .25}`);
  // if (transportEventIds.has(count)) {
  //   let id = transportEventIds.get(count);
  //   console.log(`cancelling transport event id ${id} for portion ${count}`);
  //   Tone.Transport.cancel(id);
  // }
  // transportEventIds.set(count, eventId);
  // player.loop = true;
  // player.loopStart = lettingGoOfTheKiteTimeStamps[phraseStartIdx];
  // player.loopEnd = lettingGoOfTheKiteTimeStamps[phraseEndIdx];
  // player.start();

  // option 2 (to try): dont reset the id every time, make it such that
  // if you've played any portion of the current sample for the duration of the
  // snippet, you can move on
  let currentPosition = lettingGoOfTheKiteTimeStamps[phraseStartIdx] + ((lastPhraseEnd - lastPhraseStart)/1000)%duration;
  console.log(`player wants to seek to ${currentPosition} state ${player.state} count ${count}`);
  if (!transportEventIds.has(count)) {
    console.log(`NEW scheduling new kite section ${count} (pStart: ${phraseStartIdx} pend ${phraseEndIdx}) duration ${duration} elapsed: ${lastPhraseEnd-lastPhraseStart}`);
    lastPhraseStart = Tone.Transport.now();

    let eventId = Tone.Transport.scheduleOnce(function() {
      hasListenedToPhrase[phraseStartIdx] = true;
      console.log(`DONE finished playing kite section ${count} (pStart: ${phraseStartIdx} pend ${phraseEndIdx}) duration ${duration} elapsed: ${lastPhraseEnd-lastPhraseStart}`);
      // lastPhraseStart = 0;
      // lastPhraseEnd = 0;

      // uncomment to advance phrase automatically
      //updatePhraseProgress(count);
      //transportEventIds.delete(count);
    }, `+${duration}`);
    transportEventIds.set(count, eventId);

    player.loop = true;
    player.loopStart = lettingGoOfTheKiteTimeStamps[phraseStartIdx];
    player.loopEnd = lettingGoOfTheKiteTimeStamps[phraseEndIdx];

    if (player.state != 'started') {
      player.start();
    }
  } else {
    player.seek(currentPosition);
    if (player.state != 'started') {
      player.start();
    }
    // let currentPosition = lettingGoOfTheKiteTimeStamps[phraseStartIdx] + ((lastPhraseEnd - lastPhraseStart)/1000)%duration;
    // console.log(`player wants to seek to ${currentPosition} state ${player.state}`);
    // if (player.state != 'started') {
    //   let currentPosition = lettingGoOfTheKiteTimeStamps[phraseStartIdx] + ((lastPhraseEnd - lastPhraseStart)/1000)%duration;
    //   let elapsed = (lastPhraseEnd - lastPhraseStart)/1000;

    //   console.log(`seeking to last known spot: ${count} ${currentPosition}; elapsed: ${elapsed} start ${lastPhraseStart} end ${lastPhraseEnd} duration: ${duration}`);
    //   player.seek(currentPosition);
    //   player.start();
    // }
  }

  // if (player.state != 'started' || player.st) {
  //   player.start();
  // }
  
  // player.loop = true;
  // player.loopStart = lettingGoOfTheKiteTimeStamps[count];
  // player.loopEnd = lettingGoOfTheKiteTimeStamps[(count + 1) % lettingGoOfTheKiteTimeStamps.length];
  // player.start();
}

// desired behavior
// key down 
// get last listened to phrase => #
// a phrase starts #+1 - #+2
// constraints:
// * phrase plays for at least as long as duration (#+2 - #+1)
// * on keyup, phrase pauses
// * when subsequent keydown is pressed, phrase resumes
// when duration (#+2 - #+1) has passed, we have opportunity to increment phrase progress
// loops while key is down