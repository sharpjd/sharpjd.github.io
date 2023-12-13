//@ts-check

class PlayerProjectile extends Projectile {
    constructor(x, y){
        super("PlayerProjectile", x, y);

        this.collider.detectCollisions = true;
        this.movement.gravity = false;
        this.movement.collideWithGround = false;

        this.collider.collideRadius = 10;

        this.alreadyDealtDamage = false;

        sfx_mediumLaser.play(undefined,undefined,undefined,undefined,3);
    }

    update(){
        super.update();
    }

    display(){
        push();{
            fill(color(73, 230, 244));

            translate(this.x,this.y);
            rotate(this.movement.velocity.heading());
            ellipse(0,0,20,6);
        } pop();

        //this.collider.drawCollisionRadius();
    }

    collide(other){
        if (other.types.includes("Enemy") && !this.alreadyDealtDamage){
            other.damage(10);
           // this.debugLog(other.player.hitpoints);
            this.destroy();
            this.alreadyDealtDamage = true;
            getRandomFrom(sfxs_hit).play(undefined,undefined,undefined,undefined,3);
        } else {
            //this.debugLog("I COLLIDED WITH SOMETHING ELSE")
        }
    }

    destroy(){
        this.slatedForDeletion=true;
    }

}