//@ts-check

class Spawner extends GameObject {

    constructor(){
        super("Spawner", 0, 0, 0);

        this.spawnIntervalMin = 1300;//0 score
        this.spawnIntervalMax = 4000;//max score and beyond

        this.scoreForMax = 500;//how much player score needed to hit spawnIntervalMin

        this.spawnInterval = this.spawnIntervalMax;
        this.spawnCounter = 0;

        this.spawnX = width+100;//spawn enemies slightly off screen
    }

    update(){

        if(state!="Playing")return;

        //lerp spawn interval between 0 score to max difficulty score
        this.spawnInterval = map((1-scoreCounter.score/this.scoreForMax), 0, 1, this.spawnIntervalMin, this.spawnIntervalMax, true);

        if(this.spawnCounter>0){
            this.spawnCounter-=deltaTime;
        }
        if(this.spawnCounter<=0){
            this.spawnEnemy();
            this.spawnCounter+=this.spawnInterval
        }
    }

    spawnEnemy(){

        let i = floor(random(0, 5));

        let randomY = random(100, height-100);

        let toAdd;
        switch(i){
            case 0:
                toAdd = new Enemy(this.spawnX, randomY);
                break;
            case 1:
                toAdd = new HomingEnemy(this.spawnX, randomY);
                break;
            case 2:
                toAdd = new ShootingEnemy(this.spawnX, randomY);
                break;
            case 3:
                toAdd = new LaserEnemy(this.spawnX, randomY);
                break;
            case 4:
                toAdd = new AnnoyingEnemy(this.spawnX, randomY);
                break;
        }

        World.instance.addGameObject(toAdd);
        
        
        /* //DEBUG spawn every enemy type regardless
        let standardEnemy = new Enemy(this.spawnX, height/2);
        World.instance.addGameObject(standardEnemy);

        let homingEnemy = new HomingEnemy(this.spawnX, height/2);
        World.instance.addGameObject(homingEnemy);

        let shootingEnemy = new ShootingEnemy(this.spawnX, height/3);
        World.instance.addGameObject(shootingEnemy);

        let laserEnemy = new LaserEnemy(this.spawnX, height/4);
        World.instance.addGameObject(laserEnemy);

        let annoyingEnemy = new AnnoyingEnemy(this.spawnX, height/2+height/4);
        World.instance.addGameObject(annoyingEnemy);
        */
        
    }


}