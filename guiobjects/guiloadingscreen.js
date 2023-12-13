//@ts-check

class GUILoadingScreen extends GUIObject {

    constructor(type, x, y, depth){
        super(type, x, y, depth);
        this.displayText = "training gesture recognition, please wait...";
        this.show=false;
    }

    display(){
        if(!this.show) return;
        push();
        background(220);
        fill(color(189, 135, 34));
        rect(0,0, width, height);//menu bg

        //display the text; can be changed
        textAlign(CENTER);
        fill(color(255, 255, 255));
        text(this.displayText, width/2, height/2);

        text("This game is played almost exclusively with your hand", width/2, height-100);
        text("Further instructions will be given in-game", width/2, height-50);
        pop();

    }

}