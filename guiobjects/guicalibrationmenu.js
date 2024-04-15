//@ts-check

class CalibrationMenu extends GUIObject {

    constructor(x, y, depth){
        super("CalibrationMenu", x, y, depth);
        this.show=false;
        this.displayText = "Calibration";

        this.state = "Calibrating";
    }

    update(){

        if(!anythingPressedLastFrame && keyIsDown(32)){//space key
            Sketch.calibrationPoint = World.instance.player.position.copy();
            this.state = "Done";
        }

    }

    display(){
        if(!this.show) return;
        push();
        
        //display the text (can be changed)
        fill(color(255, 255, 255));
        textAlign(CENTER);
        textSize(50)
        text(this.displayText, width/2, 50);

        textSize(20)

        text("Place your LEFT hand some distance away from the webcam until a handpose is detected and drawn.", width/2, height-130);
        text("(Check \"Show Video\" to show your webcam feed if you need help locating your hand)", width/2, height-100);
        
        //text("Then find a comfortable position and center your LEFT hand in", width/2, height-100);
        //text("the rectangular area marked by the line.", width/2, height-80);

        text("Press Spacebar to finish calibration", width/2, height-40);
        text("(Tip: try not to overlap your hand with your face)", width/2, height-20);
        pop();
    }

}