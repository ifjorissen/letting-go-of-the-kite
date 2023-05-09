// structure
// var moments = [
//   {}
// ];

// image(img, x, y, [width], [height])
// image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight], [fit], [xAlign], [yAlign])

// image /video
// let img = {
//   "fileName": 'abc.jpg',
//   "pos": [x, y],
//   "animation": {
//     "startPos": [x,y], // [0,1] going to be normalized for the sketch w/h
//     "destPos": [x,y],
//     "duration": 1, // ms, how long to go from startPos to destPos
//     "loop": true // whether or not the animation loops as the 
//   },
//   "effect": {
//     // todo -- grain, flicker?
//   },
// };

// window.addEventListener("DOMContentLoaded", () => {
//   console.log("DOM fully loaded and parsed");
//   setup();
// });

// const lettingGoOfTheKiteTimeStamps = [
//  0 2.23, /* wind */
//  1 4.42, /* letting go of the kite */
//   //7.58, /* pulled into a strip of the blue */
//  2 10.55, /* led by two clouds */
//  3 12.87, /* up up */
//  4 15.03, /* and a wayward gust */
//  5 17.66, /* sends my winking macaw */
//   //18.77, /* right */
//  6 20.39, /* down */
//  7 22.43, /* she stutters, */
//   //24.74, /* tail streaming */
//  8 26.96, /* wings aflutter */
//  9 28.71, /* and then */
//  10 30.87, /* aloft */
//  11 34.26, /* a leash far too long, */
//  12 37.18, /* hindsight looks like a speck, */
//  13 40.64, /* a winking macaw in the great blue, */
//  14 44.24, /* open palms laced with rope burn, */
//  15 47.75, /* and us, left  squinting into the light */
// ];

let instructionsAcked = false;
let instructionText = 'come here';

let cloudCorner, cloudA, cloudB, cloudC, sky, kite, portlandRain, grass, desertBush, driftwood, reeds, georgiaTrees, kiteWalking, sand, city;
let renderables;
let firstScene, introScene, upUpScene, waywardGustScene, rightDownScene, stuttersScene, aloftScene, hindsightScene, squintingIntoTheLightScene;
let currentRenderableSettings;
function preload() {
  //loading all three images
  cloudCorner = loadImage ('assets/cloud_corner.png');
  cloudA = loadImage('assets/cloud2.png');
  cloudC = loadImage('assets/cloud3.png');
  cloudB = loadImage('assets/nice_cloud1.png');
  sky = loadImage ('assets/single_cloud_sky.jpg');
  kite = loadImage ('assets/kite_only.png');
  portlandRain = loadImage('assets/portland_park_rain.gif');
  grass = loadImage('assets/grass.png');
  magnifyingGlass = loadImage('assets/magnifying_glass_hand.png');
  desertBush = loadImage('assets/desert_bush.jpeg');
  driftwood = loadImage('assets/driftwood.jpeg');
  reeds = loadImage('assets/reeds.jpeg');
  georgiaTrees = loadImage('assets/georgia_trees.jpeg');
  kiteWalking = loadImage('assets/kite_walking.JPG');
  sand = loadImage('assets/sand.jpeg');
  city = loadImage('assets/city.jpeg');
}

let phraseProgress = 0;

let kaleidoscopeProps = {
  mask: undefined,
  shape: undefined,
  slices: 8,
  renderables: undefined,
};

function setup() {
  //canvas.parent('body');
  cursor(HAND);
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');
  let body = document.getElementById("content");
  body.addEventListener("phraseProgress", (e) => {
    phraseProgress = e.detail.phraseId;
    console.log(`viz phrase progress listener ${e.detail.phraseId} starting phrase: ${phraseProgress}`);
    draw();
  });

  kaleidoscopeProps.shape = calcStuff(width, height, kaleidoscopeProps.slices);
  kaleidoscopeProps.mask = createMask(kaleidoscopeProps.shape.a, kaleidoscopeProps.shape.o);
  kaleidoscopeProps.renderables = initialObjSettings(width, height);
}

function mouseMoved() {
  if ((mouseX - width/2 < 20) && (mouseY-height/2 < 20)) {
    instructionText = 'hold a,s,d,f or h,j,k,l one at a time';
  }
}

function keyPressed() {
  let currentKey = key;
  if (currentKey != undefined && keyToScaleMap.has(currentKey)) {
    instructionsAcked = true;
    instructionText = '';
  }
}

