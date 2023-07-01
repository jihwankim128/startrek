var Spawn = function(game) {
    this.canvas = game.canvas;
    this.img = game.gameImg;
    this.enemies = game.enemies;
    this.enemyHp = game.enemyHp;
    this.ship = game.ship;
    this.asteroid = game.asteroid;
    this.boss=game.boss;
    this.item = game.item;
    this.game = game;

    //적군 생성시간
    this.enemiesDelay = 5000;
    this.enemiesSpawn = 0;
    this.asteroidDelay= 3000;
    this.asteroidSpawn=0;
    this.itemDelay = 0;

    //생성 속도 단축
    this.fastDelay = 0;
};

//spawn 범위를 초과하면 삭제, 적군, 아이템 등 생성을 request
Spawn.prototype.play = function(delay) {
    this.createNewEnemy(delay);
    this.createAsteroid(delay);
    this.createItem(delay);
    for(let i=0; i<this.enemies.length; i++)this.enemies[i].play(delay);
    for(let i=0; i<this.asteroid.length; i++) this.asteroid[i].play(delay);
    for(let i=0; i<this.enemies.length; i++) 
        if(this.outOf(this.enemies[i])){
            this.enemies.splice(i,1);
            this.enemyHp.splice(i,1);
            i--;
        }
    for(let i=0; i<this.asteroid.length; i++) 
        if(this.asteroid[i].status||this.outOf(this.asteroid[i])){
            this.asteroid.splice(i,1);
            i--;
        }
};
//일정 시간이 지나면 랜덤위치에 item 생성
Spawn.prototype.createItem = function(delay){
    let x = Math.floor(Math.random() *(this.canvas.width -100));
    let y = Math.floor(Math.random() *300)+300;
    let type = Math.floor(Math.random()*2)==0?"item1" : "item0";
    this.itemDelay += delay;
    if(this.itemDelay>30000) {
        this.item.push(new Item(x,y,type,this.img));
        this.itemDelay=0;
    }
}
//적군 생성함수
Spawn.prototype.createNewEnemy = function(delay) {
    if(!this.game.bossSpawn){
        var enemy = Math.floor(Math.random() * 4);
        let x = Math.floor(Math.random() *(this.canvas.width - 100));
        let y = Math.floor(Math.random() * 11)-60;
        this.enemiesSpawn += delay;
        if(this.enemiesSpawn>this.enemiesDelay) {
            this.enemies.push(new Enemy(x, y, this.color(enemy), this.img, this.ship));
            this.enemiesSpawn = 0;
        }
        this.fastSpawnDelay(delay);
    }
};
//운석 생성
Spawn.prototype.createAsteroid = function(delay){
    if(!this.game.bossSpawn){
        var size = Math.floor(Math.random() * 3);
        let x = Math.floor(Math.random() *(this.canvas.width -100));
        let y = Math.floor(Math.random() * 11)-60;
        this.asteroidSpawn += delay;
        if(this.asteroidSpawn>this.asteroidDelay){
            this.asteroid.push(new Asteroid(x,y,this.type(size),this.img, this.ship));
            this.asteroidSpawn=0;
        }
    }
}
//약 18초가 경과하면 적 생산속도 빨라짐
Spawn.prototype.fastSpawnDelay = function(delay) {
    this.fastDelay += delay;
    if (this.fastDelay > 30000) {
        if(this.enemiesDelay>1000) this.enemiesDelay -= 250;
        this.fastDelay=0;
    }
}

//랜덤생성
Spawn.prototype.color = function(color){
    if (color == 0) {
        return "blue"
    } else if (color == 1) {
        return "red";
    } else if (color === 2) {
        return "green";
    } else {
        return "black";
    }
}
Spawn.prototype.type = function(size){
    if (size == 0) {
        return "big"
    } else if (size == 1) {
        return "nomal";
    } else {
        return "small";
    }
}
//canvas밖을 벗어날 때
Spawn.prototype.outOf = function(unit) {
    return unit.x < -300 || unit.x > this.canvas.width + 300
        || unit.y < -300 || unit.y > this.canvas.height + 300;
}