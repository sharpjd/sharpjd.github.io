//@ts-check

/*
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
*/

/*
 * Asset preloads
 */
var font_gType;
var font_inconsolata;

var png_AnnoyingEnemy;
var png_HomingEnemy;
var png_LaserEnemy;
var png_ShootingEnemy;
var png_StandardEnemy;

var music_AbovePlanets;
var music_Cages;
var music_LostConstructs;

var sfx_explosion1;
var sfx_explosion2;
var sfx_explosion3;
var sfxs_explosion = [];

var sfx_forcefield1;
var sfx_forcefield2;
var sfx_forcefield3;
var sfx_forcefield4;
var sfx_forcefield5;
var sfxs_forcefield = [];

var sfx_hit1;
var sfx_hit2;
var sfx_hit3;
var sfx_hit4;
var sfx_hit5;
var sfxs_hit = [];

var sfx_hurt1;
var sfx_hurt2;
var sfx_hurt3;
var sfxs_hurt = [];

var sfx_lowLaser;
var sfx_mediumLaser;
var sfx_highLaser;

var sfx_gameover;

//use default browser Audio API instead of p5's sound API which crackles after some time 
class ConcurrentSound {
  constructor(path){
    this.path = path;
    this.volume = 1.0;

    this.playingSound = null;
  }

  play(){
    let a = new Audio(this.path);
    a.volume = this.volume;

    this.playingSound = a;

    /*
    a.addEventListener("ended", onSoundEnd);
    function onSoundEnd(){
      this.isPlaying_ = false;
      this.sound = null;
    }
    */
    
    var response = a.play();
    if (response!== undefined) {
        response.then(_ => {
          //nothing, the sound should start playing
        }).catch(error => {
          //simply handle the rror
        });
    }
  }

  isPlaying(){
    if(this.playingSound != null){
      return !(this.playingSound.paused);
    } 
    return false;
  }

  stop(){
    if(this.playingSound != null){
      this.playingSound.pause();
      this.playingSound.currentTime = 0;
    }
  }

  setVolume(vol){
    this.volume = vol;
  }
}

function loadSoundPatched(path){
  return new ConcurrentSound(path);
}