function draw() {
  clear();

  if (!instructionsAcked) {
    if (firstScene == undefined || firstScene.finished) {
      firstScene = setupIdleScene();
    }
    firstScene.update();
    firstScene.render();
    rotateText(instructionText, width/2, height/2, width/8);
    return; 
  }

  switch (phraseProgress) {
    case 0:
    case 1:
      if (introScene == undefined || introScene.finished) {
        console.log('creating intro scene');
        firstScene.dispose();
        clear();
        introScene = setupIntro();
      }
      // TODO: consider adding `dispose` and/or restart to MovableScene
      introScene.update();
      introScene.render();
      break;
    // up up
    case 2: 
      if (upUpScene == undefined || upUpScene.finished) {
        introScene.dispose();
        console.log('creating up up scene');
        upUpScene = setupUpUp(introScene);
      }
      upUpScene.update();
      upUpScene.render();
      break;
    // and a wayward gust
    case 3:
    // sends my winking macaw
    case 4:
      // TODO: kaleidoscope
      //console.log(phraseProgress)
      if (waywardGustScene == undefined || waywardGustScene.finished) {
        upUpScene.dispose();
        waywardGustScene = setupAWaywardGust(upUpScene);
      }
      waywardGustScene.update();
      waywardGustScene.render();
      // push();
      // scale(.5);
      // //translate(-100, -200)
      // //rotate(PI/2)
      // shearY(PI/4);
      // waywardGustScene.render();
      // pop();

      push();
      translate(width-.5*width, 0);
      scale(.5);
      shearY(PI/8);
      //translate(-mx, -my);
      waywardGustScene.render();
      pop();
    
      push();
      scale(.5);
      let translateY = tan(-PI/8)*width;
      translate(0, -translateY);
      shearY(-PI/8);
      waywardGustScene.render();
      pop();

      // push();
      // scale(.5);
      // translate(-100, 300)
      // shearY(-PI/4);
      // upUpScene.render();
      // pop();

      // push();
      // scale(.5);
      // shearY(PI/4);
      // upUpScene.render();
      // pop();
      // push();
      // scale(.5);
      // shearY(-PI/4);
      // //upUpScene.update();
      // upUpScene.render();
      // pop();
      break;
    // right down
    case 5:
      if (rightDownScene == undefined || rightDownScene.finished) {
        waywardGustScene.dispose();
        console.log('creating right down scene');
        rightDownScene = setupRightDown(waywardGustScene);
      }
      rightDownScene.update();
      rightDownScene.render();
      // if (rightDownScene == undefined || rightDownScene.finished) {
      //   waywardGustScene.dispose();
      //   console.log('creating right down scene');
      //   console.log(phraseProgress);
      //   rightDownScene = setupRightDown(waywardGustScene);
      // }
      // rightDownScene.update();
      // rightDownScene.render();
      break;
    // she stutters
    case 6:
    // tail streaming, wings aflutter
    case 7:
    // and then...
    case 8:
      if (stuttersScene == undefined || stuttersScene.finished) {
        rightDownScene.dispose();
        console.log('creating stutters scene');
        stuttersScene = setupStutters(rightDownScene);
      }
      stuttersScene.update();
      stuttersScene.render();

      let kiteObj = stuttersScene.get('kite');
      let jitter = 3*Math.random();
      push();
      translate(-10 + jitter, height/20);
      kiteObj.render();
      translate(10, 0);
      kiteObj.render();

      translate(-10 + jitter, height/20);
      kiteObj.render();
      translate(10, 0);
      kiteObj.render();

      translate(-10 + jitter, height/20);
      kiteObj.render();
      translate(jitter, 0);
      kiteObj.render();
      pop();
      break;
    // aloft
    case 9:
    // a leash far too long TODO: its own scene
    case 10:
      if (aloftScene == undefined || aloftScene.finished) {
        stuttersScene.dispose();
        console.log('creating aloft scene');
        aloftScene = setupAloft(stuttersScene);
      }
      aloftScene.update();
      aloftScene.render();
      break;
    // // a leash far too long
    // case 11:
    //  break;
    // hindsight looks like a speck
    case 11:
    // a winking macaw in the great blue
    case 12:
    // open palms laced with rope burn
    case 13:
        //break;
      let skyObj = aloftScene.get('sky');
      skyObj.render();
      createShapesForKaleidoscope();
      mirror(kaleidoscopeProps);

      if (hindsightScene == undefined || hindsightScene.finished) {
        aloftScene.dispose();
        console.log('creating hindsight scene');
        console.log(hindsightScene);
        hindsightScene = setupHindsight(aloftScene);
      }
      hindsightScene.update();
      hindsightScene.render();
      let magnifying = hindsightScene.get('magnifyingGlass');
      // shrink the aloft scene into the magnifying glass over time
      push()
      translate(magnifying.x + (width-magnifying.x)/5, magnifying.y + (height-magnifying.y)/5);
      scale(.2);
      aloftScene.update();
      aloftScene.render();
      pop();
      // tile in other memories

      break;
    // a winking macaw in the great blue
    // case 13:
    //   //break;
    // // open palms laced with rope burn
    // case 14:
    //   //break;
    // and us, left squinting into the light
    case 14:
    default:
      if (squintingIntoTheLightScene == undefined || squintingIntoTheLightScene.finished) {
        console.log('creating squinting into the light scene');
        squintingIntoTheLightScene = setupSquintingIntoTheLight();
      }
      squintingIntoTheLightScene.update();
      squintingIntoTheLightScene.render();
      break;
  }
}

