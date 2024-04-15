//@ts-check

const hpBarLength = 200;
const hpBarHeight = 25;

/**
 * The healthbar you see in the top left corner during gameplay
 */
class GUIHealthBar extends GUIObject {
    constructor(type, x, y, depth){
        super(type, x, y, depth);

        this.show = true;
    }

    display(){
        if(state!="Tutorial"&&state!="Playing")return;
        if(!this.show)return;

        push();
        let hitpoints = World.instance.player.hitpoints;
        let maxHitpoints = World.instance.player.maxHitpoints;

        noStroke();

        //how much to shift the lower edge relative to the upper one; creates an "angle" effect
        const bottomOffset = -15; 

        //the grey HP bar backing
        fill(color(103, 103, 103));
        beginShape();
        vertex(this.x, this.y);
        vertex(this.x+hpBarLength, this.y)
        vertex(this.x+hpBarLength+bottomOffset, this.y+hpBarHeight);
        vertex(this.x+bottomOffset, this.y+hpBarHeight);
        endShape(CLOSE);
        
        //draw the actual HP bar over the backing
        fill(color(219, 87, 144));
        let length = hpBarLength*(hitpoints/maxHitpoints)
        beginShape();
        vertex(this.x, this.y);
        vertex(this.x+length, this.y)
        vertex(this.x+length+bottomOffset, this.y+hpBarHeight);
        vertex(this.x+bottomOffset, this.y+hpBarHeight);
        endShape(CLOSE);
        
        fill(color(255, 255, 255));
        textFont(font_gType);
        text(`HP: ${hitpoints}`, this.x, this.y+hpBarHeight-4);
        pop();
    }
}

/**
 * Keeps track of how long gameplay has been going
 */
class GUISurvivalTimer extends GUIObject {
    constructor(x, y, depth){
        super("SurvivalTimer", x,y, depth);
        this.survivalTime = 0;

        this.show = true;   
    }

    update(){
        if(state!="Playing" || Sketch.paused)return;  
            this.survivalTime+=deltaTime;
    }

    display(){
        if(state!="Tutorial"&&state!="Playing")return;
        if(!this.show)return;
        push();

        noStroke();
        fill(color(255,255,255));
        textFont(font_gType);

        textAlign(RIGHT);

        text(`${(this.survivalTime/1000).toFixed(1)}s`, this.x, this.y);

        pop();
    }
}

/**
 * Score is added to this and displayed on the top right
 */
class GUIScoreCounter extends GUIObject {
    constructor(x, y, depth){
        super("ScoreCounter", x,y, depth);
        this.score = 0;

        this.show = true;

        this.scoreAlphaMax = 255;
        this.scoreAlphaMin = 180;
    }

    display(){

        if(state!="Tutorial"&&state!="Playing")return;
        if(!this.show)return;
        push();

        if(scoreCounter.score > highScore){
            highScore = scoreCounter.score;
        }

        let alpha = 255;
        if(this.score==highScore){
            alpha = lerp(this.scoreAlphaMin, this.scoreAlphaMax, sin(millis()/400));
        }

        noStroke();
        fill(color(255,255,255, alpha));
        textFont(font_gType);

        textAlign(RIGHT)

        text(`${this.score}`, this.x, this.y);

        textSize(15);
        text(`HI: ${highScore}`, this.x, this.y+20);

        pop();
    }
}

class GUIGameOverScreen extends GUIObject {

    constructor(depth){
        super("GameOverScreen", 0,0, depth);
        this.show = false;
    }

    display(){

        if(!this.show) return;

        push();

        //transparent overlay
        fill(color(0, 0, 0, 128));
        rect(0, 0, width, height);

        fill(color(255,255,255));//text color

        textAlign(CENTER);
        textFont(font_gType);

        textSize(50);
        text("GAME OVER", width/2, height/2);

        textSize(40);
        text("Your final score: " + scoreCounter.score.toFixed(0), width/2, height/2+60);
        text("Highest score: " + highScore, width/2, height/2+110);
        
        textSize(40);
        text(`You survived ${(survivalTimer.survivalTime/1000).toFixed(2)} seconds`, width/2, height/2+160);

        textSize(40);
        text(`Press any key to restart`, width/2, height-30);

        pop();
    }
    
}