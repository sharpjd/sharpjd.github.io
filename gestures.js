//@ts-check

/**
 * Exists to provide a reference/abstraction to the ml5.js Gesture Recognition system
 */
class Gestures {

    static handpose;    //holds the ml5.handpose detector
    static video;       //holds the video feed
    static predictions; //gets updated with a list of predictions
    static handDetected;//whether a hand is detected or not

    static classifier;  //holds the neural network that identifies handpose data
    static status;      //state of the gesture identifier

    static showVideoFeed = false;

    static annotations;
    static palmBase;
    static thumbBase;
    static indexFingerBase;
    static middleFingerBase;
    static ringFingerBase;
    static pinkyBase;

    //static mirrorHandpose = false;

    static initialize(){//these variables are further refreshed in the loop below
        Gestures.handpose = handpose;
        Gestures.video = video;
        Gestures.predictions = predictions;
        Gestures.handDetected = handDetected;
        Gestures.classifier = classifier;
        Gestures.status = status;

        init(); //defer to below
    }

    static update(){
        upd(); //defer to below
    }  

    /*
    static mirrorVideo(){
      Gestures.mirrorHandpose = !Gestures.mirrorHandpose;

      
      //const options = {
        //flipHorizontal: Gestures.mirrorHandpose
      //}
      
      //@ts-ignore
      //handpose = ml5.handpose(video, options, modelReady);
      
      //handpose.options.flipHorizontal = true;

    }
    */
    

}

var handpose;
var video;
var predictions = [];

var classifier;
var status = "loading";

var handDetected = false;


function init() {
  
  textSize(24);

  video = createCapture(VIDEO);
  video.size(width, height);
  
  const optionsHandpose = {
    flipHorizontal: true,
    detectionConfidence: 0.7
  }
  // @ts-ignore
  handpose = ml5.handpose(video, optionsHandpose, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", (results) => {
    // do something with the results
    if(results.length!=0){
      handDetected=true;

      predictions = results;
      
    } else {
      handDetected=false;
    }
      
  });
  
  //hide by default
  video.hide();
  
  let options = {
    task: "classification",
    //debug: true,
  };
  // @ts-ignore
  classifier = ml5.neuralNetwork(options); //finally initialize the neural network
  
}


function modelReady() {
  console.log("Model ready!");
  beginLoadData();
}

function beginLoadData(){
  //this will error out if the file doesn't exist but that's fine
  loadedData = loadJSON("saved.json", loaded);
}

function loaded(){

  for(var i in loadedData)
    data.push(loadedData [i]);
  
  console.log("Loaded data");
  
  trainData();
}

function trainData(){
  for (let item of data) {
      let inputs = item.positions;
      let outputs = [ item.label ];
      classifier.addData(inputs, outputs); 
    }
    
    classifier.normalizeData();
    classifier.train({ epochs: 200 }, finishedTraining);
}

function upd() {
  background(0);

  Gestures.showVideoFeed = showVideoCheckbox.checked();

  //handDetected = false;//will be set to true by gotResults() if so

  //update references to landmarks
  if(predictions!=null&&predictions.length!=0){
    Gestures.annotations = predictions[0].annotations;

    Gestures.palmBase = Gestures.annotations.palmBase[0];
    Gestures.thumbBase = Gestures.annotations.thumb[0];
    Gestures.indexFingerBase = Gestures.annotations.indexFinger[0];
    Gestures.middleFingerBase = Gestures.annotations.middleFinger[0];
    Gestures.ringFingerBase = Gestures.annotations.ringFinger[0];
    Gestures.pinkyBase = Gestures.annotations.pinky[0];
  }
  
  //console.log(deltaTime + "ms; FPS:"+(1000/deltaTime).toFixed(1)); //DEBUG show fps

  drawAndUpdateKeypoints();//draw the landmarks
  
  
  /*if(status != "ready"){
    push();
      stroke('#00FF12');
      fill('#00FF12');
      statusText("Not yet ready to detect...");
    pop();
  } else*/ if(predictions.length>0 && status=="ready"){
    let prediction = predictions[0];
    classifier.classify(predictionToData(prediction, "FOOBAR").positions, gotResults);
  } /*else {
    push();
      stroke('#00FF12');
      fill('#00FF12');
      statusText("Waiting to detect a hand...");
    pop();
  }
  */


  //refresh static variables
  Gestures.handpose = handpose;
  Gestures.video = video;
  Gestures.predictions = predictions;
  Gestures.classifier = classifier;
  Gestures.status = status;
  Gestures.handDetected = handDetected;
  
}

