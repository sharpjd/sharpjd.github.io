//@ts-check

/**
 * "Template" for Projectiles, don't necessarily have to inherit
 */
class Projectile extends GameObject {
    constructor(type, x, y){
        super(type, x, y);

        this.collider.detectCollisions = true;
        this.movement.gravity = false;
        this.movement.collideWithGround = false;

        this.collider.collideRadius = 10;

        this.outOfBoundsDisposal= true;

    }

    display(){
        push();{
            noStroke();
            fill(color(73, 230, 244));

            translate(this.x,this.y);
            
            rotate(this.movement.velocity.heading());
            ellipse(0,0,20,4);
        } pop();

    }

    collide(other){
        
    }


}