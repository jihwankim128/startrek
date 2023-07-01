var Enemy = function(enemyX, enemyY, color, img, ship) {
    this.color = color;
    this.enemyImg = img;
    this.ship = ship;
    //위치
    this.x = enemyX;  
    this.y = enemyY; 
    this.w = 55; 
    this.h = 56; 
    //곡선부분
    this.r = this.w/2;
    this.rx = this.x+this.r;
    this.ry = this.y+this.r;
    //가속도
    this.ax = 0;
    this.ay = 0;
    if(this.color == "blue" || this.color == "green"){
        this.a=1;
        this.maxA = 7;
    } else {
        this.a=1;
        this.maxA = 20;
    }
    //행동
    this.behaviour = false;
    //green을 제외한 적 초기 위치 설정 100~600 사이
    if(this.color == "blue" || this.color == "red" || this.color == "black")  
        this.position = Math.floor(Math.random()*501) + 100;
    //green과 black 적은 공격기능
    if(this.color == "green" || this.color == "black") {
        this.laserDelay = 0;
        this.laser = [];
        this.startLaser = false;
        this.cleanLaser = 0;
    }
    //ship에 가까이, 멀리
    this.flewToShip = false;
    this.flewFromShip = false;
    this.flyingToLeftWall = false;
    //move
    this.goDown = false;
    this.goUp = false;
    this.goRight = false;
    this.goLeft = false;
    //boom
    this.explosion = false;
    this.imageIndex =0;
    this.explosionDelay = 0;
    this.dead = false;

    this.hp = 2;

}