let initialObjSettings = function(sketchWidth, sketchHeight) {
  let onIdleCallback = function(x, y) {
    if (deltaTime == 0) return;
    let target = createVector((x + 1 * (deltaTime / 20)) % width, y);
    this.moveTo(target);
  }

  let kiteAspectRatio = kite.width/kite.height;
  let kiteWidth = sketchWidth/6;
  let kiteHeight = kiteWidth/kiteAspectRatio;

  let cloudAAspectRatio = cloudA.width/cloudA.height;
  let desiredCloudAWidth = sketchWidth/3;
  let desiredCloudAHeight = desiredCloudAWidth/cloudAAspectRatio;

  let cloudBAspectRatio = cloudB.width/cloudB.height;
  let desiredCloudBWidth = sketchWidth/3;
  let desiredCloudBHeight = desiredCloudBWidth/cloudBAspectRatio;

  let cloudCornerAspectRatio = cloudCorner.width/cloudCorner.height;
  let desiredCloudCornerWidth = sketchWidth/1.5;
  let desiredCloudCornerHeight = desiredCloudCornerWidth/cloudCornerAspectRatio;

  // TODO: sky hight maybe should be sketchWidth*aspectRatio? or sketchWidth/aspect
  let skyAspectRatio = sky.width/sky.height;
  let desiredSkyWidth = sketchWidth;
  let desiredSkyHeight = sketchHeight*skyAspectRatio;

  let portlandRainAspectRatio = portlandRain.width/portlandRain.height;
  let desiredPortlandRainWidth = sketchWidth;
  let desiredPortlandRainHeight = sketchHeight;
  // let desiredPortlandRainHeight = sketchHeight;
  // let desiredPortlandRainWidth = desiredPortlandRainHeight*portlandRainAspectRatio;
  //let desiredPortlandRainWidth = sketchWidth;
  //let desiredPortlandRainHeight = desiredPortlandRainWidth / portlandRainAspectRatio;

  let grassAspectRatio = grass.width/grass.height;
  let desiredGrassWidth = sketchWidth;
  let desiredGrassHeight = desiredGrassWidth/grassAspectRatio;

  let magnifyingGlassAspectRatio = magnifyingGlass.width/magnifyingGlass.height;
  let desiredMagnifyingGlassWidth = desiredMagnifyingGlassHeight*magnifyingGlassAspectRatio;
  let desiredMagnifyingGlassHeight = sketchHeight;

  return new Map([
    ['sky', {
      asset: sky,
      startPos: createVector(0,0),
      width: desiredSkyWidth,
      height: desiredSkyHeight,
      defaultRender: (x,y) => {
        imageMode(CENTER);
        image(sky, sketchWidth/2, sketchHeight/2, desiredSkyWidth, desiredSkyHeight, 0, 0, sky.width, sky.height);
        imageMode(CORNER);
      },
    }],
    ['kite', {
      asset: kite,
      startPos: createVector(0, sketchHeight/2-kiteHeight),
      width: kiteWidth,
      height: kiteHeight,
      defaultIdle: onIdleCallback,
      defaultRender: (x, y) => {
        image(kite, x, y, kiteWidth, kiteHeight, 0, 0, kite.width, kite.height);
      },
    }],
    ['cloudA', {
      asset: cloudA,
      startPos: createVector(0,0),
      width: desiredCloudAWidth,
      height: desiredCloudAHeight,
      defaultIdle: onIdleCallback,
      defaultRender: (x, y) => {
        //image(cloudA, 0 + offset, 0, desiredCloudAWidth, desiredCloudAHeight, 0, 0, cloudA.width, cloudA.height, CONTAIN);
        image(cloudA, x, y, desiredCloudAWidth, desiredCloudAHeight, 0, 0, cloudA.width, cloudA.height, CONTAIN);
      },
    }],
    ['cloudB', {
      asset: cloudB,
      startPos: createVector(sketchWidth/4, sketchHeight/2.5),
      width: desiredCloudBWidth,
      height: desiredCloudBHeight,
      defaultIdle: onIdleCallback,
      defaultRender: (x, y) => {
        image(cloudB, x, y, desiredCloudBWidth, desiredCloudBHeight, 0, 0, cloudB.width, cloudB.height, CONTAIN);
      },
    }],
    ['cornerCloud', {
      asset: cloudCorner,
      startPos: createVector(sketchWidth-desiredCloudCornerWidth+20, sketchHeight-desiredCloudCornerHeight+20),
      width: desiredCloudCornerWidth,
      height: desiredCloudCornerHeight,
      defaultIdle: undefined,
      defaultRender: (x, y) => {
        image(cloudCorner, x, y, desiredCloudCornerWidth, desiredCloudCornerHeight, 0, 0, cloudCorner.width-20, cloudCorner.height, CONTAIN);
      },
    }],
    ['grass', {
      asset: grass,
      startPos: createVector(0, sketchHeight),
      width: desiredGrassWidth,
      height: desiredGrassHeight,
      defaultIdle: undefined,
      defaultRender: (x, y) => {
        image(grass, x, y, desiredGrassWidth, desiredGrassHeight, 0, 0, grass.width, grass.height, CONTAIN);
      },
    }],
    ['portlandRain', {
      asset: portlandRain,
      startPos: createVector(0, 0),
      width: desiredPortlandRainWidth,
      height: desiredPortlandRainHeight,
      defaultIdle: undefined,
      defaultRender: (x, y) => {

        let numFrames = portlandRain.numFrames() - 1;
        let frameNumber = Math.floor((millis()/100) % numFrames);
        // Set the current frame that is mapped to be relative to mouse position
        //let frameNumber = floor(map(mouseY, 0, height, 0, maxFrame, true));
        portlandRain.setFrame(frameNumber);
        imageMode(CENTER);
        image(portlandRain, sketchWidth/2, sketchHeight/2, desiredPortlandRainWidth, desiredPortlandRainHeight, 0, 0, portlandRain.width, portlandRain.height, COVER);
        imageMode(CORNER);

        //portlandRain.play();
        // image(portlandRain, x, y, desiredPortlandRainWidth, desiredPortlandRainHeight, 0, 0, portlandRain.width, portlandRain.height, COVER);
      },
    }],
    ['magnifyingGlass', {
      asset: magnifyingGlass,
      startPos: createVector(sketchWidth-desiredMagnifyingGlassWidth, sketchHeight-desiredMagnifyingGlassHeight),
      width: desiredMagnifyingGlassWidth,
      height: desiredMagnifyingGlassHeight,
      defaultIdle: undefined,
      defaultRender: (x, y) => {
        image(magnifyingGlass, x, y, desiredMagnifyingGlassWidth, desiredMagnifyingGlassHeight, 0, 0, magnifyingGlass.width, magnifyingGlass.height, CONTAIN);
      },
    }],
    ['driftwood', {
      asset: driftwood,
    }],
    ['reeds', {
      asset: reeds,
    }],
    ['desertBush', {
      asset: desertBush,
    }],
    ['georgiaTrees', {
      asset: georgiaTrees,
    }],
    ['sand', {
      asset: sand,
    }],
    ['kiteWalking', {
      asset: kiteWalking,
    }],
    ['city', {
      asset: city,
    }],
  ]);
};