let drawPoints = false;
// draw ellipses over the detected keypoints and update static variables (for debug purposes)
function drawAndUpdateKeypoints() {

  if(!drawPoints) return;
  
  if(predictions.length > 0) {

    const prediction = predictions[0];
    
    //draw each landmark
    for (let i = 0; i < prediction.landmarks.length; i += 1) {
      const keypoint = prediction.landmarks[i];
      
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
      
    }

    push();
    stroke(color(255,255,255));

    let annotations = predictions[0].annotations;
    //console.log(annotations); 

    //draw lines between aech annotation landmarks
    for(let i = 0; i < annotations.thumb.length; i++){
      let landmark = annotations.thumb[i];
      if(i!=annotations.thumb.length-1){
        let nextLandmark = annotations.thumb[i+1];
        line(landmark[0], landmark[1], nextLandmark[0], nextLandmark[1]);
      }
    }
    for(let i = 0; i < annotations.indexFinger.length; i++){
      let landmark = annotations.indexFinger[i];
      if(i!=annotations.indexFinger.length-1){
        let nextLandmark = annotations.indexFinger[i+1];
        line(landmark[0], landmark[1], nextLandmark[0], nextLandmark[1]);
      }
    }
    for(let i = 0; i < annotations.middleFinger.length; i++){
      let landmark = annotations.middleFinger[i];
      if(i!=annotations.middleFinger.length-1){
        let nextLandmark = annotations.middleFinger[i+1];
        line(landmark[0], landmark[1], nextLandmark[0], nextLandmark[1]);
      }
    }
    for(let i = 0; i < annotations.ringFinger.length; i++){
      let landmark = annotations.ringFinger[i];
      if(i!=annotations.ringFinger.length-1){
        let nextLandmark = annotations.ringFinger[i+1];
        line(landmark[0], landmark[1], nextLandmark[0], nextLandmark[1]);
      }
    }
    for(let i = 0; i < annotations.pinky.length; i++){
      let landmark = annotations.pinky[i];
      if(i!=annotations.pinky.length-1){
        let nextLandmark = annotations.pinky[i+1];
        line(landmark[0], landmark[1], nextLandmark[0], nextLandmark[1]);
      }
    }
    

    let palmBase = annotations.palmBase[0];

    let thumbBase = annotations.thumb[0];
    let indexFingerBase = annotations.indexFinger[0];
    let middleFingerBase = annotations.middleFinger[0];
    let ringFingerBase = annotations.ringFinger[0];
    let pinkyBase = annotations.pinky[0];

    //connect palm base to pinky base and thumb base
    line(palmBase[0], palmBase[1], thumbBase[0], thumbBase[1]);
    line(palmBase[0], palmBase[1], pinkyBase[0], pinkyBase[1]);

    line(pinkyBase[0], pinkyBase[1], ringFingerBase[0], ringFingerBase[1]);
    line(ringFingerBase[0], ringFingerBase[1], middleFingerBase[0], middleFingerBase[1]);
    line(middleFingerBase[0], middleFingerBase[1], indexFingerBase[0], indexFingerBase[1]);
    line(indexFingerBase[0], indexFingerBase[1], thumbBase[0], thumbBase[1]);

    let indexFingerTip = annotations.indexFinger[3];
    let connection = createVector(indexFingerTip[0]-indexFingerBase[0], indexFingerTip[1]-indexFingerBase[1]);
  
  }
}

let data = [];
let loadedData;
//for training data; not used in gameplay
function keyPressed(){
  
  if (key=='x'){
    if(data.length==0){
      console.log("nothing to save!");
    } else {
      console.log("saved to JSON");
      saveJSON(data, "saved.json");
    }
    return;
  } else if (key=='l'){
    beginLoadData()
    return;
  } else if (key=='t'){
    
    if(data.length==0){
      console.log("nothing to train!");
      return;
    }
    trainData()
    return;
  }
  
  if(predictions.length <= 0){
    console.log("No predictions!");
    return;
  }
  
  let prediction = predictions[0];
  
  if(key=='c'){
    console.log(prediction);
  
  } else if (key=='b'){
    console.log("Classified as block");
    data.push(predictionToData(prediction, "block"));
  } else if (key=='s'){
    console.log("Classified as shoot");
    data.push(predictionToData(prediction, "shoot"));
  } else if (key=='o'){
    console.log("Classified as ok");
    data.push(predictionToData(prediction, "ok"));
  } else if (key=='y'){
    console.log("Classified as peace");
    data.push(predictionToData(prediction, "peace"));
  }else if (key=='z'){
    console.log("Deleted last prediction");
    data.pop();
  } else if (key=='p'){
    if(status!="ready"){
      console.log("Not ready to predict!");
    } else {
      classifier.classify(predictionToData(prediction, "FOOBAR").positions, gotResults);
    }
  }
}

function finishedTraining() {
  console.log("Finished training");
  status = "ready";
}

function gotResults(error, results) {

  if(results==null) return;
  if(results.length==0) return;

  let prediction = results[0].label;

  if(World.instance!=null)
    World.instance.player.receiveGesture(prediction);
  
  //console.log(JSON.stringify(results, null, 2));
  
  return;//the below is for debugging
  push();
    stroke('#303831');
    fill('#00FF12');
  
    /*
    if(prediction=="thumbsUp"){
      statusText("Detected: thumbs UP");
    } else if (prediction=="thumbsDown"){
      statusText("Detected: thumbs DOWN");
    }
    */
    if(prediction=="thumbsUp"){
      statusText("Detected: thumbs UP");
    } else if (prediction=="thumbsDown"){
      statusText("Detected: thumbs DOWN");
    } else if (prediction=="shoot"){
      statusText("Detected: shoot");
    } else if (prediction=="block"){
      statusText("Detected: block");
    }
  
  pop();
  
}

//const changeCooldown=500;
const changeCooldown=1000;
let lastTimeTextChanged=0;
let lastText;
function statusText(string){
  
  //console.log(millis() - lastTimeTextChanged);
  
  if(millis() - lastTimeTextChanged > changeCooldown){
    text(string, 10, 30); 
    lastTimeTextChanged = millis();
    //console.log("TEXT CHANGED");
    lastText = string;
  } else {
    if(lastText!=null)
      text(lastText, 10, 30);
  }
  
}

//flattens the landmark positions into just one array
function predictionToData(prediction, _label){
  
  let positions = [];
  
  for(let i = 0; i < 21; i++){
    //console.log(prediction.landmarks);
    let landmark = prediction.landmarks[i];
    for(let j = 0; j < 3; j++){
      let pos = landmark[j];
      positions.push(pos);
    }
  }
  
  let newData  = {
    positions: positions,
    label: _label
  };
  
  return newData;
}


