var Ship = function(canvas, img) {
    this.canvas = canvas;
    this.shipImg = img;

    //초기위치 - 중앙 하단
    this.w = 90;
    this.h = 60;
    this.x = 255;
    this.y = 600;

    //총알
    this.laserDelay = 0; 
    this.laser = []; 
    this.cleanLaser = 0;
    this.damage = 1;

    //이미지의 사분면이 곡선이므로 곡선 중앙값을 원의 반지름을 이용해 정의
    this.r = this.w/2;
    this.rx = this.x+this.r;
    this.ry = this.y+this.r;

    //fever
    this.feverDelay = 0;
    this.fever=false;
    this.combo = 0;
    //damageUp Item
    this.power = false;
    this.upDelay = 0;
    //shield Item
    this.shieldStatus = false;
    this.shieldDelay = 0;
    this.shieldMotion = false;
    this.shieldImg = 0;

    this.score = 0;

    this.hp = 100;
};

//객체화된 레이저를 생성
Ship.prototype.initLaser = function(color) { 
    if (color === "ship" || color === "fever") {
        this.laser.push(new Laser(this.x+(this.w/2)-7, this.y, color, this.shipImg));
    }
}
//ship이 적군을 없앴을 때 combo를 발생시키는 함수
Ship.prototype.hitCombo = function(reset){
    if(reset) this.combo = 0;
    else if(this.combo < 10) this.combo++;
    if(this.combo == 10) this.fever=true;
}
//fever상태로 전환 약 10초
Ship.prototype.feverTime= function(delay){
    if(this.combo==10){
        this.feverDelay += delay;
        if(this.feverDelay>10000){
            this.feverDelay =0;
            this.fever=false;
            this.hitCombo(true);
        }
    }
}
//ship의 변경된 내용들을 update하며 실행
Ship.prototype.play = function(delay, key){//laser관리함수
    //ship의 테두리 위치
    this.r = this.w/2;
    this.rx = this.x+this.r;
    this.ry = this.y+this.r;

    //fever실행
    if(this.fever) this.feverTime(delay);

    this.laserDelay += delay;
    if(key&&this.laserDelay>1000){ //일정시간이 지났을 때 key값이 true이면 실행
        this.initLaser("ship"); //laser생성
        this.laserDelay = 0;
    }
    //10combo면 공격속도를 올림, fever총알 생성
    if(this.combo==10&&this.laserDelay>100) {
        this.initLaser("fever");
        this.laserDelay=0;
    }
    for(var i = 0; i < this.laser.length; i++){
        this.laser[i].play(delay);//playLaser함수 실행
    }

    this.cleanLaser += delay;
    if (this.cleanLaser > 100) { 
    //laser 배열 내 빈공간이 생겨 undefined를 막기 위한 변수
        for (var i = 0; i < this.laser.length; i++) {
            if (this.laser[i].y < 0) { //canvas를 넘어가면 해당 laser 삭제
                if(this.laser[i].color === "ship") this.hitCombo(true);
                this.laser.splice(i, 1);
                i--;
            }
        }
        this.cleanLaser = 0;
    }
    //sheild 생성함수 shield를 드랍 후 shield를 실행할 수 있는 상태
    if(this.shieldMotion && !this.shieldStatus) {
        this.shieldDelay += delay;
        if(this.shieldDelay>600) {
            if(this.shieldImg<3){
                this.shieldImg++;
            } else {
                this.shieldStatus = true;
                this.shieldMotion = false;
            }
            this.shieldDelay = 0;
        }
    }
    //shield 효과 적용이 끝나면 shield 이미지를 없앰
    else if(this.shieldMotion && this.shieldStatus) {
        this.shieldDelay += delay;
        if(this.shieldDelay>600) {
            if(this.shieldImg>0){
                this.shieldImg--;
            } else {
                this.shieldStatus = false;
                this.shieldMotion = false;
            }
            this.shieldDelay = 0;
        }
    }
    //shield를 실행할 수 있는 상태에서 생성할 수 있는 상태가 되며 shield효과 적용
    else if (this.shieldStatus) {
        this.shieldDelay += delay;
        if(this.shieldDelay > 15000) {
            this.shieldMotion = true;
            this.shieldDelay = 0;
        }
    }
    //damage를 2배로 증가
    if(this.power) {
        this.damage = 2;
        this.upDelay += delay;
        if(this.upDelay>16000){
            this.power = false;
            this.upDelay = 0;
            this.damage=1;
        }
    }
}
//아군 그리기
Ship.prototype.drawShip = function(ctx) { 
    for(var i = 0; i < this.laser.length; i++){
        this.laser[i].drawLaser(ctx); 
    }
    ctx.drawImage(this.shipImg.images["ship"], this.x, this.y, this.w, this.h);
    if(this.hp<80)
        ctx.drawImage(this.shipImg.images["damage1"], this.x, this.y, this.w, this.h);
    if(this.hp<50)
        ctx.drawImage(this.shipImg.images["damage2"], this.x, this.y, this.w, this.h);
    if(this.hp<20)
        ctx.drawImage(this.shipImg.images["damage3"], this.x, this.y, this.w, this.h);
    //this.hpBar.draw(ctx);

    if (this.shieldImg > 0) {
        ctx.drawImage(this.shipImg.images["shield" + this.shieldImg], this.x, this.y, this.w, this.h);
    }
}

Ship.prototype.shield = function() {
    if(this.shieldStatus) {
        this.shieldDelay = 0;
        this.shieldMotion = false;
    }
    else this.shieldMotion = true;
}

Ship.prototype.damageUp = function() {
    if(this.power) this.upDelay = 0;
    else this.power = true;
}