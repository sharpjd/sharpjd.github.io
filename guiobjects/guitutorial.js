//@ts-check

class GUITutorial extends GUIObject {

    constructor(depth){
        super("Tutorial", 0, 0, depth);

        this.show = false;
        this.behaviorState = "Start";

        this.activeTutorial = null;
    }

    update(){
        this.updateStateMachine();

        push();

        //skip tutorial text
        let textColor = color(255,255,255);
        noStroke();
        textSize(20);
        fill(textColor);
        text("Press Q to skip the tutorial at any time", 10, height-15);

        textSize(10);
        fill(255, 255, 255, 80);
        let creditX = width-220;
        let creditY = height;
        text("CREDITS", creditX, creditY-91);
        text("Fonts: G-Type by Gomarice Font", creditX, creditY-78);
        text("Sound Effects, Art: Kenney Game Assets", creditX, creditY-65);
        text("Music: YouTube Copyright-Free Music Library", creditX, creditY-52);
        text("  Above Planets - Patrick Patrikios", creditX, creditY-39);
        text("  Cages - Density & Time", creditX, creditY-26);
        text("  Lost Constructs - White Hex", creditX, creditY-13);

        pop();

        //if the player decides to skip the tutorial...
        if(!anythingPressedLastFrame && keyIsDown(81)){//Q
            this.behaviorState = "Finished";
            this.activeTutorial.slatedForDeletion = true;
            this.slatedForDeletion = true;
            World.instance.player.hitpoints = 100;
            World.instance.player.shield.hitpoints = 100;
        } 
    }

    updateStateMachine(){

        if(this.behaviorState=="Start"){
            this.activeTutorial = new MovementTutorial(5);
            GUI.instance.addGuiObject(this.activeTutorial);
            this.behaviorState="Welcome";
        }
        if(this.behaviorState=="Welcome"){
            if(this.activeTutorial.finished){
                this.activeTutorial.slatedForDeletion=true;
                this.behaviorState="BeginEnemyTutorial";
            }
        }
        if(this.behaviorState=="BeginEnemyTutorial"){
            this.activeTutorial = new EnemyTutorial(5);
            GUI.instance.addGuiObject(this.activeTutorial);
            this.behaviorState="EnemyTutorial";
        }

        if(this.behaviorState=="EnemyTutorial"){
            if(this.activeTutorial.finished){
                this.activeTutorial.slatedForDeletion=true;

                this.behaviorState="BeginHomingEnemyTutorial";
            }
        }

        if(this.behaviorState=="BeginHomingEnemyTutorial"){
            this.activeTutorial = new HomingEnemyTutorial(5);
            GUI.instance.addGuiObject(this.activeTutorial);
            this.behaviorState="HomingEnemyTutorial";
        }

        if(this.behaviorState=="HomingEnemyTutorial"){

            if(this.activeTutorial.finished){
                this.activeTutorial.slatedForDeletion=true;
                this.behaviorState="BeginShootingEnemyTutorial";
            }
        }

        if(this.behaviorState=="BeginShootingEnemyTutorial"){
            this.activeTutorial = new ShootingEnemyTutorial(5);
            GUI.instance.addGuiObject(this.activeTutorial);
            this.behaviorState="ShootingEnemyTutorial";
        }

        if(this.behaviorState=="ShootingEnemyTutorial"){

            if(this.activeTutorial.finished){
                this.activeTutorial.slatedForDeletion=true;
                this.behaviorState="BeginBlockingTutorial";
            }
        }

        if(this.behaviorState=="BeginBlockingTutorial"){
            this.activeTutorial = new BlockingTutorial(5);
            GUI.instance.addGuiObject(this.activeTutorial);
            this.behaviorState="BlockingTutorial";
        }

        if(this.behaviorState=="BlockingTutorial"){

            if(this.activeTutorial.finished){
                this.activeTutorial.slatedForDeletion=true;
                this.behaviorState="BeginLaserEnemyTutorial";
            }
        }

        if(this.behaviorState=="BeginLaserEnemyTutorial"){
            this.activeTutorial = new LaserEnemyTutorial(5);
            GUI.instance.addGuiObject(this.activeTutorial);
            this.behaviorState="LaserEnemyTutorial";
        }

        if(this.behaviorState=="LaserEnemyTutorial"){

            if(this.activeTutorial.finished){
                this.activeTutorial.slatedForDeletion=true;
                this.behaviorState="BeginEndingTutorial";
            }
        }

        if(this.behaviorState=="BeginEndingTutorial"){
            this.activeTutorial = new EndingTutorial(5);
            GUI.instance.addGuiObject(this.activeTutorial);
            this.behaviorState="EndingTutorial";
        }

        if(this.behaviorState=="EndingTutorial"){

            if(this.activeTutorial.finished){
                this.activeTutorial.slatedForDeletion=true;
                this.behaviorState="Finished";
            }
        }

        if(this.behaviorState=="Finished"){
            this.debugLog("Finished the tutorial");
            this.activeTutorial.slatedForDeletion = true;
            this.slatedForDeletion = true;
        }
    }

}

