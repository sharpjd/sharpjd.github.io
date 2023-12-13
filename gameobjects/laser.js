//@ts-check

/**
 * Instantiated by LaserEnemy
 */
class Laser extends GameObject {

    /**
     * 
     * @param {GameObject} parent 
     * @param {GameObject} target 
     * @param {number} windup amount of time from instantiation to actually dealing damage
     * @param {number} criticalWindupThreshold time threshold where flashing animation plays
     */
    constructor(parent, target, windup, criticalWindupThreshold){
        super("Laser", 0,0,0);

        this.parent = parent;
        this.target = target;

        this.windup = windup;
        this.criticalWindupThreshold = criticalWindupThreshold;

        this.windupCounter = this.windup;
        
        this.damageAmount = 30;

        this.alreadyDealtDamage = false; 

        this.maxBeamStrokeWidth = 8;
        this.beamColor = color(73, 230, 244);

        this.maxFiredBeamStrokeWidth = 16;
        this.endAnimationTime = 350;
        this.endAnimationCounter = this.endAnimationTime;

        this.beamState="Windup";
    }

    update(){

        if(this.parent==null || this.parent.slatedForDeletion==true){
            this.slatedForDeletion=true;
            return;
        }


        if(this.beamState=="Windup"){
            if(this.windupCounter>0){
                this.windupCounter-=deltaTime;
            }
            
            //deal the damage if the counter is done
            if(this.windupCounter<=0){    
                if(!this.alreadyDealtDamage){
                    this.target.damage(this.damageAmount);
                    this.alreadyDealtDamage = true;
                    this.beamState="Ending";
                    sfx_highLaser.play(undefined,undefined,undefined,undefined,3);
                }
            }
        }

        //after the beam has fired and dealt damage
        if(this.beamState=="Ending"){
            if(this.endAnimationCounter>0){
                this.endAnimationCounter-=deltaTime;
            }
            if(this.endAnimationCounter<=0){    
                this.slatedForDeletion=true;
            }
        }
        
    }

    display(){

        push();

        let strokeWidth = this.maxBeamStrokeWidth*(this.windupCounter/this.windup);

        strokeWeight(strokeWidth);
        stroke(this.beamColor);

        if(this.beamState=="Windup"){
            if(this.windupCounter < this.criticalWindupThreshold){
                //the oscillating "critical animation"
                //desmos equation: \sin\left(100x^{3}\right)+1
                let animationPercentage = 1-(this.windupCounter/this.criticalWindupThreshold);
                let x_ = animationPercentage;
                let y_ = sin(100*pow(x_, 5))+1;
                
                let alpha = y_*255;
    
                this.beamColor.setAlpha(alpha);
                stroke(this.beamColor);
                line(this.parent.x, this.parent.y, this.target.x, this.target.y);
    
            } else {
                //regular animation
                stroke(this.beamColor);
                line(this.parent.x, this.parent.y, this.target.x, this.target.y);
            }
        }

        //laser shot delivered animation for impact
        if(this.beamState=="Ending"){
            this.beamColor.setAlpha(255);
            strokeWidth = this.maxFiredBeamStrokeWidth*(this.endAnimationCounter/this.endAnimationTime);
            strokeWeight(strokeWidth);
            stroke(this.beamColor);
            line(this.parent.x, this.parent.y, this.target.x, this.target.y);
        }
        
        pop();

    }

}