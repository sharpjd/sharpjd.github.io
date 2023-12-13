//@ts-check

class AnnoyingEnemy extends GameObject {

    constructor(x, y, depth){
        super("AnnoyingEnemy", x, y, depth);

        this.types.push("Enemy");

        this.collideDamage = 10+10;
        this.dealtDamage=false;

        this.movement.velocity.x = -100;

        this.lastTimeFired = 0;
        this.reloadCounter = 0;

        this.magazineMax = 3;
        this.magazine = this.magazineMax;
        this.reload = 3000;
        this.fireRate = 180;

        this.behaviorState="Travelling";

        this.harassTimer = 20000;
        this.harassCounter = this.harassTimer;

        //inspiration drawn from Swarm Simulation
        //for avoiding player and projectiles
        this.personalSpaceCurrent = 250;
        this.separateMult = 1;
        this.separateMax = 15;
        this.separateCurrent = this.separateMax;

        //attracting to player (weaker than avoidance)
        this.playerAttractionMult = 1;
        this.playerAttractionMax = 5;
        this.playerAttractionCurrent = this.playerAttractionMax;

        this.borderBounceMult = 20;

        this.movement.maxSpeed = 150;

        this.damageAnimationTimer = 300;
        this.damageAnimationCounter = 0;
    }

    update(){
        if(this.hitpoints<=0) this.destroy();

        if(this.damageAnimationCounter>0){
            this.damageAnimationCounter-=deltaTime;
        }
        if(this.damageAnimationCounter<0)this.damageAnimationCounter=0;

        this.updateBehaviorState();
        //this.debugDraw(this.behaviorState);
        
        //crossed 500 -> accelerate off screen
        if(this.behaviorState=="Leaving"){
            if(this.movement.velocity.x >= -500){
                this.movement.velocity.x -= 100*deltaTime/1000;
            } else this.movement.velocity.x = -500;
        }
        if(this.behaviorState=="Travelling"){
            this.movement.velocity.x = -50;
        }

        //main behavior, eratically moving in front of player
        if(this.behaviorState=="Harassing"){

            //code adapted from Flocking Simulation

            //calculate separation
            let sum = createVector(0, 0);
            let count = 0;
            for(let i = 0; i < World.instance.gameObjects.length; i++){
                let go =  World.instance.gameObjects[i];
                if(go==null)continue;
                if(go.types.includes("Player") || go.types.includes("PlayerProjectile")){
                    let distance = go.position.copy().sub(this.position).mag();
                    if(distance < this.personalSpaceCurrent){
                        let isProjectile = go.types.includes("PlayerProjectile");
                        if(isProjectile){//twice the separation for projectiles 
                            sum.sub(go.position.copy().sub(this.position));    
                        }
                        sum.sub(go.position.copy().sub(this.position)); 
                        count++;
                    }
                }
            }
            if(count!=0){
                sum.mult(this.separateMult);
                sum.limit(this.separateCurrent);
                sum.div(count);
                this.movement.applyForce(sum);
            }            

            //copied from my submission for the Particle System ("Autonomous Agar.io")
            //for x specifically: keep in front of player
            if(this.position.x < 400) this.movement.applyForce(createVector(this.movement.mass, 0).mult(this.borderBounceMult));
            if(this.position.x > width) this.movement.applyForce(createVector(-this.movement.mass, 0).mult(this.borderBounceMult));
            if(this.position.y < 0) this.movement.applyForce(createVector(0, this.movement.mass).mult(this.borderBounceMult));
            if(this.position.y > height) this.movement.applyForce(createVector(0, -this.movement.mass).mult(this.borderBounceMult));

            //attract towards the player
            let diff = World.instance.player.position.copy().sub(this.position);
            diff.mult(this.playerAttractionMult);
            diff.limit(this.playerAttractionCurrent);
            this.movement.applyForce(diff);

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
        
    }

    updateBehaviorState(){
        if(this.behaviorState=="Travelling"){
            if(this.x <= 1000){
                this.behaviorState="Harassing";
            }
        }

        if(this.behaviorState=="Harassing"){
            this.harassTimer-=deltaTime;
            if(this.harassTimer<=0){
                this.behaviorState="Leaving"
            }
        }
    }

    fire(){

        let diff = World.instance.player.position.copy().sub(this.position);
        let heading = diff.heading();

        let p = new EnemyProjectile(this.x, this.y);
        p.damageAmount = 2;
        p.movement.velocity.x = cos(heading)*200;
        p.movement.velocity.y = sin(heading)*200;

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
            //point at player
            let heading = World.instance.player.position.copy().sub(this.position).heading();
            rotate(PI/2+heading);
            image(png_AnnoyingEnemy,0,0);
        }pop();
        pop();
    }

    damage(amount){
        this.hitpoints-=amount;
        this.damageAnimationCounter+=this.damageAnimationTimer;
        if(this.damageAnimationCounter>this.damageAnimationTimer)this.damageAnimationCounter=this.damageAnimationTimer;
    }

}