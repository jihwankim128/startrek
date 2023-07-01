var Game = function(canvas, ctx){
	this.canvas = canvas;
	this.ctx = ctx;

	this.gameImg = new AllImage();
	this.gameImg.load(); //img파일 다 불러오기
    this.bossSpawn = false;

    this.laserDelay=0;
    this.clearLaser=0;
}

//game 초기 설정
Game.prototype.init = function() {
    this.enemies = [];
    this.enemyHp = [];
    this.item = [];
    this.asteroid = [];
	this.space = new Space(this.canvas, this.gameImg);
    this.boss = new Boss(this);
    this.ship = new Ship(this.canvas, this.gameImg);
    this.hit = new Hit(this);
    this.spawn = new Spawn(this);
    this.shipHp = new Hp(this);
    this.bossHp = new Hp(this);
    this.level = 1;
};
//request 적군, 운석, 아이템, 아군, 보스, 보스 총알관리, 점수
Game.prototype.play = function(delay) {
    this.space.drawSpace(this.ctx); //배경 그리기 
    if(this.ship.hp>0) {
        this.ship.drawShip(this.ctx);//아군 그리기
        //아군의 위치에 따른 hpBar 생성
        this.shipHp.draw(this.ship.x,this.ship.y,this.ship.w, this.ship.hp, "ship"); 
    }
    //보스가 죽었을 때 사라지는 모션 그리기
    if(this.boss.hp<=0) {
        if(this.boss.y>-400) {
           this.boss.bossDraw(ctx);
           this.boss.y-=2;
       }//다음 보스를 위한 셋팅
        else {
            this.bossSpawn = false;
            this.boss.hp=200;
        }
    }//보스 체력이 있고 점수가 2000점의 배수 이상이면 boss생성
    //1레벨 일 때 2000점, 2레벨 일 때 4000점
    else if(this.ship.score/2000 >= this.level) {
        this.boss.play(delay);
        this.boss.bossDraw(ctx);
        this.bossHp.draw(2, 2, 596, this.boss.hp, "boss");
        this.bossSpawn = true;
    }
    for (var i = 0; i < this.enemies.length; i++) {
        this.enemies[i].drawAllEnemies(this.ctx);
        if(this.enemies[i].hp >0){
            this.enemyHp[i] = new Hp(this);
            if(!this.enemies[i].status) this.enemyHp[i].draw(this.enemies[i].x,this.enemies[i].y,
                this.enemies[i].w,this.enemies[i].hp, "enemy");
        }
    }
    for (var i = 0; i < this.asteroid.length; i++) this.asteroid[i].drawAllAsteroid(this.ctx);
    document.getElementById('score').innerText = this.ship.score;

    for (var i = 0; i < this.item.length; i++) {
        this.item[i].drawItem(this.ctx);
    }
    for(var i =0;i<this.boss.laser.length;i++) this.boss.laser[i].play(delay);
    this.cleanLaser += delay;
    if (this.cleanLaser > 160) { 
    //laser 배열 내 빈공간이 생겨 undefined를 막기 위한 변수
        for (var i = 0; i < this.laser.length; i++) {
            if (this.boss.laser[i].y < 0) { //canvas를 넘어가면 해당 laser 삭제
                this.boss.laser.splice(i, 1);
                i--;
            }
        }
        this.cleanLaser = 0;
    }
    
}