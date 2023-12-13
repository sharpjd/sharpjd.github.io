//@ts-check

var ID = 0;

const OUT_OF_BOUNDS_THRESHOLD = 300;

/**
 * Represents an entity with movement, collision, health, and an appearance. Added to World and updated in a loop.
 */
class GameObject{

    constructor(type, x, y, depth){
        this.slatedForDeletion =  false;
        this.ID = ID;
        this.collider = new Collider(this, 30);//Movement requires Collider so initialize it first
        this.movement = new Movement(x, y, this);
        this.x = this.movement.position.x;
        this.y = this.movement.position.y;

        /**
         * Used to indentify the type of object (i.e. for collisions, etc) for internal purposes. This is NOT its name.
         */
        this.types = [];

        if(depth!=null){
            this.depth=depth;
        } else {
            this.depth=0;
        }

        this.position = this.movement.position;

        this.maxHitpoints = 100;
        this.hitpoints = 100;
        
        if(type==undefined){
            throw new Error("GameObjects require a type string parameter");
        }
        this.types.push(type);

        /**
         * Whether to automatically slate this object for deletion if it goes a certain distance
         * beyond borders (controlled by a constant).
         */
        this.outOfBoundsDisposal = true;
        /**
         * Whether to log a warning message if this object gets OOB-disposed on its first update frame
         */
        this.immediateDisposalWarning = true;

        this.framesExisted = 0;

        ID++;
    }
    
    /**
     * Calls this GameObject's MovementModule's update() function, then the GameObject's update() function. 
     * This function is not intended to be overriden, override update() instead
     */
    mainUpdate(){

        this.framesExisted++;

        if(this.outOfBoundsDisposal){
            this.detectOutOfBounds();
        }

        this.movement.update();
        this.collider.update();

        //shorthands for convenience purposes
        this.x = this.movement.position.x; 
        this.y = this.movement.position.y;
        this.position = this.movement.position;

        this.update();        

    }

    /**
     * Called from the game loop each frame.
     */
    update(){
        
    }

    /**
     * Called after the update() function of each GameObject from the main game loop.
     */
    display(){
        
    }

    /**
     * By default, sets the GameObject's SlatedForDeletion property to true; it will be removed next frame without update() being called.
     * If overriden, remember that you must set this GameObject's slatedForDeletion property to true to remove it from the game loop.
     */
    destroy(){
        this.slatedForDeletion = true;
    }

    /**
     * Called by the coupled Collider when the circular hitbox collides with this one.
     */
    collide(other){
        
    }

    isTouchingMouse(){
        let distance = dist(this.x, this.y, mouseX, mouseY);
        if(distance<=this.collider.collideRadius){
            return true;
        }
        return false;
    }

    /**
     * These are not unique. Returns this GameObject's name identifier (null by default unless overriden). This will be displayed alongside the ID when using debugLog.
     * This is NOT the GameObject *type* property, which is used for internal purposes.
     * @returns the custom name for this object; null by default
     */
    getName(){
        return `<${this.types}>`;
    }

    /**
     * NOT intended to be overriden or called from outside of gameObject.mainUpdate().
     * If automatic OOB disposal is set to true, this slate this object for deletion if the gameObject
     * position goes a certain distance outside of the canvas. This does NOT call destroy()
     */
    detectOutOfBounds(){
        let offset = OUT_OF_BOUNDS_THRESHOLD;
        if(this.x > width+offset || this.x < 0-offset || this.y > height+offset || this.y < 0-offset){
            this.slatedForDeletion = true;
            if(this.framesExisted==1 && this.immediateDisposalWarning){
                this.debugLog("WARNING: I was disposed on frame 1");
            }
        }
    }
    
    /**
     * Logs the GameObject's ID, name (its type if not defined), and the specified text to the console.
     * @param {Object} stuff The text to display. 
     */
    debugLog(stuff){
        let t = `<${this.types}>`;
        console.log(`GameObject ID ${this.ID} (${this.getName()!=null?this.getName():t}): ${stuff}`);
    }

    /**
     * Draws the GameObject's ID, name (its type if not defined), and the specified text at the location of this GameObject.
     * @param {Object} str The text to display.
     */
    debugDraw(str){
        push();{
            fill(color(255, 0, 0));
            textAlign(CENTER);
            let t = `<${this.types}>`;
            text(`${this.ID} (${this.getName()!=null?this.getName():t}): ${str==undefined?"":str}`, this.movement.position.x, this.movement.position.y);
        }pop();
    }

    damage(amount){
        this.hitpoints-=amount;
    }
    
}