//@ts-check

class PauseOverlay extends GUIObject {

    constructor(x, y, depth){
        super("PauseOverlay", x, y, depth);
        this.show=false;
    }

    display(){
        if(!this.show) return;

        push();
        //transparent overlay
        fill(color(0, 0, 0, 128));
        rect(0, 0, width, height);

        fill(color(255,255,255));//text color
        textAlign(CENTER);
        textSize(50);
        text("Can't detect your hand", width/2, height/2);

        textSize(20);
        text("Move your hand back into frame and ensure lighting is proper.", width/2, height/2+50);
        textSize(17)
        text("(Tip: detection is also better when your head is out of frame)", width/2, height/2+70);

        pop();
    }

}