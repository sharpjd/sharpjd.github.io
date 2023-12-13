//@ts-check

/**
 * Shows the Gestures class video
 */
class VideoFeed extends GUIObject {

    constructor(x, y, depth){

        super("VideoFeed", x, y);
        this.show = false;

    }

    display(){
        
        if(this.show){
            showVideoCheckbox.show();
            push();
            textAlign(LEFT);
            fill(255,255,255);
            textSize(15);
            text("Show Video", 30, 85);
            pop();
        } else {
            showVideoCheckbox.hide();
        }

        //this.debugLog("displaying video");
        if(showVideoCheckbox.checked())
            if(Gestures.video!=null)
                image(Gestures.video, 0, 0, 640, 480);
    }

}