function setupIdleScene() {
  let idle = new MovingScene('idle');
  let introObjs = ['sky', 'kite', 'cloudA', 'cloudB', 'cornerCloud'];
  let renderableSettings = initialObjSettings(width, height);
  for (const objName of introObjs) {
    let settings = renderableSettings.get(objName);
    let obj = new MoveableObj(objName, settings.startPos, settings.defaultRender);
    idle.add(obj);
  }
  let kiteObj = idle.get('kite');
  let kiteSettings = renderableSettings.get('kite');
  kiteObj.setOnRenderCallback((x, y) => {
    image(kite, mouseX-kiteSettings.width/1.2, mouseY-kiteSettings.height/1.2, kiteSettings.width, kiteSettings.height, 0, 0, kiteSettings.asset.width, kiteSettings.asset.height);
  });

  return idle;
}

function setupIntro() {
  let intro = new MovingScene('intro');
  let introObjs = ['sky', 'kite', 'cloudA', 'cloudB', 'cornerCloud'];
  let renderableSettings = initialObjSettings(width, height);
  for (const objName of introObjs) {
    let settings = renderableSettings.get(objName);
    let obj = new MoveableObj(objName, settings.startPos, settings.defaultRender);
    obj.setOnIdleCallback(settings.defaultIdle);
    intro.add(obj);
  }
  // for (const [name, renderableSettings] of initialObjSettings(width, height)) {
  //   let obj = new MoveableObj(name, renderableSettings.startPos, renderableSettings.defaultRender);
  //   obj.setOnIdleCallback(renderableSettings.defaultIdle);
  //   intro.add(obj);
  // }

  let kiteObj = intro.get('kite');
  const kiteSwoopTarget = createVector(width/3, height/4);
  let kiteUpAnimationProps = {
    startPos: createVector(0, height/2),
    targetPos: kiteSwoopTarget,
    duration: 1000,
    //speed: .25,
  };
  kiteObj.animateTo('still', {targetDelta: createVector(0,0), duration: 1000});
  kiteObj.animateTo('swoop', kiteUpAnimationProps, (x, y) => {
    console.log(`finished animate to ${x} ${y}`);
  });
  return intro;
}

function setupUpUp(prevScene) {
  let renderableDefaults = initialObjSettings(width, height);
  let kiteDefaults = renderableDefaults.get('kite');

  let upUp = MovingScene.fromPreviousScene('upup', prevScene);
  let kiteObj = upUp.get('kite');

  let onIdleCallback = function(x, y) {
    if (deltaTime == 0) return;
    let target = createVector(Math.max(x - 1 * (deltaTime / 20),0), Math.max(y - .5 * (deltaTime/20),0));
    this.moveTo(target);
  };

  // when the kite is at the top (i.e., height = 0) we want it to be this width
  let smallestWidth = width/20;
  let maxWidth = kiteDefaults.width;
  //let maxHeight = kiteDefaults.maxHeight;
  let onRenderCallback = function (x, y) {
    let newWidth = map(y, height, 0, maxWidth*2, smallestWidth, true);
    let newHeight = newWidth/(kiteDefaults.width/kiteDefaults.height);
    image(kite, x, y, newWidth, newHeight, 0, 0, kite.width, kite.height, CONTAIN);
  };
  kiteObj.setOnIdleCallback(onIdleCallback);
  kiteObj.setOnRenderCallback(onRenderCallback);
  return upUp;
}

