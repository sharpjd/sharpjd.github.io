//@ts-check

/**
 * Creates a "glow" effect and draws a line in the middle when the player hand is close to out-of-bounds
 */
class GUIBoundaryWarning extends GUIObject {

    constructor(depth){
        super("BoundaryWarning", 0, 0, depth);

        this.maxGradientRadius = 500;
        this.warningTriggerDist = 250;

        this.show = false;
    }

    display(){

        if(!this.show)return;

        push();

        let playerPos= World.instance.player.position;

        let rightEdge = 420;

        //player distances from boundaries
        let distanceFromLeftEdge = playerPos.x;
        let distanceFromTopEdge = playerPos.y;
        let distanceFromBottomEdge = height - playerPos.y;
        let distanceFromRightEdge = rightEdge - playerPos.x;

        //for the gradient; not precisely sure what it does, but changes the fade rate
        let fade = 1;

        //top edge warning
        if(distanceFromTopEdge < this.warningTriggerDist){
            let radius = this.maxGradientRadius*(1-distanceFromTopEdge/this.warningTriggerDist);
            this.drawGradient(playerPos.x, 0-50, radius, fade);
        }

        //left edge warning
        if(distanceFromLeftEdge < this.warningTriggerDist){
            let radius = this.maxGradientRadius*(1-distanceFromLeftEdge/this.warningTriggerDist);
            this.drawGradient(0-50, playerPos.y, radius, fade);
        }

        //bottom edge warning
        if(distanceFromBottomEdge < this.warningTriggerDist){
            let radius = this.maxGradientRadius*(1-distanceFromBottomEdge/this.warningTriggerDist);
            this.drawGradient(playerPos.x, height+50, radius, fade);
        }

        //right edge warning (in middle of play field)
        if(distanceFromRightEdge < this.warningTriggerDist){
            let alpha = 255*(1-distanceFromRightEdge/this.warningTriggerDist);
            let lineColor = color(186, 31, 124);
            lineColor.setAlpha(alpha);
            stroke(lineColor);
            strokeWeight(2);
            line(rightEdge, 0, rightEdge, height);
        }

        pop();
    }

    /**
     * Draws a circular gradient 
     * @param {number} x 
     * @param {number} y 
     * @param {number} radius radius of the gradient
     * @param {number} fade controls how fast the gradient fades from the center
     */
    drawGradient(x, y, radius, fade){
        push();
        colorMode(HSL);
        noStroke();
        
        for (let r = radius; r > 0; --r) {
            let c = color(334, 100, 66);;
            c.setAlpha(pow((1-(r/radius)), fade)*0.005);
            fill(c);
            ellipse(x, y, r, r);
        }
        pop();
    }


}