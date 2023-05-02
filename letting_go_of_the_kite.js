
let canPlayPromise, canPlayRes, canPlayRe;
[canPlayPromise, canPlayRes, canPlayRej] = thread();

let playing = false;

let audioPlayer;
let instrument;

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

window.addEventListener("DOMContentLoaded", async (event) => {
  console.log("DOM fully loaded and parsed");
  await setup();
});

async function setup() {
  // make audio file player
  audioPlayer = new Tone.Player({
    onload: () => {
      console.log('loaded audio');
      canPlayRes();
    },
    onerror: (e) => canPlayRej(err),
    onstop: (s) => {
      console.log('player stopped');
    },
    loop: true,
    url: "assets/letting_go_of_the_kite.m4a",
    playbackRate: 1,
    volume: 10,
  });
  audioPlayer.sync();
  //audioPlayer.toDestination();

  const reverbEffect = new Tone.Reverb(.5);
  await reverbEffect.ready;

  const chorusEffect = new Tone.Chorus({
    frequency: 1,
    delayTime: 2, // ms
    depth: .25, // [0,1]
  });
  chorusEffect.sync();

  const distortionEffect = new Tone.Distortion({distortion: 0.1});
  reverbEffect.toDestination();
  audioPlayer.chain(distortionEffect, reverbEffect);


  // setup instrument
  instrument = new Instrument();
  instrument.noteToVoicingsMap = noteToVoicingsMap;
  instrument.selectedScalePattern = majorScalePattern;
  instrument.selectedInterval = [0, 2, 4];
  instrument.selectedTonic = keys[11]; // B0
  instrument.selectedOctave = 1;
  instrument.selectedArpPattern = "randomWalk";
  await instrument.ready;

  // set up event listeners on dom
  const playButton = document.getElementById("playing");
  playButton.addEventListener('click', async (_) => {
    await canPlayPromise;
    playing = await togglePlaying(playing, audioPlayer.state);
    if (playing) {
      playButton.textContent = "pause";
    } else {
      playButton.textContent = "play";
    }
  });

  setupEventListeners(audioPlayer, instrument);
}

function setupEventListeners(player, instrument) {
  let noteCount = 0; 

  document.addEventListener('keydown', (event) => {
    if (event.repeat) { return }
    console.log("keydown: " + event.key);

    const newArpPattern = getArpPatternForKey(event.key);
    if (newArpPattern != undefined) {
      instrument.selectedArpPattern = newArpPattern;
    }

    const scaleIdx = getScaleNoteIndexForKey(event.key);
    if (scaleIdx != undefined) {
      instrument.startNote(scaleIdx);
      setPlayerLoop(player, noteCount);
    }
  });

  document.addEventListener('keyup', (event) => {
    const scaleIdx = getScaleNoteIndexForKey(event.key);
    instrument.stopNote(scaleIdx);

    if (scaleIdx != undefined) {
      player.stop();
      noteCount++;
    }
    
    // if (!instrument.isPlayingSound()) {
    //   player.stop();
    // }
  });
}

function setPlayerLoop(player, count) {
  player.loop = true;
  player.loopStart = lettingGoOfTheKiteTimeStamps[(count) % lettingGoOfTheKiteTimeStamps.length];
  player.loopEnd = lettingGoOfTheKiteTimeStamps[(count + 1) % lettingGoOfTheKiteTimeStamps.length];
  player.start();
}