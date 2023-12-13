//@ts-check

class LaserEnemy extends GameObject {

    constructor(x, y, depth){
        super("LaserEnemy", x, y, depth);

        this.types.push("Enemy");

        this.collideDamage = 15+10;
        this.dealtDamage=false;//used to ensure collision damage is dealt only once

        this.movement.velocity.x = -50;

        this.cooldown = 9000+9000; //exclusive of time it takes to actually fire
        this.cooldownCounter = 0;
        
        this.firingState="None";

        this.damageAnimationTimer = 300;
        this.damageAnimationCounter = 0;
    }

    update(){

        if(this.hitpoints<=0) this.destroy();

        if(this.damageAnimationCounter>0){
            this.damageAnimationCounter-=deltaTime;
        }
        if(this.damageAnimationCounter<0)this.damageAnimationCounter=0;

        //if reach halfway across the screen, just accelerate and zip on by
        if(this.x <= 500){ 
            if(this.movement.velocity.x >= -500){
                this.movement.velocity.x -= 100*deltaTime/1000;
            } else this.movement.velocity.x = -500;
        }

        if(this.cooldownCounter<=0 && this.x < 900){
            this.laser();
            this.cooldownCounter+=this.cooldown;
        }
        if(this.cooldownCounter>0){
            this.cooldownCounter-=deltaTime;
        }
    }

    laser(){

        //laser is a mostly indepdendent object
        let l = new Laser(this, World.instance.player, 9000, 5000);
        World.instance.addGameObject(l);

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
            //point to player
            let heading = World.instance.player.position.copy().sub(this.position).heading();
            rotate(PI/2+heading);
            image(png_LaserEnemy,0,0);
        }pop();

        pop();
    }

    damage(amount){
        this.hitpoints-=amount;
        this.damageAnimationCounter+=this.damageAnimationTimer;
        if(this.damageAnimationCounter>this.damageAnimationTimer)this.damageAnimationCounter=this.damageAnimationTimer;
    }

}