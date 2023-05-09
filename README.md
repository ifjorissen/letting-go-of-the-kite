ideas
* make some of these photos transparent to create more layered effects like this https://editor.p5js.org/Pterodactyl_/sketches/SOu6kuuab
* use spatialized audio to pan according to kite placement
* reverb and other effects
* add a drum / some kind of beat (where does the beat come from)
* determine tempo from some outer source (might be fluctuating)
* find nice chord progression and arpeggios
* play certain parts of the piece when a key is pressed but dont be proscriptive about ordering
* p5.speech https://idmnyu.github.io/p5.js-speech/
* overall volume mixing (Tone.Channel)
* visuals that correspond with timestamps
- add graininess
* consider adding an fsm so that the piece only progresses when certain chords are played
* play a gust of wind when "a wayward gust" plays
* more ambient nature sounds -- birds, wind

// fish eye effect
https://editor.p5js.org/SihanZhang/sketches/naEWR6UUV (magnifying glass?)



refactor:
instrument.js
- Instrument should be an interface
* startNote
* stopNote
* generateNotes

Four instruments
* strings
* drum
* synth
* audio player

New class: Ensemble
Ensemble 
* takes a group of instruments
* sets up event listeners (?)
* manages current scale / tonic / etc
* manages startnote / stopNote / generateNotes for each instrument
* exposes ability to manipulate volume, tempo, overall mix

New class (or just the main script)
* creates instruments, sets up effect chain
* choreographs the actual performance by manipulating the instruments & ensemble

Visualization
* p5 performance tips https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance
* control alpha with tint(), add filters with filter() (https://p5js.org/reference/#/p5/filter)
* image processing tutorials https://idmnyu.github.io/p5.js-image/
* add grain to images https://github.com/meezwhite/p5.grain and techniques: https://www.fxhash.xyz/article/all-about-that-grain
* also consider: p5.Riso 
* glitch effects: https://p5.glitch.me/
* generate a noise texture https://www.noisetexturegenerator.com/
* use css filters to manipulate images
* use <img> elements in p5 (perf diffs??) https://github.com/processing/p5.js/wiki/Beyond-the-canvas



// todo:
trigger animation sequences at specific times during the playback, rather than just chaining them