const fadeTime = 1000;
class TutorialComponent extends GUIObject {

    constructor(type, x, y, depth){
        super(type, x, y, depth);
        this.finished=false;
        this.behaviorState="Initial";
    }
}

function getFadeAlphaMult(timer, originalValue){

    if(timer<fadeTime){
        return timer/fadeTime;
    } else if(originalValue-timer<fadeTime){
        return (originalValue-timer)/fadeTime;
    } else {
        return 1;
    }

}

class MovementTutorial extends TutorialComponent {
    constructor(depth){
        super("MovementTutorial",0,0,depth);

        this.welcomeTimer = 6000;
        this.welcomeCounter = this.welcomeTimer;

        this.movementTimer = 15000;
        this.movementCounter = this.movementTimer;
    }

    //technically a violation, but also updates the state machine
    display(){

        if(Sketch.paused)return;

        push();

        noStroke();
        textAlign(CENTER);
        let fillColor = color(255,255,255);

        if(this.behaviorState=="Initial"){

            World.instance.player.supressShooting = true;

            fillColor.setAlpha(255*getFadeAlphaMult(this.welcomeCounter, this.welcomeTimer));
            fill(fillColor);

            text("Welcome to the game, a short tutorial will follow", width/2, height-100);
            text(`${(this.welcomeCounter/1000).toFixed(0)}`, width/2, height-50);

            this.welcomeCounter-=deltaTime;
            if(this.welcomeCounter<=0){
                this.behaviorState="Movement";
            }
        }

        if(this.behaviorState=="Movement"){

            fillColor.setAlpha(255*getFadeAlphaMult(this.movementCounter, this.movementTimer));
            fill(fillColor);

            text("The hand you see is your character.", width/2, height-130);
            text("Try moving it around and getting a feel for the boundaries.", width/2, height-100);
            text("(The game will pause if your hand goes out of bounds)", width/2, height-70);
            text(`${(this.movementCounter/1000).toFixed(0)}`, width/2, height-50);

            this.movementCounter-=deltaTime;
            if(this.movementCounter<=0){
                this.finished=true;
            }
        }
        pop();
    }

}

class EnemyTutorial extends TutorialComponent {
    constructor(depth){
        super("EnemyTutorial",0,0,depth);

        this.enemy = new Enemy(width+100, height/2);
        this.enemy.movement.velocity.x = -50
        this.enemyAdded = false;

        this.waitTimeAfterEnemySpawn = 4000;
        this.waitTimeAfterEnemySpawnCounter = this.waitTimeAfterEnemySpawn;

        this.congratsTimer = 5000;
        this.congratsCounter = this.congratsTimer;

    }