function setupAWaywardGust(prevScene) {
  let renderableDefaults = initialObjSettings(width, height);
  let kiteDefaults = renderableDefaults.get('kite');

  let upUp = MovingScene.fromPreviousScene('upup', prevScene);
  let kiteObj = upUp.get('kite');

  let gustProps = {
    targetDelta: createVector(width/3, height/4),
    duration: 750,
  }
  kiteObj.animateTo('still', {targetDelta: createVector(0,0), duration: 500});
  kiteObj.animateTo('gust', gustProps, (x,y) => {
    console.log(`finished GUST ${x}, ${y}`);
  });

  // let onIdleCallback = function(x, y) {
  //   if (deltaTime == 0) return;
  //   let target = createVector(Math.max(x - 1 * (deltaTime / 20),0), Math.max(y - .5 * (deltaTime/20),0));
  //   this.moveTo(target);
  // };

  // // when the kite is at the top (i.e., height = 0) we want it to be this width
  // let smallestWidth = width/20;
  // let maxWidth = kiteDefaults.width;
  // //let maxHeight = kiteDefaults.maxHeight;
  // let onRenderCallback = function (x, y) {
  //   let newWidth = map(y, height, 0, maxWidth*2, smallestWidth, true);
  //   let newHeight = newWidth/(kiteDefaults.width/kiteDefaults.height);
  //   image(kite, x, y, newWidth, newHeight, 0, 0, kite.width, kite.height, CONTAIN);
  // };
  // kiteObj.setOnIdleCallback(onIdleCallback);
  // kiteObj.setOnRenderCallback(onRenderCallback);
  return upUp;
}

function setupRightDown(prevScene) {
  let rightDown = MovingScene.fromPreviousScene('rightDown', prevScene);
  //console.log(rightDown);
  let kiteObj = rightDown.get('kite');
  //console.log(kiteObj);
  let renderableDefaults = initialObjSettings(width, height);
  let grassSettings = renderableDefaults.get('grass');
  let grassObj = new MoveableObj('grass', grassSettings.startPos, grassSettings.defaultRender);
  rightDown.add(grassObj);
  grassObj.hidden = true;

  let kiteDefaults = renderableDefaults.get('kite');

  let kiteRightAnimationProps = {
    targetDelta: createVector(width/3, height/5),
    duration: 750,
  };
  let kiteDownAnimationProps = {
    targetDelta: createVector(width/5, height/3),
    duration: 1000,
  };

  let grassGrowInProps = {
    targetPos: createVector(0, height-grassSettings.height),
    duration: 1000,
  };

  let cornerCloud = rightDown.get('cornerCloud');
  // kiteObj.setOnRenderCallback(kiteDefaults.defaultRender);
  // kiteObj.setOnIdleCallback(kiteDefaults.defaultIdle);
  kiteObj.animateTo('still', {targetDelta: createVector(0,0), duration: 500});
  kiteObj.animateTo('right', kiteRightAnimationProps, (x, y) => {
    console.log(`finished animate to ${x} ${y}`);
    grassObj.hidden = false;
    cornerCloud.hidden = true;
    grassObj.animateTo('growin', grassGrowInProps);
  });
  kiteObj.animateTo('down', kiteDownAnimationProps, (x, y) => {
    console.log(`finished DOWN animate to ${x} ${y}`);
      // kiteObj.animateTo('baseline', {
      //   targetPos: createVector(kiteDefaults.startPos.y),
      //   duration: 1000,
      //   }, (x, y) => {
      //     console.log(`finished BASELINE animate to ${x} ${y} . start ${kiteDefaults.startPos.y}`);
      //     kiteObj.setOnRenderCallback(kiteDefaults.defaultRender);
      // });
  });
  kiteObj.animateTo('baseline', {
    targetPos: createVector(width/2, kiteDefaults.startPos.y),
    duration: 1000,
    }, (x, y) => {
      console.log(`finished BASELINE animate to ${x} ${y} . start ${kiteDefaults.startPos.y}`);
      kiteObj.setOnRenderCallback(kiteDefaults.defaultRender);
  });
  // kiteObj.animateTo('baseline', kiteBaselineAnimationProps, (x, y) => {
  //   console.log(`finished animate to ${x} ${y}`);
  //   kiteObj.setOnRenderCallback(kiteDefaults.defaultRender);
  // });
  kiteObj.setOnIdleCallback(kiteDefaults.defaultIdle);
  return rightDown;
}

function setupStutters(prevScene) {
  //let renderableDefaults = initialObjSettings(width, height);
  let scene = MovingScene.fromPreviousScene('stutters', prevScene);
  let kiteObj = scene.get('kite');

  let onIdleCallback = function(x, y) {
    if (deltaTime == 0) return;
    let randomSign = Math.random() < 0.5 ? -1 : 1;
    let target = createVector((x + .75 * (deltaTime / 20)) % width, y + 5*Math.random()*randomSign);
    this.moveTo(target);
  }
  kiteObj.setOnIdleCallback(onIdleCallback);
  return scene;
}

