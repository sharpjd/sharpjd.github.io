//@ts-check

/**
 * Handles collisions for the GameObject. 
 * Every GameObject has this.
 * Uses simple circle radius collision detection
 */
class Collider {

    constructor(gameObject, collideRadius){
        this.gameObject = gameObject;
        this.collideRadius = collideRadius;

        /**
         * whether this detects collisions and tells the parent gameobject it's collided with something
         */
        this.detectCollisions = true; 

        if(!(gameObject instanceof GameObject)){
            throw new Error("Collider object wasn't passed a required gameObject reference");
        }
        
    }

    /**
     * Called from this GameObject's MainUpdate(); no need to call this from anywhere else
     */
    update(){
        if(this.detectCollisions){
            //loop through all gameObjects and their colliders
            for(let i = 0; i < World.instance.gameObjects.length; i++){
                let other = World.instance.gameObjects[i];
                if(other==this.gameObject)continue;//avoid colliding with self!!
    
                let dist = this.gameObject.movement.position.dist(other.movement.position);
                if(dist < this.collideRadius + other.collider.collideRadius){//if collision radius is touching
                    this.gameObject.collide(other);
                }
            }
        }

    }

    /**
     * Draws a circle at the location of the GameObject representing the precise collision radius of this collider
     */
    drawCollisionRadius(){
        push();{
            stroke(color(239, 14, 104));
            fill(color(0, 0));//transparent fill
            //seriously? the third param is diameter and not circle?
            circle(this.gameObject.x, this.gameObject.y, this.collideRadius*2);
        }pop();
    }
}