//@ts-check

class HomingEnemy extends GameObject {

    constructor(x, y, depth){
        super("HomingEnemy", x, y, depth);
        this.types.push("Enemy");

        this.collideDamage = 30+10;
        this.dealtDamage=false;//used to ensure collision damage is dealt only once

        this.movement.velocity.x = -250;

        this.damageAnimationTimer = 300;
        this.damageAnimationCounter = 0;

        this.topDiskRotation=0;
        this.lowerDiskRotation=0;
        this.diskRotationRate=2*PI;//per second
    }

    update(){
        if(this.hitpoints<=0) this.destroy();

        if(this.damageAnimationCounter>0){
            this.damageAnimationCounter-=deltaTime;
        }
        if(this.damageAnimationCounter<0)this.damageAnimationCounter=0;

        //keep up with y-level of the player
        if(World.instance.player!=null && this.x > World.instance.player.x){
            let yDiff = World.instance.player.y - this.y;

            this.movement.velocity.y = constrain(yDiff, -100, 100);
        }
        
    }

    collide(other){

        if(other.types.includes("Player")){
            if(!this.dealtDamage){
                other.damage(this.collideDamage);
                this.dealtDamage=true;
            }
            this.destroy();
        }
    }

    destroy(){
        this.slatedForDeletion=true;
        scoreCounter.score+=10;
        World.instance.player.hitpoints+=10;
    }

    display(){
        push();
        let rOffset = 255*(this.damageAnimationCounter/this.damageAnimationTimer);
        fill(color(230+rOffset, 120, 42));

        this.topDiskRotation+=this.diskRotationRate*deltaTime/1000;
        this.lowerDiskRotation-=this.diskRotationRate*deltaTime/1000;

        push();{//lower disk
            tint(color(230+rOffset, 120, 42));
            translate(this.x,this.y);
            imageMode(CENTER);
            rotate(PI/2+this.lowerDiskRotation);
            image(png_HomingEnemy,0,0);
        }pop();
        push();{//top disk
            tint(color(230+rOffset, 120, 42));
            translate(this.x,this.y);
            imageMode(CENTER);
            rotate(PI/2+this.topDiskRotation);
            image(png_HomingEnemy,0,0);
        }pop();

        pop();
        
    }

    damage(amount){
        this.hitpoints-=amount;
        this.damageAnimationCounter+=this.damageAnimationTimer;
        if(this.damageAnimationCounter>this.damageAnimationTimer)this.damageAnimationCounter=this.damageAnimationTimer;
    }

}