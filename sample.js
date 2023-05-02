let playing = false;

window.addEventListener("DOMContentLoaded", async (event) => {
  console.log("DOM fully loaded and parsed");
  await setup();
});

async function setup() {
  // setup instrument
  instrument = new Instrument();
  instrument.selectedOctave = 2;
  instrument.setupDefaultEventListeners();

  // set up event listeners on dom
  const playButton = document.getElementById("playing");
  playButton.addEventListener('click', async (_) => {
    playing = await togglePlaying(playing);
    if (playing) {
      playButton.textContent = "pause";
    } else {
      playButton.textContent = "play";
    }
  });
}