function setupAloft(prevScene) {
    let renderableDefaults = initialObjSettings(width, height);
    let scene = MovingScene.fromPreviousScene('aloft', prevScene);
    let kiteObj = scene.get('kite');
    console.log("settings up aloft");
    console.log(kiteObj);
    let onIdleCallback = function(x, y) {
      //console.log(`aloft idle ${x}, ${y}`);
      if (deltaTime == 0) return;
      let target = createVector(Math.max(x - .75 * (deltaTime / 20),50), Math.max(y - .5 * (deltaTime/20),20));
      this.moveTo(target);
    };
    kiteObj.setOnIdleCallback(onIdleCallback);

    // when the kite is at the top (i.e., height = 0) we want it to be this width
    let kiteDefaults = renderableDefaults.get('kite');
    let smallestWidth = width/20;
    let maxWidth = kiteDefaults.width;
    //let maxHeight = kiteDefaults.maxHeight;
    let onRenderCallback = function (x, y) {
      let newWidth = map(y, height, 0, maxWidth*2, smallestWidth, true);
      let newHeight = newWidth/(kiteDefaults.width/kiteDefaults.height);
      image(kite, x, y, newWidth, newHeight, 0, 0, kite.width, kite.height, CONTAIN);
    };
    kiteObj.setOnRenderCallback(onRenderCallback);

    // bring cloud back
    let cornerCloudObj = scene.get('cornerCloud');
    let cloudSettings = renderableDefaults.get('cornerCloud');
    let cloudInProps = {
      targetPos: cloudSettings.startPos,
      startPos: createVector(width,height),
      duration: 1000,
    }

    let grassObj = scene.get('grass');
    let grassGrowOutProps = {
      targetPos: createVector(0, height),
      duration: 2000,
    };
    grassObj.animateTo('growout', grassGrowOutProps, () => {
      grassObj.hidden = true;
      cornerCloudObj.animateTo('cloudin', cloudInProps);
      cornerCloudObj.hidden = false;
    });

    return scene;
} 

function setupHindsight(prevScene) {
  // reset aloft scene
  let renderableDefaults = initialObjSettings(width, height);
  let kiteDefaults = renderableDefaults.get('kite');
  kiteObj = prevScene.get('kite');
  kiteObj.setOnIdleCallback(kiteDefaults.defaultIdle);
  kiteObj.setOnRenderCallback(kiteDefaults.defaultRender);


  let scene = new MovingScene('hindsight');

  let magnifyingGlassSettings = renderableDefaults.get('magnifyingGlass');

  let magnifyingGlassObj = new MoveableObj('magnifyingGlass', magnifyingGlassSettings.startPos, magnifyingGlassSettings.defaultRender);
  scene.add(magnifyingGlassObj);
  // magnifying glass
  // zoom into the sky 
  // other images??
  // gif of kite flying away
  return scene;
}

function setupSquintingIntoTheLight() {
  let scene = new MovingScene('squinting');
  let objNames = ['portlandRain'];
  let renderableSettings = initialObjSettings(width, height);

  for (const objName of objNames) {
    let settings = renderableSettings.get(objName);
    let obj = new MoveableObj(objName, settings.startPos, settings.defaultRender);
    obj.defaultIdle = settings.defaultIdle;
    scene.add(obj);
  }

  // let rainSettings = renderableSettings.get('portlandRain');
  // let numFrames = portlandRain.numFrames() - 1;
  // // Set the current frame that is mapped to be relative to mouse position
  // let frameNumber = floor(map(mouseY, 0, height, 0, maxFrame, true));
  // gif.setFrame(frameNumber);

  return scene;
}

function createShapesForKaleidoscope() {
  let numShapes = 50;
  // draw lots of random moving shapes on the canvas
  let renderableDefaults = kaleidoscopeProps.renderables;

  let getRandomObj = (collection) => {
    let vals = Array.from(collection.values());
    return vals[Math.floor(Math.random() * vals.length)];
  };

  let objs = Array.from(renderableDefaults.values());

  // let obj = getRandomObj(renderableDefaults);
  // console.log(renderableDefaults);
  // console.log(obj);

  for(var i=0; i < numShapes; i++) {
    let sec = second();

    fill(sin(i)*255,sin((i+frameCount)/50)*255,100);

    let x1 = sin(frameCount/100+i*0.4)*width;
    let y1 = cos(i*0.23)*height;
    let w1 = 80+cos(frameCount/40+400-i)*50;
    let h1 = 80+cos(frameCount/30+i)*50;
    ellipse(x1, y1, w1, h1);

    fill(200,sin(i)*255,sin((i+frameCount)/50)*255);

    let x2 = cos(frameCount/300+i*0.4)*width;
    let y2 = sin(i*0.23)*height;
    let w2 = 80+cos(frameCount/40+400-i)*50;
    let h2 = 80+tan(frameCount/430+i)*50;
    rect(x2, y2, w2, h2);

    //let obj = getRandomObj(renderableDefaults);
    //let obj = renderableDefaults.get('driftwood');
    let obj = objs[i%objs.length];
    let aspectRatio = obj.asset.width/obj.asset.height;
    let targetWidth = Math.min(width/5, obj.asset.width/2);
    let targetHeight = Math.min((width/5)/aspectRatio, obj.asset.height/2);

    // let targetX = Math.abs(cos(HALF_PI*i- sec)*width)-targetWidth;
    // let targetY = Math.abs(sin(sec*i)*height)-targetHeight;
    // let targetX = (Math.abs(cos(HALF_PI-sec)*width)-targetWidth + i*width/numShapes)%width;
    // let targetY = (Math.abs(sin(sec)*height)-targetHeight + i*width/numShapes)%height;
    let targetX = width/2+(-.5*x1);
    let targetY = (-1*y1+i*(width/numShapes))%height;
    image(obj.asset, targetX, targetY, targetWidth, targetHeight);
  }
}

