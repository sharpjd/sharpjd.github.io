//@ts-check

class EnemyProjectile extends Projectile {
    constructor(x, y){
        super("EnemyProjectile", x, y);

        this.collider.detectCollisions = true;
        this.movement.gravity = false;
        this.movement.collideWithGround = false;

        this.collider.collideRadius = 10;

        this.alreadyDealtDamage = false;

        this.damageAmount = 7;

        sfx_lowLaser.play(undefined,undefined,undefined,undefined,3);
    }

    update(){
        super.update();
    }

    display(){
        push();{
            noFill();
            fill(color(230, 120, 42));

            translate(this.x,this.y);
            rotate(this.movement.velocity.heading());
            ellipse(0,0,20,6);
        
        } pop();

        //this.collider.drawCollisionRadius();
    }

    collide(other){
        if (other.types.includes("Player") && !this.alreadyDealtDamage){
            //this.debugLog("I HIT THE PLAYER");
            other.damage(this.damageAmount);
            //this.debugLog(other.player.hitpoints);
            this.destroy();
            this.alreadyDealtDamage = true;
        } else {
            //this.debugLog("I COLLIDED WITH SOMETHING ELSE")
        }
    }

    destroy(){
        this.slatedForDeletion=true;
    }

}