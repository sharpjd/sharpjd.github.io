//@ts-check

/**
 * Represents a position, acceleration, velocity, mass, and entity to be affected by force.
 * Every GameObject has this.
 */
class Movement{

    constructor(x, y, gameObject){

        this.gameObject = gameObject; //reference to parent gameObject
        if(!(gameObject instanceof GameObject)){
            throw new Error("Movement object wasn't passed a required gameObject reference");
        }

        this.position = createVector(x, y);
        if(x == undefined) this.position.x = width/2;
        if(y == undefined) this.position.y = height/2;

        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, 0);

        this.maxSpeed = 1000; //as a safeguard/easy debugging
        //this.maxForce = 5;

        this.mass = 1;

        this.gravity = false;
        this.gravityAccel = 10; 
        this.collideWithGround = false;
        this.virtualGroundLevel = (height-100);

        /**
         * Whether you can drag this object with the mouse. For debugging purposes.
         */
        this.draggable = false; 

    }

    update(){

        let lowerColliderBound = this.gameObject.y + this.gameObject.collider.collideRadius;
        let isTouchingGround = lowerColliderBound >= this.virtualGroundLevel;

        if(this.gravity && !isTouchingGround){ //apply gravity
            this.applyForce(createVector(0, this.mass*this.gravityAccel*deltaTime/1000));
        }
        if(this.collideWithGround && isTouchingGround){ 
            //avoid being *in* the ground, causing multiple jumps to be queued
            this.position.y = this.virtualGroundLevel - this.gameObject.collider.collideRadius;
        }


        //these should come at the end
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        if(this.collideWithGround){
            if(isTouchingGround && this.velocity.y > 0){ //prevent moving through ground
                this.velocity.y = 0;
            }
        }
        this.position.add(this.velocity.copy().mult(deltaTime/1000));

        if(this.draggable){//can drag some things with a mouse for debugging purposes
            if(this.gameObject.isTouchingMouse()){

                this.gameObject.collider.drawCollisionRadius();

                if(mouseIsPressed){
                    this.position = createVector(mouseX, mouseY);
                    this.velocity = createVector(0,0);
                    this.acceleration = createVector(0,0);
                }
            }
        }
        this.acceleration.mult(0);
    }

    applyForce(force){
        // @ts-ignore
        if(!(force instanceof p5.Vector)){
            this.gameObject.debugLog("error: applyForce passed a non-vector");
            throw new Error("must pass a vector into applyForce");
        }

        //force.limit(this.maxForce);
        this.acceleration.add(force.div(this.mass));
    }

}