function mirror(kaleidoscopeProps) {
  // copy a section of the canvas
  let img = get(0,0, kaleidoscopeProps.shape.a, kaleidoscopeProps.shape.o);
  // cut it into a triangular shape
  img.mask(kaleidoscopeProps.mask);

  push();
  // move origin to centre
  translate(width/2,height/2);
  // turn the whole sketch over time
  rotate(radians(frameCount/3));

  let slices = kaleidoscopeProps.slices;
  for(var i=0; i<slices; i++) {
    if(i%2==0) {
      push();
      scale(1,-1); // mirror
      image(img,0,0); // draw slice
      pop();
    } else {
      rotate(radians(360/slices)*2); // rotate
      image(img,0,0); // draw slice
    }
  }
  pop();
}

function rotateText(txt, x, y, radius) {
  // Comment the following line to hide debug objects
  //drawDebug(x, y, radius);
  const EDGE_STROKE_COLOR = "#faf0e6"; 
  //const BACKGROUND_COLOR = "#e3dac9";
  const TEXT_STROKE_COLOR = '#8a795d';

  // Split the chars so they can be printed one by one
  chars = txt.split("");

  // Decide an angle
  let textsz = radius / 8;
  charSpacingAngleDeg = 360/chars.length;

  textAlign(CENTER, BASELINE)
  textSize(textsz);
  fill(EDGE_STROKE_COLOR);
  stroke(TEXT_STROKE_COLOR);
  strokeWeight(Math.max(3, textsz/4));

  // https://p5js.org/reference/#/p5/push
  // Save the current translation matrix so it can be reset
  // before the end of the function
  push();

  // Let's first move to the center of the circle
  translate(x, y);

  // First rotate half back so that middle char will come in the center
  rotate(radians(frameCount/5 + -chars.length * charSpacingAngleDeg / 2));

  for (let i = 0; i < chars.length; i++) {
      text(chars[i], 0, -radius);

      // Then keep rotating forward per character
      rotate(radians(charSpacingAngleDeg)/1.5);
  }
  // Reset all translations we did since the last push() call
  // so anything we draw after this isn't affected
  pop();
}

function calcStuff(width, height, s) {
  // because pythagorean theorem
  // h = sqrt(a^2 + b^2)
  // a = sqrt(h^2 - b^2)
  // b = sqrt(h^2 - a^2)
  let a = sqrt(sq(width/2)+sq(height/2));
  let theta = radians(360 / s);
  let o = tan(theta) * a;
  let h = a / cos(theta);

  return {a: round(a), o: round(o), h: round(h)};
}

function createMask(w,h) {
  // create triangular mask so that the parts of the 
  // kaleidoscope don't draw over one another

  let mask = createImage(w,h);
  mask.loadPixels();
  for (i = 0; i < mask.width; i++) {
      for (j = 0; j < mask.height; j++) {
          if(i >= map(j,0,h,0,w)-1) // -1 removes some breaks
              mask.set(i, j, color(255));
      }
  }
  mask.updatePixels();
  return mask;
}


class MovingScene {
  finished = false;
  renderables;

  constructor(name) {
    this.name = name;
    this.renderables = new Map();
  }

  static fromPreviousScene(name, prevScene) {
    let scene = new MovingScene(name);
    scene.renderables = prevScene.renderables;
    return scene;
  }

  add(renderable) {
    this.renderables.set(renderable.name, renderable);
  }

  delete(renderable) {
    this.renderables.delete(renderable.name);
  }
  
  get(name) {
    return this.renderables.get(name);
  }

  dispose() {
    for (const [name, renderable] of this.renderables) {
      renderable.clearAnimations();
    }
    this.finished = true;
  }

  update() {
    for (const [name, renderable] of this.renderables) {
      renderable.update();
    }
  }
  
  render() {
    let time = millis();
    for (const [name, renderable] of this.renderables) {
      renderable.render(time);
    }
  }
}

class MoveableObj {
  static AnimationState = {
    stopped: "stopped",
    running: "running",
  };

  static speedModifier = 100;

  animationChain;

  #epsilon = .01*Math.max(width,height);

  //animation state
  // targetX;
  // targetY;
  // speed;
  // onFinish;
  animationState;
  currentAnimationName;

  // animationprops
  currentAnimation;
  lastStartOfAnimation;

  // animationprops
  idleAnimation;
  onIdleCallback;

  hidden = false;

  constructor(name, startPos, renderCallback) {
    this.name = name;
    this.moveTo(startPos);
    this.animationChain = new Queue();
    this.renderCallback = renderCallback;
    this.animationState = MoveableObj.AnimationState.stopped;
  }

  moveTo(pos) {
    this.x = pos.x;
    this.y = pos.y;
    //console.log(`${this.name} ${this.x} ${this.y}`);
  }

  setOnIdleCallback(onIdleCallback) {
    this.onIdleCallback = onIdleCallback;
  }