    //technically a violation, but also updates the state machine
    display(){

        push();

        noStroke();
        textAlign(CENTER);
        let fillColor = color(255,255,255);
        if(this.behaviorState=="Initial"){

            //text("Welcome to the game, a short tutorial will follow", width/2, height-100);
            if(!(this.enemyAdded)){
                World.instance.addGameObject(this.enemy);
                this.enemyAdded=true;
            }

            this.waitTimeAfterEnemySpawnCounter-=deltaTime;
            if(this.waitTimeAfterEnemySpawnCounter<=0){
                this.behaviorState="Instructions";
            }
        }

        if(this.behaviorState=="Instructions"){

            World.instance.player.supressShooting = false;

            //fillColor.setAlpha(255*getFadeAlphaMult(this.pauseCounter, this.pauseTimer));
            fillColor.setAlpha(255);
            fill(fillColor);

            text("What you see coming in from the right is an enemy.", width/2, height-130);
            text("Do a fingergun gesture, aim, and destroy it!.", width/2, height-100);
            //text(`Unpause in: ${(this.pauseCounter/1000).toFixed(0)}`, width/2, height-50);

            if(this.enemy.slatedForDeletion==true || this.enemy==null){
                this.behaviorState="Congrats";
            }
        }

        if(this.behaviorState=="Congrats"){
            World.instance.player.supressShooting = true;

            fillColor.setAlpha(255*getFadeAlphaMult(this.congratsCounter, this.congratsTimer));
            fill(fillColor);

            text("Good Job!", width/2, height-130);
            
            text(`${(this.congratsCounter/1000).toFixed(0)}`, width/2, height-50);

            this.congratsCounter-=deltaTime;
            if(this.congratsCounter<=0){
                this.behaviorState="Finished";
            }
        }

        if(this.behaviorState=="Finished"){
            this.finished=true;
        }

        pop();
    }

}

class HomingEnemyTutorial extends TutorialComponent {
    constructor(depth){
        super("HomingEnemyTutorial",0,0,depth);

        this.enemy = new HomingEnemy(width+100, height/2);
        this.enemyAdded = false;
        this.enemy.hitpoints = 150;
        
        this.waitTimeAfterEnemySpawn = 100;
        this.waitTimeAfterEnemySpawnCounter = this.waitTimeAfterEnemySpawn;

        this.congratsTimer = 4000;
        this.congratsCounter = this.congratsTimer;

    }

    //technically a violation, but also updates the state machine
    display(){

        push();

        noStroke();
        textAlign(CENTER);
        let fillColor = color(255,255,255);
        if(this.behaviorState=="Initial"){

            //text("Welcome to the game, a short tutorial will follow", width/2, height-100);
            if(!(this.enemyAdded)){
                World.instance.addGameObject(this.enemy);
                this.enemyAdded=true;
            }

            this.waitTimeAfterEnemySpawnCounter-=deltaTime;
            if(this.waitTimeAfterEnemySpawnCounter<=0){
                this.behaviorState="Instructions";
            }
        }

        if(this.behaviorState=="Instructions"){
            World.instance.player.supressShooting = false;

            //fillColor.setAlpha(255*getFadeAlphaMult(this.pauseCounter, this.pauseTimer));
            fillColor.setAlpha(255);
            fill(fillColor);

            text("This one tracks you. DODGE THEM!", width/2, height-130);
            text("(Or shoot them if your aim is good).", width/2, height-100);
            //text(`Unpause in: ${(this.pauseCounter/1000).toFixed(0)}`, width/2, height-50);

            if(this.enemy.slatedForDeletion==true || this.enemy==null){
                this.behaviorState="Congrats";
            }
        }

        if(this.behaviorState=="Congrats"){
            World.instance.player.supressShooting = true;

            fillColor.setAlpha(255*getFadeAlphaMult(this.congratsCounter, this.congratsTimer));
            fill(fillColor);

            text("Good Job!", width/2, height-130);
            
            text(`${(this.congratsCounter/1000).toFixed(0)}`, width/2, height-50);

            this.congratsCounter-=deltaTime;
            if(this.congratsCounter<=0){
                this.behaviorState="Finished";
            }
        }

        if(this.behaviorState=="Finished"){
            this.finished=true;
        }

        pop();
    }

}

class ShootingEnemyTutorial extends TutorialComponent {
    constructor(depth){
        super("ShootingEnemyTutorial",0,0,depth);

        this.enemy = new ShootingEnemy(width+100, height/2);
        this.enemy.hitpoints = 200;
        this.enemyAdded = false;

        this.waitTimeAfterEnemySpawn = 100;
        this.waitTimeAfterEnemySpawnCounter = this.waitTimeAfterEnemySpawn;

        this.congratsTimer = 4000;
        this.congratsCounter = this.congratsTimer;

    }

