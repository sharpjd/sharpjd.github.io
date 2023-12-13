//@ts-check

var ID = 0;

/**
 * Represents a GUIObject with a position, depth, type, and appearance to be added to a GUI object
 * Is basically a simpler version of a GameObject
 */
class GUIObject {
    constructor(type, x, y, depth){
        this.type = type;
        this.ID = ID;
        this.position = createVector(x, y);
        this.x = this.position.x;
        this.y = this.position.y;

        if(depth!=undefined && depth!=null){
            if(!(typeof depth === 'number'))
                throw new Error(`Passed GUIObject depth needs to be a number! (got:)${depth}`);
            this.depth=depth;
        } else {
            this.depth=0;
        }

        ID++;

        this.slatedForDeletion = false;
    }

    /**
     * Called from the GUI loop each frame.
     */
    update(){
        
    }

    /**
     * Called after the update() function of each GUIObject from the main GUI loop.
     */
    display(){
        
    }

    getName(){
        let t = `<${this.type}>`;
    }

    debugLog(stuff){
        let t = `<${this.type}>`;
        console.log(`GUIObject ID ${this.ID} (${this.getName()!=null?this.getName():t}): ${stuff}`);
    }
}