//request 되는 부분, laser, move 등
Enemy.prototype.play = function(delay){ 
    //request로 여러번 실행되므로 blue이거나 red가 죽었을 때 무시
    if(this.dead && (this.color=="blue"|| this.color=="red")) {
        return;
    }
    //죽었는데 충전한 laser가 남아있으면 없애는 과정
    else if (this.dead && this.laser.length !== 0) {
        for(let i=0;i<this.laser.length;i++) this.laser[i].play(delay);
        this.clean(delay);
        return;
    }
    else if (this.dead) return ;
    //무빙
    this.doBehaviour();
    this.slowDown();
    this.updateDirection();
    //반지름 위치 request
    this.r = this.w/2;
    this.rx = this.x+this.r;
    this.ry = this.y+this.r;
    //move
    this.y+=this.ay/10;
    this.x+=this.ax/10;
    //laser 발사 가능한 상태이면 laser생성 black은 더 빠름
    if((this.color == "green" || this.color == "black")&&this.startLaser){
        this.laserDelay += delay;

        if (this.color=="green"&&this.laserDelay > 2200) {
            this.initLaser(this.color);
            this.laserDelay = 0;
        }
        else if(this.laserDelay > 1700) {
            this.initLaser(this.color);
            this.laserDelay = 0;
        }
        for (var i = 0; i < this.laser.length; i++) {
            this.laser[i].play(delay);
        }
    }
    //터졌을 때
    if(this.explosion) {
        this.explosionDelay += delay;
        if(this.explosionDelay > 50) {
            this.imageIndex++;
            this.explosionDelay=0;
        } //터지는 과정이 끝났으면 죽은상태
        if(this.imageIndex>20){
            this.dead = true;
            this.explosion = false;
        }
    }
}
//enemyMove
Enemy.prototype.doBehaviour = function() {
    if (this.color === "blue"||this.color ==="red") this.doEnemyBehaviour();
    else if (this.color === "green") this.doGreenBehaviour();
    else if (this.color === "black") this.doBlackBehaviour();
};
//가속도 설정
Enemy.prototype.updateDirection = function() {
    if (this.goUp && this.ay == 0) this.ay -= this.a; //위로
    if (this.goUp && (Math.abs(this.ay) < this.maxA)) this.ay -= this.a; //maxA만큼 점점 빨라짐
    if (this.goDown && this.ay == 0) this.ay += this.a; // 아래로
    if (this.goDown && (Math.abs(this.ay) < this.maxA)) this.ay += this.a;
    if (this.goRight && this.ax === 0) this.ax += this.a;//오른쪽
    if (this.goRight && (Math.abs(this.ax) < this.maxA)) this.ax += this.a;
    if (this.goLeft && this.ax === 0) this.ax -= this.a;//왼쪽
    if (this.goLeft && (Math.abs(this.ax) < this.maxA)) this.ax -= this.a;
};
//ship 움직임 처럼 쭉쭉 뻗어나가지 않게 설정
Enemy.prototype.slowDown = function() { 
    if (this.ay < 0 && this.goDown) this.ay += this.a;
    if (this.ay > 0 && this.goUp) this.ay -= this.a;
    if (this.ax > 0 && this.goLeft) this.ax -= this.a;
    if (this.ax < 0 && this.goRight) this.ax += this.a;
};
//red, blue move
Enemy.prototype.doEnemyBehaviour = function() {
    //막 생성 됐을 때 아래로 이동
    if (!this.behaviour) {
        this.goDown = true;
        this.behaviour = true;
    } else { //일정한 위치까지 내려가면 ship이랑 가까이 붙음, canvas를 벗어나면 콤보취소
        if (this.y < this.position) return;
        if (this.y >= 700) this.ship.hitCombo(true);
        if (this.rx < this.ship.rx) {
            this.goLeft = false;
            this.goRight = true;
        } else if (this.rx > this.ship.rx) {
            this.goLeft = true;
            this.goRight = false;
        } else {
            this.goLeft = false;
            this.goRight = false;
        }
    }
};
Enemy.prototype.doBlackBehaviour = function() {
    if (!this.behaviour){
        this.goDown = true;
        this.behaviour = true;
    } else { // 내려오면 laser 생성
        if (this.y > 0) this.startLaser = true;
        //ship방향으로 이동
        if (this.y > 10 && !this.flewToShip && !this.flewFromShip) {
            this.goDown = false;
            this.ay = 0;
            //ship과 겹치는 위치면 내려감
            if (this.rx > this.ship.x && this.rx
                < this.ship.x + this.ship.w) {
                this.flewToShip = true;
            } else if (this.rx < this.ship.rx) {
                this.goLeft = false;
                this.goRight = true;
            } else  {
                this.goLeft = true;
                this.goRight = false;
            }
        } //벽에가까워지면 내려감  
        else if (this.flewToShip && !this.flewFromShip) {

            if (this.rx > 300 && !this.flyingToRightWall) {
                this.goLeft = true;
                this.goRight = false;
                this.flyingToLeftWall = true;
            } else if (!this.flyingToLeftWall){
                this.goLeft = false;
                this.goRight = true;
                this.flyingToRightWall = true;
            }
            if (this.x < 50 || this.x > 500) {
                this.goDown = true;
                this.goLeft = false;
                this.goRight = false;
                this.ax = 0;
                this.flewFromShip = true;
            }
        }//내려가는 동안 ship쪽으로 이동하며 canvas를 벗어날 시 콤보초기화, laser종료 
        else if (this.flewFromShip && this.flewToShip) {
            if (this.y >= 700) {
                this.ship.hitCombo(true);
                this.startLaser = false;
            }
            if (this.rx < this.ship.rx) {
                this.goLeft = false;
                this.goRight = true;
            } else if (this.rx > this.ship.rx) {
                this.goLeft = true;
                this.goRight = false;
            } else {
                this.goLeft = false;
                this.goRight = false;
            }

        }
    }
};
//enemy의 레이저가 canvas를 넘거나 맞춘 상태이면 enemy 레이저 삭제
Enemy.prototype.clean = function(delay) {
    this.cleanLaser += delay;
        if (this.cleanLaser > 10000) {
            for (var i = 0; i < this.laser.length; i++) {
                if (this.laser[i].y > 700 || this.laser[i].status) {
                    this.laser.splice(i, 1);
                    i--;
                }
            }
            this.cleanLaser = 0;
        }
};
//일자로 내려가며 레이저 발사 레이저가 canvas초과시 레이저 취소 combo 초기화
Enemy.prototype.doGreenBehaviour = function() {
    if (!this.behaviour) {
        this.goDown = true;
        this.behaviour = true;
    } else if (this.y > 0) {
        if (this.y >= 700) {
            this.ship.hitCombo(true);
            this.startLaser = false;
        } else {
            this.startLaser = true;
        }
    }
};

//적군 그리기 + Laser 그리기 함수
Enemy.prototype.drawAllEnemies = function(ctx){
	if(!this.dead && !this.explosion){
        ctx.drawImage(this.enemyImg.images[this.color], this.x, this.y, this.w, this.h);

    }
	else if(this.explosion){
        ctx.drawImage(this.enemyImg.images["explosion"+this.imageIndex],this.x,this.y,this.r*2,this.r*2);
    }
    if(this.color=="green"||this.color == "black"){
        for (var i = 0; i < this.laser.length; i++) {
            this.laser[i].drawLaser(ctx);
        }
    }
};
//적군이 죽었을 때
Enemy.prototype.boom = function() {
    this.ship.hitCombo();
    this.explosion = true;
    this.startLaser = false;
}
//레이저 설정 후 생성
Enemy.prototype.initLaser = function(){
    this.laser.push(new Laser(this.x+this.w/2-7, this.y+this.h/2 ,this.color, this.enemyImg));
}

Enemy.prototype.living = function() {
    return this.dead || this.explosion;
}