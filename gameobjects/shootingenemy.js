//@ts-check

class ShootingEnemy extends GameObject {

    constructor(x, y, depth){
        super("ShootingEnemy", x, y, depth);

        this.types.push("Enemy");

        this.collideDamage = 20+10;
        this.dealtDamage=false;

        this.movement.velocity.x = -100;

        this.lastTimeFired = 0;
        this.reloadCounter = 0;

        this.magazineMax = 3;
        this.magazine = this.magazineMax;
        this.reload = 3000;
        this.fireRate = 180;

        this.damageAnimationTimer = 300;
        this.damageAnimationCounter = 0;
    }

    update(){
        if(this.hitpoints<=0) this.destroy();

        //if reach halfway across the screen, just accelerate and zip on by
        if(this.x <= 500){ 
            if(this.movement.velocity.x >= -500){
                this.movement.velocity.x -= 100*deltaTime/1000;
            } else this.movement.velocity.x = -500;
        }

        //firing state machine
        if(millis() - this.lastTimeFired > this.fireRate){
            if(this.magazine>0){
                this.fire();
                this.lastTimeFired = millis();
                this.magazine--;
                if(this.magazine<=0){
                    this.reloadCounter += this.reload;
                }
            }
        }
        if(this.reloadCounter > 0){
            //this.debugLog(this.reloadCounter);
            this.reloadCounter-=deltaTime;
            if(this.reloadCounter<=0){
                this.magazine = this.magazineMax;
            }
        }
        
    }

    fire(){

        let diff = World.instance.player.position.copy().sub(this.position);
        let heading = diff.heading();

        let p = new EnemyProjectile(this.x, this.y);

        //point new projectile at player
        p.movement.velocity.x = cos(heading)*280;
        p.movement.velocity.y = sin(heading)*280;

        World.instance.addGameObject(p);
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
        World.instance.player.hitpoints+=10;
        scoreCounter.score+=10;

        getRandomFrom(sfxs_explosion).play(undefined,undefined,undefined,undefined,3);
    }

    display(){
        push();
        let rOffset = 255*(this.damageAnimationCounter/this.damageAnimationTimer);

        push();{
            tint(color(230+rOffset, 120, 42));
            translate(this.x,this.y);
            imageMode(CENTER);
            //point at player
            let heading = World.instance.player.position.copy().sub(this.position).heading();
            rotate(PI/2+heading);
            image(png_ShootingEnemy,0,0);
        }pop();

        pop();
    }

    damage(amount){
        this.hitpoints-=amount;
        this.damageAnimationCounter+=this.damageAnimationTimer;
        if(this.damageAnimationCounter>this.damageAnimationTimer)this.damageAnimationCounter=this.damageAnimationTimer;
    }

}