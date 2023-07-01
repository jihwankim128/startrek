var Laser = function(x, y, color, img){ 
	this.x = x;
	this.y = y;
	this.img = img;
	this.color = color;
	this.w = 13;
	this.h = 37;

	//laser 상태, 맞췄는지?
	this.hit = false;
    this.hitTimer = 0;
    this.status = false;
    this.hitImg = 0;
};
//fever mode, nomal mode, enemy 상태의 laser들 이동
Laser.prototype.play = function(delay){ 
	if(this.status) return;
	if(!this.status && !this.hit){
		if (this.color == "ship") this.y -= 5; 
	    else if(this.color == "fever") this.y -= 10;
	    else this.y += 5;
	}
	//laser가 unit들에 닿았을 때 img변환을 위한 함수
    if(this.hit){
    	this.hitTimer+=delay;
    	if(this.hitTimer > 100) {
    		this.hitImg++;
    		this.hitTimer=0;
    	}
    	if(this.hitImg>1){
    		this.status=true;
    		this.hit=false;
    	}
    }
};

//laser 생성
Laser.prototype.drawLaser = function(ctx) {
	//laser가 만들 수 있는 상태일 때
	if(!this.status && !this.hit) {
		if (this.color == "ship") {
		    ctx.drawImage(this.img.images["shipLaser1"], this.x, this.y);
		    ctx.drawImage(this.img.images["shipLaser2"], this.x, this.y);
		}
		else if (this.color == "green"||this.color=="black") { //green == enemy
		    ctx.drawImage(this.img.images["enemyLaser1"], this.x, this.y);
		    ctx.drawImage(this.img.images["enemyLaser2"], this.x, this.y);
		}
		else if(this.color == "fever") {
			ctx.drawImage(this.img.images["feverLaser1"], this.x, this.y);
		    ctx.drawImage(this.img.images["feverLaser2"], this.x, this.y);
		}
	} //laser가 유닛에 맞았을 때 이미지변환
	else if (this.hit) {
        if (this.color === "ship") {
            ctx.drawImage(this.img.images["shipHit" + this.hitImg], this.x - this.w, this.y);
        } else if (this.color === "green"||this.color=="black") {
            ctx.drawImage(this.img.images["enemyHit" + this.hitImg], this.x - this.w, this.y);
        } else if (this.color === "fever") {
            ctx.drawImage(this.img.images["feverHit" + this.hitImg], this.x - this.w, this.y + this.h);
        }
    }
	
};
Laser.prototype.shootDown = function() {
    this.hit = true;
};

Laser.prototype.hitted = function() {
    return this.status || this.hit;
};