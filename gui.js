
//@ts-check

/**
 * GUIObjects get added here; has an update loop similar to the World class, but runs independently
 */
class GUI {

    static instance; //singleton

    constructor(){
        this.guiObjects = [];

        GUI.instance = this;//singleton

        this.tempAddGuiObjects = []; //used to hold GameObjects added this frame
    }

    update(){
        let freshGuiObjectsList = []; //will be free of objects slated for deletion
    
        //intuitively, logic must be reversed since loop iterates backwards
        this.guiObjects.sort((first, second) => (first.depth > second.depth ? -1 : 1) );
        //main GUI object loop; higher depth is drawn first, lower depth is drawn last
        for(let i = this.guiObjects.length-1; i >= 0; i--){
            var guiObject = this.guiObjects[i];

            if(!(guiObject instanceof GUIObject)){
                console.error(`There is a non-GUIObject item in the main array (index: ${i}, ${guiObject})`)
            }
            //console.log("GUI object depth in loop: "+guiObject.depth);
    
            if(guiObject.slatedForDeletion){ //if slated for deletion, null the object and don't push into new GO list
                guiObject = null;
            } else {
                freshGuiObjectsList.push(guiObject); //else, push into new GO list
            }
    
            if(guiObject != null){
                guiObject.update();
                guiObject.display();
            }
        }
    
        this.guiObjects = freshGuiObjectsList; //replaced with new GO list free of nulls
        //SYNTAX WARNING: concat() doesn't change the original array, it returns a new one
        this.guiObjects = this.guiObjects.concat(this.tempAddGuiObjects); //add gameObjects that gameObjects in the loop instantiated
        this.tempAddGuiObjects = []; //reset the temp gameObject hold
    }

    addGuiObject(guiObject){
        if(!(guiObject instanceof GUIObject)){
            throw new Error("Tried to add non-GuiObject item into the GUI loop: " + guiObject);
        }
        this.tempAddGuiObjects.push(guiObject);
    }

}