    //technically a violation, but also updates the state machine
    display(){

        push();

        noStroke();
        textAlign(CENTER);
        let fillColor = color(255,255,255);
        if(this.behaviorState=="Initial"){

            //text("Welcome to the game, a short tutorial will follow", width/2, height-100);
            if(!(this.enemyAdded)){
                World.instance.addGameObject(this.enemy);
                this.enemyAdded=true;
            }

            this.waitTimeAfterEnemySpawnCounter-=deltaTime;
            if(this.waitTimeAfterEnemySpawnCounter<=0){
                this.behaviorState="Instructions";
            }
        }

        if(this.behaviorState=="Instructions"){

            World.instance.player.supressShooting = false;

            //fillColor.setAlpha(255*getFadeAlphaMult(this.pauseCounter, this.pauseTimer));
            fillColor.setAlpha(255);
            fill(fillColor);

            text("This next one shoots at you.", width/2, height-130);
            text("Dodge and take aim simultaneously!", width/2, height-100);
            //text(`Unpause in: ${(this.pauseCounter/1000).toFixed(0)}`, width/2, height-50);

            if(this.enemy.slatedForDeletion==true || this.enemy==null){
                this.behaviorState="Congrats";
            }
        }

        if(this.behaviorState=="Congrats"){

            World.instance.player.supressShooting = true;

            fillColor.setAlpha(255*getFadeAlphaMult(this.congratsCounter, this.congratsTimer));
            fill(fillColor);

            text("Good Job!", width/2, height-130);
            
            text(`${(this.congratsCounter/1000).toFixed(0)}`, width/2, height-50);

            this.congratsCounter-=deltaTime;
            if(this.congratsCounter<=0){
                this.behaviorState="Finished";
            }
        }

        if(this.behaviorState=="Finished"){
            this.finished=true;
        }

        pop();
    }

}

class BlockingTutorial extends TutorialComponent {
    constructor(depth){
        super("BlockingTutorial",0,0,depth);

        this.enemy = new ShootingEnemy(width+100, height/2);
        this.enemyAdded = false;

        this.waitTimeAfterEnemySpawn = 100;
        this.waitTimeAfterEnemySpawnCounter = this.waitTimeAfterEnemySpawn;

        this.congratsTimer = 9000;
        this.congratsCounter = this.congratsTimer;

    }

    //technically a violation, but also updates the state machine
    display(){

        push();

        noStroke();
        textAlign(CENTER);
        let fillColor = color(255,255,255);
        if(this.behaviorState=="Initial"){

            World.instance.player.supressShooting = true;

            //text("Welcome to the game, a short tutorial will follow", width/2, height-100);
            if(!(this.enemyAdded)){
                World.instance.addGameObject(this.enemy);
                this.enemyAdded=true;
            }

            this.waitTimeAfterEnemySpawnCounter-=deltaTime;
            if(this.waitTimeAfterEnemySpawnCounter<=0){
                this.behaviorState="Instructions";
            }
        }

        if(this.behaviorState=="Instructions"){

            //fillColor.setAlpha(255*getFadeAlphaMult(this.pauseCounter, this.pauseTimer));
            fillColor.setAlpha(255);
            fill(fillColor);

            text("Ball your hand into a fist to block with your shields.", width/2, height-130);
            text("Here comes another, try blocking and ramming them this time!", width/2, height-100);
            //text(`Unpause in: ${(this.pauseCounter/1000).toFixed(0)}`, width/2, height-50);

            if(this.enemy.slatedForDeletion==true || this.enemy==null){
                this.behaviorState="Congrats";
            }
        }

        if(this.behaviorState=="Congrats"){

            fillColor.setAlpha(255*getFadeAlphaMult(this.congratsCounter, this.congratsTimer));
            fill(fillColor);

            text("Notice that your shield must recharge, and increases your hitbox.", width/2, height-130);
            text("You cannot simultaneously block and shoot.", width/2, height-100);
            text("Maybe dodging is better in certain cases?", width/2, height-70);
            
            text(`${(this.congratsCounter/1000).toFixed(0)}`, width/2, height-50);

            this.congratsCounter-=deltaTime;
            if(this.congratsCounter<=0){
                this.behaviorState="Finished";
            }
        }

        if(this.behaviorState=="Finished"){
            this.finished=true;
        }

        pop();
    }

}

