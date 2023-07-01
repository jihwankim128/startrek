var Asteroid = function(x, y, size, img, ship){
//운석이므로 시작점을 x와 y가 원의 곡선 중앙부분
	this.rx = x;
	this.ry = y;
	this.size = size;
	this.img = img;
	this.ship = ship;

//반지름 
	if(this.size == "big") this.r = 48;
	else if(this.size == "nomal") this.r = 21;
	else this.r = 9;

//운석을 둘러싼 임의의 사각형 꼭짓점 위치
	this.x = this.rx - this.r;
	this.y = this.ry - this.r;
	
//가속도
	this.ax = 0;
	this.ay = 10;

//회전
	this.rotation=0;
	this.rotationDelay=0;
	this.init(); 

//폭발
	this.status = false;
	this.explosionDelay = 0;
	this.explosion = false;
	this.imageIndex = 0;

};

//초기 가속도, 회전 설정
Asteroid.prototype.init = function() {
    var rand = Math.floor(Math.random() * 5);
    switch (rand) {
        case 0:
            this.rotating = false;
            this.ax = -2;
            break;
        case 1:
            this.rotating = false;
            this.ax = -5;
            break;
        case 2:
            this.rotating = true;
            break;
        case 3:
            this.rotating = true;
            this.ax = 2;
            break;
        case 4:
            this.rotating = true;
            this.ax = 5;
            break;
    }
    this.ay = Math.floor(Math.random() * 5) + 8;
};
//request 되는 부분 움직임, 폭발모션, 상태 
Asteroid.prototype.play = function(delay) {
	if(this.status) return;
	this.y += this.ay/10;
	this.x += this.ax/10;
	this.rx = this.x+this.r;
	this.ry = this.y+this.r;
	this.rotationDelay += delay;
	if(this.rotationDelay>25){
		if(this.rotating) this.rotation+=1;
		else this.rotation-=1;
		this.rotationDelay=0;
	}
	if(this.explosion) {
        this.explosionDelay += delay;
        if(this.explosionDelay > 50) {
            this.imageIndex++;
            this.explosionDelay=0;
        }
        if(this.imageIndex>20){
            this.status = true;
            this.explosion = false;
        }
    }
}

//draw
Asteroid.prototype.drawAllAsteroid = function(ctx){
	//생성할 수 있는 상태 일 때
	if(!this.status && !this.explosion) 
		this.rotateDraw(ctx, this.img.images[this.size],this.rx,this.ry,this.rotation);
	else if (this.explosion) // 폭발 
        ctx.drawImage(this.img.images["explosion"+this.imageIndex], this.x,this.y,this.r*2,this.r*2);
}

//회전 설정
Asteroid.prototype.rotateDraw = function(ctx, img, x, y, angle){
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(angle * Math.PI / 100);
	ctx.drawImage(img, -(img.width / 2), -(img.height / 2));
	ctx.restore();
};

//터졌을 때
Asteroid.prototype.boom = function() {
    this.explosion = true;
    this.ship.hitCombo();
};

//살아 있을 때
Asteroid.prototype.living = function() {
    return this.status || this.explosion;
};