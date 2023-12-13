//@ts-check
class TestGameObject extends GameObject {

    constructor(x, y){
        super(x, y);
        this.expireTimer = 3000;
    }

    update(){
        this.expireTimer -= deltaTime;
        //this.debugLog(this.expireTimer);
        this.debugDraw("hello world");
        if(this.expireTimer<=0) this.destroy();
    }

    display(){
        circle(this.movement.position.x, this.movement.position.y, 10);
    }

    collide(other){
        //this.debugLog("I COLLIDED WITH SOMEBODY");
    }

    destroy(){
        super.destroy();
        this.debugLog("I am dead!");
    }

}