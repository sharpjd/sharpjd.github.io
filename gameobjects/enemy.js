//@ts-check

class Enemy extends GameObject {

    constructor(x, y, depth){
        super("StandardEnemy", x, y, depth);

        this.types.push("Enemy");

        this.collideDamage = 10+10;
        this.dealtDamage=false;//used to ensure this deals damage only once

        this.movement.velocity.x = -250;

        this.damageAnimationTimer = 300;
        this.damageAnimationCounter = 0;

        this.collider.collideRadius=25;
    }

    update(){
        if(this.hitpoints<=0) this.destroy();
        if(this.damageAnimationCounter>0){
            this.damageAnimationCounter-=deltaTime;
        }
        if(this.damageAnimationCounter<0)this.damageAnimationCounter=0;
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

        getRandomFrom(sfxs_explosion).play(undefined,undefined,undefined,undefined,3);
    }

    display(){
        push();
        let rOffset = 255*(this.damageAnimationCounter/this.damageAnimationTimer);

        push();{
            tint(color(230+rOffset, 120, 42));
            translate(this.x,this.y);
            imageMode(CENTER);
            rotate(-PI/2)
            image(png_StandardEnemy,0,0);
        }pop();

        pop();
    }

    damage(amount){
        this.hitpoints-=amount;
        this.damageAnimationCounter+=this.damageAnimationTimer;
        if(this.damageAnimationCounter>this.damageAnimationTimer)this.damageAnimationCounter=this.damageAnimationTimer;
    }

}