var Boss = function(game){
	this.canvas = game.canvas;
	this.img = game.gameImg;
	this.game = game;
	//위치,크기
	this.w = 600;
	this.h = 250;
	this.x = 2;
	this.y = -300;
	//laser
	this.laser= [];
	this.laserDelay=0;
	//초기 체력
	this.hp = 200;

}
//request
Boss.prototype.play = function(delay) {
	if(this.y==30) {
		this.laserDelay += delay;
	    var rand = Math.floor(Math.random()*3);
		if(this.laserDelay>4000){
		    if(rand==0){ // ship이 피할 수 있는 간격만큼 총알 생성
		    	for(var i=0; i<700; i+=(this.game.ship.w+20))
		    		this.laser.push(new Laser(i, 50, "green", this.img));
		    } else if(rand==1) {
		    	for(var i=30; i<700; i+=(this.game.ship.w+20))
		    		this.laser.push(new Laser(i, 50, "green", this.img));
		    }
		    else {
		    	for(var i=60 ;i<700; i+=(this.game.ship.w+20))
		    		this.laser.push(new Laser(i, 50, "green", this.img));
		    }
		    this.laserDelay=0;
		}
	}
	else this.y+=1;
}
Boss.prototype.bossDraw = function(ctx) { 
    ctx.drawImage(this.img.images["Boss"], this.x, this.y, this.w, this.h);
    for(var i =0;i<this.laser.length;i++) this.laser[i].drawLaser(ctx);
}