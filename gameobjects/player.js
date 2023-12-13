//@ts-check

const xf = -420 //x-offset (by default, everything is shifted 640 right due to video)
//const yrange = 720 //maps handpose y to this y

class Player extends GameObject{

  constructor(x, y){
      super("Player", x, y);
      this.collider.collideRadius = 20;
      this.defaultCollideRadius = 20;//when shields aren't activated
      this.movement.gravity = false;
      this.movement.collideWithGround = false;

      this.jumpVelocity = -5;

      //this.movement.draggable = true;//debug purposes

      this.maxHitpoints=100;
      this.hitpoints=100;

      this.fireRate = 150;
      this.lastTimeFired = 0;

      this.damageAnimationTimer = 300;
      this.damageAnimationCounter = 0;

      this.supressShooting = false;

      this.shield = new Shield(this);
      World.instance.addGameObject(this.shield);
      
  }

  damage(amount){
    if(this.shield.active && this.shield.hitpoints>0){
      this.shield.damage(amount);
      getRandomFrom(sfxs_forcefield).play(undefined,undefined,undefined,undefined,3);
    } else {
      this.hitpoints -= amount;
      getRandomFrom(sfxs_hurt).play(undefined,undefined,undefined,undefined,3);
      this.damageAnimationCounter+=this.damageAnimationTimer;
    }
  }

  update(){
      //this.collider.drawCollisionRadius();

      if(this.damageAnimationCounter>0){
        this.damageAnimationCounter-=deltaTime;
      }
      if(this.damageAnimationCounter<0)this.damageAnimationCounter=0;

      if(this.hitpoints<=0){
          //this.destroy(); //not necessary because game just pauses on gameover 
      }
      if(this.hitpoints>100){//cap hitpoints
        this.hitpoints=100;
      }

      //hitbox changes based on shield level (if it is activated)
      if(this.shield.active){
        let hp = this.hitpoints
        if(hp>=0 && hp<30){
            this.collider.collideRadius = firstRingRadius;
        } else if (hp>=30 && hp<60){
            this.collider.collideRadius = secondRingRadius;
        } else if (hp>=60){
            this.collider.collideRadius = thirdRingRadius;
        }
      } else {
          this.collider.collideRadius = this.defaultCollideRadius;
      }
      
      //find the average position of the digit's base point and palm point 
      //and position the hitbox there
      if(predictions!=null&&predictions.length!=0){
        let annotations = predictions[0].annotations;

        let palmBase = Gestures.palmBase;
        let thumbBase = Gestures.thumbBase;
        let indexFingerBase = Gestures.indexFingerBase;
        let middleFingerBase = Gestures.middleFingerBase;
        let ringFingerBase = Gestures.ringFingerBase;
        let pinkyBase = Gestures.pinkyBase;

        let averagePos = createVector(0,0);
        averagePos.add(createVector(palmBase[0],palmBase[1]));
        averagePos.add(createVector(thumbBase[0],thumbBase[1]));
        averagePos.add(createVector(indexFingerBase[0],indexFingerBase[1]));
        averagePos.add(createVector(middleFingerBase[0],middleFingerBase[1]));
        averagePos.add(createVector(ringFingerBase[0],ringFingerBase[1]));
        averagePos.add(createVector(pinkyBase[0],pinkyBase[1]));
        averagePos.div(6);

        this.movement.position = averagePos;
        this.movement.position.x += xf;
      }
  }

  display(){

    push();

      this.drawHand();

      noFill();
      stroke(color(195, 41, 108));
      strokeWeight(4);

      //this central pink circle (the default hitbox)
      circle(this.x, this.y, this.defaultCollideRadius*2);

    pop();
  }

