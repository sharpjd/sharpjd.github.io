//@ts-check

//determines the hitbox too
const firstRingRadius = 30;
const secondRingRadius = 40;
const thirdRingRadius = 50;

class Shield extends GameObject {

    constructor(player){
        super("Shield", 0, 0, 0);

        this.hitpoints = 90;

        this.player = player;

        this.active = false;//controlled by this.receivedGesture();

        this.regenPerSec = 9;

        /**
         * How long to wait before recharging after being broken
         */
        this.regenCooldown = 3000;
        this.regenCooldownCounter = 0;
    }

    update(){
        this.movement.position = this.player.position;

        //this.debugDraw(this.hitpoints);

        //you can "break the shield" and initiate a cooldown
        if(this.hitpoints<=0 && this.regenCooldownCounter<=0){
            this.regenCooldownCounter+=this.regenCooldown;
            this.debugLog("Broken!");
        }

        //don't regen if there's a cooldown
        if(this.regenCooldownCounter<=0){
            this.hitpoints+=this.regenPerSec*deltaTime/1000;
            if(this.hitpoints>90)this.hitpoints=90;
        } else {
            this.regenCooldownCounter-=deltaTime;
            this.active=false; //can't activate if broken
            if(this.regenCooldownCounter<=0){ //necessary otherwise it'll remain broken
                this.hitpoints=0;
                this.hitpoints+=this.regenPerSec*deltaTime/1000;
            }
        }

    }

    display(){
        push();

        strokeWeight(2);
        let shieldColor;
        if(this.active){
            shieldColor = color(73, 230, 244);
        } else {
            shieldColor = color(255,255,255);
        }
        
        noFill();

        if(this.hitpoints>=0){ //first ring (closest, smallest)
            
            if(this.active){
                shieldColor.setAlpha(map(this.hitpoints, 0, 30, 80, 255, true));
            } else shieldColor.setAlpha(map(this.hitpoints, 0, 30, 0, 60, true));
            stroke(shieldColor);

            circle(this.x, this.y, firstRingRadius*2);
        }

        if(this.hitpoints>=30){ //second ring

            if(this.active){
                shieldColor.setAlpha(map(this.hitpoints, 30, 60, 80, 255, true));
            } else shieldColor.setAlpha(map(this.hitpoints, 30, 60, 0, 60, true));
            stroke(shieldColor);

            circle(this.x, this.y, secondRingRadius*2);
        }

        if(this.hitpoints>=60){ //third ring

            if(this.active){
                shieldColor.setAlpha(map(this.hitpoints, 60, 90, 80, 255, true));
            } else shieldColor.setAlpha(map(this.hitpoints, 60, 90, 0, 60, true));
            stroke(shieldColor);

            circle(this.x, this.y, thirdRingRadius*2);
        }

        pop();
    }

    //called by the player object
    receiveGesture(receivedGesture){
        //if(receivedGesture=="block"){
        if(receivedGesture=="block"){
            this.active=true;
        } else {
            this.active=false;
        }
    }

}