var Hp = function (game){
  this.game = game;
};
//해당 unit의 위치에 따른 hp바 생성
Hp.prototype.draw = function(x, y, w, hp, type) {
  //hp가 없을 경우 안그림
  if(hp>0) { 
    var ctx = this.game.ctx;
    //테두리
    ctx.beginPath();
    if(type=="ship") ctx.rect(x, y-20, w, 10);
    else if(type=="enemy") ctx.rect(x, y-15, w, 10)
    else if(type=="boss") ctx.rect(x, y, w, 30);
    ctx.closePath();
    ctx.strokeStyle = "white";
    //fill
    ctx.stroke();
    ctx.beginPath();
    if(type=="ship") {
      ctx.fillStyle = this.shipHp(hp);
      ctx.rect(x, y-20, w*(hp/100), 10);
    }
    else if(type=="enemy") {
      ctx.fillStyle = this.enemyHp(hp);
      ctx.rect(x, y-15, w*(hp/2), 10);
    }
    else if(type=="boss") {
      ctx.fillStyle = this.bossHp(hp);
      ctx.rect(2, 2, 596*(hp/200) ,30);
    }
    ctx.closePath();
    ctx.fill();
  }
  
};
//hp에 따른 색변화
Hp.prototype.shipHp = function(hp){
  if(hp > 75) return "green";
  else if(hp > 50) return "gold";
  else if(hp > 25) return "orange";
  else if(hp > 0) return "red";
}
Hp.prototype.enemyHp = function(hp){
  if(hp > 1) return "green";
  else if(hp > 0) return "#790001";
}

Hp.prototype.bossHp = function(hp){
  if(hp > 150) return "green";
  else if(hp > 120) return "#87ceeb";
  else if(hp > 90) return "gold";
  else if(hp > 40) return "orange";
  else if(hp > 30) return "red";
  else if(hp > 0) return "#790001"
}