function preload(){
  font_gType = loadFont("resources/GType-rGX9.ttf");
  font_inconsolata = loadFont("resources/Inconsolata.otf");
  
  png_AnnoyingEnemy = loadImage("resources/sprites/AnnoyingEnemy.png");
  png_HomingEnemy = loadImage("resources/sprites/HomingEnemy.png");
  png_LaserEnemy = loadImage("resources/sprites/LaserEnemy.png");
  png_ShootingEnemy = loadImage("resources/sprites/ShootingEnemy.png");
  png_StandardEnemy = loadImage("resources/sprites/StandardEnemy.png");

  music_AbovePlanets = loadSoundPatched("resources/music/AbovePlanets.mp3");
  music_Cages = loadSoundPatched("resources/music/Cages.mp3");
  music_LostConstructs = loadSoundPatched("resources/music/LostConstructs.mp3");

  sfx_explosion1 = loadSoundPatched("resources/sounds/explosion1.mp3");
  sfx_explosion1.setVolume(0.5);
  sfx_explosion2 = loadSoundPatched("resources/sounds/explosion2.mp3");
  sfx_explosion2.setVolume(0.5);
  sfx_explosion3 = loadSoundPatched("resources/sounds/explosion3.mp3");
  sfx_explosion3.setVolume(0.5);
  sfxs_explosion.push(sfx_explosion1);
  sfxs_explosion.push(sfx_explosion2);
  sfxs_explosion.push(sfx_explosion3);

  sfx_forcefield1 = loadSoundPatched("resources/sounds/forcefield1.mp3");
  sfx_forcefield1.setVolume(0.4);
  sfx_forcefield2 = loadSoundPatched("resources/sounds/forcefield2.mp3");
  sfx_forcefield2.setVolume(0.4);
  sfx_forcefield3 = loadSoundPatched("resources/sounds/forcefield3.mp3");
  sfx_forcefield3.setVolume(0.4);
  sfx_forcefield4 = loadSoundPatched("resources/sounds/forcefield4.mp3");
  sfx_forcefield4.setVolume(0.4);
  sfx_forcefield5 = loadSoundPatched("resources/sounds/forcefield5.mp3");
  sfx_forcefield5.setVolume(0.4);
  sfxs_forcefield.push(sfx_forcefield1);
  sfxs_forcefield.push(sfx_forcefield2);
  sfxs_forcefield.push(sfx_forcefield3);
  sfxs_forcefield.push(sfx_forcefield4);
  sfxs_forcefield.push(sfx_forcefield5);

  sfx_hit1 = loadSoundPatched("resources/sounds/hit1.mp3");
  sfx_hit1.setVolume(0.2);
  sfx_hit2 = loadSoundPatched("resources/sounds/hit2.mp3");
  sfx_hit2.setVolume(0.2);
  sfx_hit3 = loadSoundPatched("resources/sounds/hit3.mp3");
  sfx_hit3.setVolume(0.2);
  sfx_hit4 = loadSoundPatched("resources/sounds/hit4.mp3");
  sfx_hit4.setVolume(0.2);
  sfx_hit5 = loadSoundPatched("resources/sounds/hit5.mp3");
  sfx_hit5.setVolume(0.2);
  sfxs_hit.push(sfx_hit1);
  sfxs_hit.push(sfx_hit2);
  sfxs_hit.push(sfx_hit3);
  sfxs_hit.push(sfx_hit4);
  sfxs_hit.push(sfx_hit5);

  sfx_hurt1 = loadSoundPatched("resources/sounds/hurt1.mp3");
  sfx_hurt1.setVolume(0.3);
  sfx_hurt2 = loadSoundPatched("resources/sounds/hurt2.mp3");
  sfx_hurt2.setVolume(0.8);
  sfx_hurt3 = loadSoundPatched("resources/sounds/hurt3.mp3");
  sfx_hurt3.setVolume(0.3);
  sfxs_hurt.push(sfx_hurt1);
  sfxs_hurt.push(sfx_hurt2);
  sfxs_hurt.push(sfx_hurt3);

  sfx_lowLaser = loadSoundPatched("resources/sounds/lowLaser.mp3");
  sfx_lowLaser.setVolume(0.8);
  sfx_mediumLaser = loadSoundPatched("resources/sounds/mediumLaser.mp3");
  sfx_mediumLaser.setVolume(0.8);
  sfx_highLaser = loadSoundPatched("resources/sounds/highLaser.mp3");
  sfx_highLaser.setVolume(0.8);

  sfx_gameover = loadSoundPatched("resources/sounds/gameover.mp3");
  
}

/**
 * Returns a random object from the array.
 * @param {*} arr 
 * @returns 
 */
function getRandomFrom(arr){
  let i = floor(random(0,arr.length));
  return(arr[i]);
}

function cullNonPlayingSounds(){
  stopSoundIfNotPlaying(sfx_explosion1);
  stopSoundIfNotPlaying(sfx_explosion2);
  stopSoundIfNotPlaying(sfx_explosion3);

  stopSoundIfNotPlaying(sfx_forcefield1);
  stopSoundIfNotPlaying(sfx_forcefield2);
  stopSoundIfNotPlaying(sfx_forcefield3);
  stopSoundIfNotPlaying(sfx_forcefield4);
  stopSoundIfNotPlaying(sfx_forcefield5);

  stopSoundIfNotPlaying(sfx_hit1);
  stopSoundIfNotPlaying(sfx_hit2);
  stopSoundIfNotPlaying(sfx_hit3);
  stopSoundIfNotPlaying(sfx_hit4);
  stopSoundIfNotPlaying(sfx_hit5);

  stopSoundIfNotPlaying(sfx_hurt1);
  stopSoundIfNotPlaying(sfx_hurt2);
  stopSoundIfNotPlaying(sfx_hurt3);

  stopSoundIfNotPlaying(sfx_lowLaser);
  stopSoundIfNotPlaying(sfx_mediumLaser); 
  stopSoundIfNotPlaying(sfx_highLaser)
  
  stopSoundIfNotPlaying(sfx_gameover);
}

function stopSoundIfNotPlaying(sound){
  if(!sound.isPlaying()){
    sound.stop();
  }
}