  drawHand(){

    push();

    let rOffset = 255*(this.damageAnimationCounter/this.damageAnimationTimer);

      predictions = Gestures.predictions;
      if(predictions.length > 0) {
          const prediction = predictions[0];

          //draw the "joints"
          for (let i = 0; i < prediction.landmarks.length; i += 1) {
            const keypoint = prediction.landmarks[i];
            
            fill(color(104+rOffset, 25, 59));
            noStroke();
            ellipse(keypoint[0]+xf, keypoint[1], 8, 8);
          }
      
          push();
          strokeWeight(2);
          strokeCap(ROUND);
          stroke(color(195+rOffset, 41, 108));
      
          /*
          CONNECT THE DOTS
          */
          let annotations = predictions[0].annotations;
          for(let i = 0; i < annotations.thumb.length; i++){
            let landmark = annotations.thumb[i];
            if(i!=annotations.thumb.length-1){
              let nextLandmark = annotations.thumb[i+1];
              line(landmark[0]+xf, landmark[1], nextLandmark[0]+xf, nextLandmark[1]);
            }
          }
          for(let i = 0; i < annotations.indexFinger.length; i++){
            let landmark = annotations.indexFinger[i];
            if(i!=annotations.indexFinger.length-1){
              let nextLandmark = annotations.indexFinger[i+1];
              line(landmark[0]+xf, landmark[1], nextLandmark[0]+xf, nextLandmark[1]);
            }
          }
          for(let i = 0; i < annotations.middleFinger.length; i++){
            let landmark = annotations.middleFinger[i];
            if(i!=annotations.middleFinger.length-1){
              let nextLandmark = annotations.middleFinger[i+1];
              line(landmark[0]+xf, landmark[1], nextLandmark[0]+xf, nextLandmark[1]);
            }
          }
          for(let i = 0; i < annotations.ringFinger.length; i++){
            let landmark = annotations.ringFinger[i];
            if(i!=annotations.ringFinger.length-1){
              let nextLandmark = annotations.ringFinger[i+1];
              line(landmark[0]+xf, landmark[1], nextLandmark[0]+xf, nextLandmark[1]);
            }
          }
          for(let i = 0; i < annotations.pinky.length; i++){
            let landmark = annotations.pinky[i];
            if(i!=annotations.pinky.length-1){
              let nextLandmark = annotations.pinky[i+1];
              line(landmark[0]+xf, landmark[1], nextLandmark[0]+xf, nextLandmark[1]);
            }
          }
      
          let palmBase = Gestures.palmBase;
          let thumbBase = Gestures.thumbBase;
          let indexFingerBase = Gestures.indexFingerBase;
          let middleFingerBase = Gestures.middleFingerBase;
          let ringFingerBase = Gestures.ringFingerBase;
          let pinkyBase = Gestures.pinkyBase;

          //connect palm base to pinky base and thumb base
          line(palmBase[0]+xf, palmBase[1], thumbBase[0]+xf, thumbBase[1]);
          line(palmBase[0]+xf, palmBase[1], pinkyBase[0]+xf, pinkyBase[1]);
      
          //connect the rest of the base points to create shape of the "palm"
          line(pinkyBase[0]+xf, pinkyBase[1], ringFingerBase[0]+xf, ringFingerBase[1]);
          line(ringFingerBase[0]+xf, ringFingerBase[1], middleFingerBase[0]+xf, middleFingerBase[1]);
          line(middleFingerBase[0]+xf, middleFingerBase[1], indexFingerBase[0]+xf, indexFingerBase[1]);
          line(indexFingerBase[0]+xf, indexFingerBase[1], thumbBase[0]+xf, thumbBase[1]);
      
          //these are needed in the display() function
          let indexFingerTip = annotations.indexFinger[3];
          let indexFingerBaseToTip = createVector(indexFingerTip[0]-indexFingerBase[0], indexFingerTip[1]-indexFingerBase[1]);

          //these are needed in the display() function
          this.indexFingerBaseToTipVec = indexFingerBaseToTip;
          this.indexFingerTipVec = createVector(indexFingerTip[0], indexFingerTip[1]);
  
          pop();
      }

      pop();
  }

  collide(other){
      //this.debugLog("I'm colliding with " + other.getName());
  }

  destroy(){
      this.slatedForDeletion=true;
  }

  receiveGesture(receivedGesture){

      //pass on to shield
      this.shield.receiveGesture(receivedGesture);

      if(Sketch.paused)return;

      if(receivedGesture!=null){
        if (receivedGesture=="shoot"){
            if(this.supressShooting){
              this.debugLog("Shooting supressed");
              return;
            }

            if(millis() - this.lastTimeFired > this.fireRate){
              this.lastTimeFired = millis();              

              //instantiate projectile at fingertip
              let p = new PlayerProjectile(this.indexFingerTipVec.x+xf, this.indexFingerTipVec.y);
              let heading = this.indexFingerBaseToTipVec.heading();//pointing heading of projected index finger

              line(this.indexFingerTipVec.x+xf, this.indexFingerTipVec.y, 
                  this.indexFingerTipVec.x+xf+this.indexFingerBaseToTipVec.x+xf, 
                  this.indexFingerTipVec.y+this.indexFingerBaseToTipVec.y);

              //point in projected direction of index finger
              p.movement.velocity.x = cos(heading)*650;
              p.movement.velocity.y = sin(heading)*650;

              World.instance.addGameObject(p);
            }
          } else if (receivedGesture=="block"){
              //not necessary, handled by calling shield receiveGesture() function
          } else {
              //this.debugLog("Received unrecognized gesture: " + receivedGesture);
          }
      }
  }

  getName(){
      return "Player";
  }

}