class LaserEnemyTutorial extends TutorialComponent {
    constructor(depth){
        super("LaserEnemyTutorial",0,0,depth);

        this.enemy = new LaserEnemy(width+100, height/2);
        this.enemy.hitpoints = 200;
        this.enemyAdded = false;

        this.waitTimeAfterEnemySpawn = 100;
        this.waitTimeAfterEnemySpawnCounter = this.waitTimeAfterEnemySpawn;

        this.congratsTimer = 10000;
        this.congratsCounter = this.congratsTimer;

    }

    //technically a violation, but also updates the state machine
    display(){

        push();

        noStroke();
        textAlign(CENTER);
        let fillColor = color(255,255,255);
        if(this.behaviorState=="Initial"){

            //text("Welcome to the game, a short tutorial will follow", width/2, height-100);
            if(!(this.enemyAdded)){
                World.instance.addGameObject(this.enemy);
                this.enemyAdded=true;
            }

            this.waitTimeAfterEnemySpawnCounter-=deltaTime;
            if(this.waitTimeAfterEnemySpawnCounter<=0){
                this.behaviorState="Instructions";
            }
        }

        if(this.behaviorState=="Instructions"){

            //fillColor.setAlpha(255*getFadeAlphaMult(this.pauseCounter, this.pauseTimer));
            fillColor.setAlpha(255);
            fill(fillColor);

            text("You can't dodge this next enemy's shots.", width/2, height-130);
            text("You must block their shot! (ball your hand into a fist)", width/2, height-100);
            //text(`Unpause in: ${(this.pauseCounter/1000).toFixed(0)}`, width/2, height-50);

            if(this.enemy.slatedForDeletion==true || this.enemy==null){
                this.behaviorState="Congrats";
            }
        }

        if(this.behaviorState=="Congrats"){

            World.instance.player.supressShooting = false;

            fillColor.setAlpha(255*getFadeAlphaMult(this.congratsCounter, this.congratsTimer));
            fill(fillColor);

            text("Even if you don't destroy an enemy, they will leave after a while.", width/2, height-130);
            text("Destroying enemies also restores your HP.", width/2, height-100);
            text("Destroy as many possible to earn the most points!", width/2, height-70);
            
            text(`${(this.congratsCounter/1000).toFixed(0)}`, width/2, height-50);

            this.congratsCounter-=deltaTime;
            if(this.congratsCounter<=0){
                this.behaviorState="Finished";
            }
        }

        if(this.behaviorState=="Finished"){
            this.finished=true;
        }

        pop();
    }

}

class EndingTutorial extends TutorialComponent {
    constructor(depth){
        super("EndingTutorial",0,0,depth);

        this.congratsTimer = 8000;
        this.congratsCounter = this.congratsTimer;

    }

    //technically a violation, but also updates the state machine
    display(){

        push();

        noStroke();
        textAlign(CENTER);
        let fillColor = color(255,255,255);
        if(this.behaviorState=="Initial"){
            World.instance.player.supressShooting = false;

            this.behaviorState="Congrats";
        }

        if(this.behaviorState=="Congrats"){

            fillColor.setAlpha(255*getFadeAlphaMult(this.congratsCounter, this.congratsTimer));
            fill(fillColor);

            text("All in all, how to play the game:", width/2, height-130);
            text("Dodge, shoot, and block;", width/2, height-100);
            text("Destroy enemies, survive, and get a high score!", width/2, height-70);
            
            text(`${(this.congratsCounter/1000).toFixed(0)}`, width/2, height-50);

            this.congratsCounter-=deltaTime;
            if(this.congratsCounter<=0){
                this.behaviorState="Finished";
            }
        }

        if(this.behaviorState=="Finished"){
            this.finished=true;
        }

        pop();
    }

}