/**
 * Provides a static reference to some variables here (such as sliders and state)
 */
class Sketch {
  static state;
  static showVideoCheckbox;
  static calibrationPoint;
  static paused;
}

var showVideoCheckbox;

var world;
var gui;
var gestures;
var musicPlayer;

function setup() {

  MusicPlayer.initialize();

  //this is specifically chose to fit the hand detection and for gameplay balance; changing may break things
  createCanvas(1000, 480);//this should come before anything that uses height/width

  showVideoCheckbox = createCheckbox();
  //@ts-ignore
  showVideoCheckbox.position(10, 70);
  //@ts-ignore
  showVideoCheckbox.checked(false);

  Gestures.initialize(); //must be called to initialize references 
  //@ts-ignore
  Gestures.showVideoFeed = showVideoCheckbox.checked();

  gui = new GUI();
  
}


function draw() {

  /* //DEBUG draw hand gesture points
  drawPoints = true;
  Gestures.update();
  return;
  */

  //updates state var which is the main way the program determines what should be running
  updateStateMachine();
  
  Gestures.update(); //comes before world.update otherwise the video renders over everything
  
  drawingContext.shadowBlur = 128;
  drawingContext.shadowColor = color(207, 7, 99);
  if(world!=null && state!="GameOver")world.update();
  drawingContext.shadowBlur = 0;
  gui.update(); //GUI is excluded from pausing

  //these two must come after otherwise they get overridden
  //debugDisplayState();
  //debugDisplayFPS();

  cullNonPlayingSounds();
  MusicPlayer.update();

  updateStaticVariables();//should come last

    //must come at end
    if(keyIsPressed){
      anythingPressedLastFrame = true;
    } else {
      anythingPressedLastFrame = false;
    }

}

/**
 * Initialize the Player object before calling this 
 */
function initGameGUI(){ 
  //depends on a player object existing
  hpBar = new GUIHealthBar("HealthBar", 30, 10, 2);
  gui.addGuiObject(hpBar);

  survivalTimer = new GUISurvivalTimer(width-100, 30, 3);
  gui.addGuiObject(survivalTimer);

  scoreCounter = new GUIScoreCounter(width-100, 50, 3);
  gui.addGuiObject(scoreCounter);
}

var state = "Calibration";
var menu;
var calibrationMenu;
var videoFeed;
var pauseOverlay;
var boundaryWarning;
var tutorial;

//game GUI elements
var hpBar;
var survivalTimer;
var scoreCounter;

var gameOverScreen;//game over GUIElement

var bg;//background GUIElement

let beginGameOnce = false;
let initWorldOnce = false;
let initMenuOnce = false;
let initCalibrationOnce = false;
let initTutorialOnce = false;
let initVideoOnce = false;

let playGameoverOnce = false;

let initStateOnce = false;

let lastTimeHandDetected = 0;
const handTimeoutMillis = 1300;

var highScore = 0;

