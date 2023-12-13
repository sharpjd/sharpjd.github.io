//@ts-check

/**
 * Slowly scroling grid line as the background of the playing field
 */
class BG extends GameObject {
 
    constructor(depth){
        super("Background",0,0,depth);

        this.scrollSpeed = -20; //in seconds
        this.scroll = 0;
        this.gridBlockSideLength = 40; //prefer factors of height
    }

    update(){
        this.scroll+=this.scrollSpeed*deltaTime/1000;
    }

    display(){

        push();
        noFill();
        let lineColor = color(49, 10, 39)
        stroke(lineColor);
        strokeWeight(2);
        
        //vertical lines
        let xStart = (this.scroll%this.gridBlockSideLength);
        for(let i = xStart; i < width; i+=this.gridBlockSideLength){
            line(i, 0, i, height);
        }

        //horizontal lines
        for(let i = 0; i < height; i+=this.gridBlockSideLength){
            line(0, i, width, i);
        }

        pop();
    }
    
}