  setOnRenderCallback(onRenderCallback) {
    this.renderCallback = onRenderCallback;
  }

  animateTo(animationName, animationProps, onFinish) {
    let animationOpts = {name: animationName, onFinish: onFinish, ...animationProps};
    console.log(`${this.name} added ${animationName}`);
    console.log(animationOpts);
    this.animationChain.enqueue(animationOpts);
  }

  clearAnimations() {
    this.animationChain.clear();
  }

  isAnimating(opt_animationName) {
    let isRunning = this.animationState == MoveableObj.AnimationState.running;
    if (opt_animationName != undefined) {
      return isRunning && (this.currentAnimation.name == opt_animationName);
    } else {
      return isRunning;
    }
  }

  #isCloseEnoughToTarget(targetX, targetY) {
    return (Math.abs(this.x-targetX) <= this.#epsilon) && (Math.abs(this.y-targetY) <= this.#epsilon);
  }

  #calculateVelocity(targetPos) {
    let vx, vy;
    // todo: different animation curves
    const targetX = targetPos.x;
    const targetY = targetPos.y;
    // todo: consider different kinds of speed (e.g., linear)
    const dx = targetX - this.x;
    const dy = targetY - this.y;

    if (this.currentAnimation.duration != undefined) {
      let now = millis();
      let duration = this.currentAnimation.duration;
      let elapsedTime = now - this.lastStartOfAnimation;
      let remainingTime = duration-elapsedTime;
      if (remainingTime >= 0) {
        vx = dx*deltaTime/remainingTime;
        vy = dy*deltaTime/remainingTime;
      } else {
        //console.log(`${this.currentAnimation.name} calculate velocity remaining ${remainingTime}, target:(${targetX} ${targetY}) (${this.x} ${this.y}) v (${this.vx} ${this.vy})`);
        vx = 0;
        vy = 0;
        this.moveTo(targetPos);
      }
    } else {
      vx = dx*deltaTime/MoveableObj.speedModifier;
      vy = dy*deltaTime/MoveableObj.speedModifier;
    }
    return createVector(vx, vy);
  }

  setVelocity(vx, vy) {
    this.vx = vx;
    this.vy = vy;
  }

  update() {
    //console.log(` ${this.name} update animation ${this.isAnimating()} animations: ${this.animationChain.size()}`);
    if (this.isAnimating()) {
      let targetPos = this.currentAnimation.targetPos;
      let velocity = this.#calculateVelocity(targetPos);
      this.setVelocity(velocity.x, velocity.y);
      //console.log(`${this.name} dt: ${deltaTime} x(before): ${this.x} vx:${this.vx} y(before): ${this.y} vx:${this.vy}`);
      //console.log(targetPos);
  
      this.x += this.vx;
      this.y += this.vy;
      let durationMet = true;
      if (this.currentAnimation.duration != undefined) {
        durationMet = (millis() - this.lastStartOfAnimation) >= this.currentAnimation.duration;
      }
      if (this.#isCloseEnoughToTarget(targetPos.x, targetPos.y) && durationMet) {
        if (this.currentAnimation?.onFinish != undefined) {
          this.currentAnimation?.onFinish(this.x, this.y);
        }
        this.#resetAnimationProps();
      }
    } else if (this.animationChain.size() > 0) {
      // start the next animation
      this.#startAnimation(this.animationChain.dequeue());
    } else if (this.idleAnimation != undefined) {
      this.#startAnimation(this.idleAnimation);
    } else if (this.onIdleCallback != undefined) {
      this.onIdleCallback(this.x, this.y);
    }
  }

  #startAnimation(nextAnimation) {
    console.log(`${this.name} start animation ${nextAnimation.name}`);
    this.currentAnimation = nextAnimation;
    this.lastStartOfAnimation = millis();
    this.currentAnimation.startPos = this.currentAnimation.startPos ?? createVector(this.x, this.y);
    let delta = this.currentAnimation.targetDelta;
    if (delta != undefined) {
      this.currentAnimation.targetPos = createVector(this.currentAnimation.startPos.x + delta.x, this.currentAnimation.startPos.y + delta.y);
    }
    this.moveTo(this.currentAnimation.startPos);
    this.animationState = MoveableObj.AnimationState.running;
  }

  #resetAnimationProps() {
    console.log(`stop ${this.currentAnimation.name}`);
    this.currentAnimation = undefined;
    this.lastStartOfAnimation = undefined;
    this.animationState = MoveableObj.AnimationState.stopped;
  }

  render(opt_time) {
    if (!this.hidden) {
      this.renderCallback(this.x, this.y, opt_time);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Queue {
  constructor() {
      this.items = {}
      this.frontIndex = 0
      this.backIndex = 0
  }
  enqueue(item) {
      this.items[this.backIndex] = item
      this.backIndex++
      return item + ' inserted'
  }
  dequeue() {
      const item = this.items[this.frontIndex]
      delete this.items[this.frontIndex]
      this.frontIndex++
      return item
  }
  peek() {
      return this.items[this.frontIndex]
  }
  size() {
    return Object.keys(this.items).length;
  }

  clear() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }

  get printQueue() {
      return this.items;
  }
}