let anythingPressedLastFrame = false;
function updateStateMachine() {
  
  /*
  if(!initStateOnce){ //FOR DEBUGGING PURPOSES
    state = "Playing"; //DEBUG skip straight to continuing to game
    //state = "ContinueToGame"; //DEBUG skip to tutorial
    initStateOnce=true;
  }
  */

  if(!initMenuOnce){
    menu = new GUILoadingScreen("MenuScreen", 0, 0, 2);
    gui.addGuiObject(menu);
    console.log("loaded menu screen");
    initMenuOnce=true;

    pauseOverlay = new PauseOverlay(0,0, 999);
    gui.addGuiObject(pauseOverlay);

    gameOverScreen = new GUIGameOverScreen(999999);
    gui.addGuiObject(gameOverScreen);

    initGameGUI(); //needs to come after GUI initialization and World initialization
  }

  if(!initWorldOnce){
    world = new World();
    //World.instance.player.supressShooting=true;
    initWorldOnce = true;
    console.log("loaded game world");

    boundaryWarning = new GUIBoundaryWarning(1);
    gui.addGuiObject(boundaryWarning);
    boundaryWarning.show=true;

    bg = new BG(-999);
    World.instance.addGameObject(bg);
  }

  if(!initVideoOnce){
    videoFeed = new VideoFeed(0, 0, 1); 
    GUI.instance.addGuiObject(videoFeed);

    initVideoOnce = true;
  }

  if(state=="Calibration"){

    if(!initCalibrationOnce){
      calibrationMenu = new CalibrationMenu(width/2, height/2, 4)
      gui.addGuiObject(calibrationMenu);

      videoFeed.show=true;

      calibrationMenu.show=true;
      //showVideoCheckbox.checked(true)

      initCalibrationOnce = true;
    }

    if(calibrationMenu.state=="Done"){
      state = "CalibrationDone";
    }

  }

  if(state=="CalibrationDone"){
    state = "WaitingForModel";
  }

  if(state=="WaitingForModel"){
    menu.show = true;
    calibrationMenu.slatedForDeletion = true;
    if(Gestures.status=="ready"){
      state = "ModelReady";
    }
  }

  if(state=="ModelReady"){
    menu.displayText = "Click/Press any key to continue";
    if(keyIsPressed || mouseIsPressed){
      state="ContinueToGame";
      menu.displayText="Proceeding to game...";
    }
  }

  //await loading to be complete and the player to hit play
  if(!beginGameOnce && state == "ContinueToGame"){

    menu.show=false;
    state="BeginTutorial"
    beginGameOnce=true;
    
    console.log("begun playing");
  }

  if(!initTutorialOnce && state=="BeginTutorial"){

    tutorial = new GUITutorial();
    GUI.instance.addGuiObject(tutorial);
    state="Tutorial";

    initTutorialOnce=true;
  }

  if(state=="Tutorial"){

    if(tutorial.behaviorState=="Finished"){
      tutorial.slatedForDeletion = true;
      state="Playing";
    }
  }


  if(state=="Playing" || state=="Tutorial"){
    if(Gestures.handDetected){
      lastTimeHandDetected=millis();
      Sketch.paused=false;
      pauseOverlay.show = false;  
      videoFeed.show=false;
      boundaryWarning.show=true;
      if(state!="Tutorial")
        World.instance.player.supressShooting=false;
    } else {
      if(millis() - lastTimeHandDetected > handTimeoutMillis){
        Sketch.paused=true;
        pauseOverlay.show = true;
        videoFeed.show=true;
        //console.log("bruh");
        //console.log(Gestures.handDetected);
      }
    }
  }

  //GAME OVER
  if(World.instance.player.hitpoints<=0){

    if(!playGameoverOnce){
      sfx_gameover.play();
      playGameoverOnce=true;
    }

    Sketch.paused=true;
    pauseOverlay.show=false;
    videoFeed.show=false;
    gameOverScreen.show=true;
    this.behaviorState = "GameOver";

    if(tutorial != null){
      tutorial.slatedForDeletion = true;
      tutorial.activeTutorial.slatedForDeletion = true;
    }
      

    if(keyIsPressed){//press any key to restart
    //if(keyIsDown(81)){ //press any key to restart

      survivalTimer.slatedForDeletion=true;
      hpBar.slatedForDeletion=true;
      scoreCounter.slatedForDeletion=true;
      gameOverScreen.slatedForDeletion=true;

      beginGameOnce = false;
      initMenuOnce = false;
      initWorldOnce = false;
      gameOverScreen.show = false;

      playGameoverOnce=false;
      //World.instance.player.supressShooting=false;
      //state = "Playing";

      beginGameOnce = false;

      tutorial.slatedForDeletion = true;

      //tutorial = new GUITutorial();
      //GUI.instance.addGuiObject(tutorial);
      //state="Tutorial";

      initCalibrationOnce = false;
      initTutorialOnce = false;
      calibrationMenu.slatedForDeletion = true;
      state = "Calibration";

      Sketch.paused = false;
    }
  }
}

//display the state variable manipulated by the state machine
function debugDisplayState() {
  push();
    textAlign(LEFT);
    fill(color(255,255,255));
    text(state, 0, height-50);
  pop();
}

function debugDisplayFPS(){
  text(deltaTime.toFixed(2) + "ms; FPS:"+(1000/deltaTime).toFixed(1), 10, 60);
}

function updateStaticVariables() {
  Sketch.state = state;
  Sketch.showVideoCheckbox = showVideoCheckbox;
}

