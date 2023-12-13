
//@ts-check

class World {

    static instance; //singleton

    constructor(){

        World.instance = this;//singleton

        this.gameObjects = [];
        this.tempAddGameObjects = []; //used to hold GameObjects added this frame

        this.player = new Player();
        this.addGameObject(this.player);

        this.spawner = new Spawner();
        this.addGameObject(this.spawner);
    }

    update(){

        //if(Sketch.paused) return;

        let freshGameObjectsList = []; //will be free of objects slated for deletion
    
        //the main Update() game loop
        if(!Sketch.paused){
            for(let i = this.gameObjects.length-1; i >= 0; i--){
                var gameObject = this.gameObjects[i];
                if(!(gameObject instanceof GameObject)){
                    console.error(`There is a non-GameObject item in the main array (index: ${i}, ${gameObject})`)
                }
        
                if(gameObject.slatedForDeletion){ //if slated for deletion, null the object and don't push into new GO list
                    gameObject = null;
                } else {
                    freshGameObjectsList.push(gameObject); //else, push into new GO list
                }
        
                if(gameObject != null){
                    gameObject.mainUpdate();
                }
            }

            this.gameObjects = freshGameObjectsList; //replaced with new GO list free of nulls
            //SYNTAX WARNING: concat() doesn't change the original array, it returns a new one
            this.gameObjects = this.gameObjects.concat(this.tempAddGameObjects); //add gameObjects that gameObjects in the loop instantiated
            this.tempAddGameObjects = []; //reset the temp gameObject hold
        }

        //gameObjects need a depth too...
        //gameObjects.display() is excluded from pause
        let gameObjectsToDisplay = freshGameObjectsList.slice();//copy
        gameObjectsToDisplay.sort((first, second) => (first.depth > second.depth ? -1 : 1) );
        for(let i = gameObjectsToDisplay.length-1; i >= 0; i--){
            let toDisplay = gameObjectsToDisplay[i];
            if(toDisplay!=null){
                toDisplay.display();
            }
        }
    

    }

    addGameObject(gameObject){
        if(!(gameObject instanceof GameObject)){
            throw new Error("Tried to add non-GameObject item into the game loop: " + gameObject);
        }
        this.tempAddGameObjects.push(gameObject);
    }

}


