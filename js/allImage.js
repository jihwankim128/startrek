var AllImage = function() {
    this.images = [];
};

AllImage.prototype.load = function() {
//아군 이미지
    this.images["ship"] = new Image();
    this.images["ship"].src = "img/ship/ship.png";

//배경 이미지
    this.images["space"] = new Image();
    this.images["space"].src = "img/space.png";

//laser 이미지
    for(let i =1; i<=2; i++){
        this.images["shipLaser" + i] = new Image();
        this.images["shipLaser" + i].src = "img/laser/shipLaser"+i+".png";
        this.images["enemyLaser" + i] = new Image();
        this.images["enemyLaser" + i].src = "img/laser/enemyLaser"+i+".png";
        this.images["feverLaser" + i] = new Image();
        this.images["feverLaser" + i].src = "img/laser/feverLaser"+i+".png";
    }

//laser 맞췄을 때 이미지
    for(let i =0; i<2; i++){
        this.images["shipHit" + i] = new Image();
        this.images["shipHit" + i].src = "img/laser/shipHit"+i+".png";
        this.images["enemyHit" + i] = new Image();
        this.images["enemyHit" + i].src = "img/laser/enemyHit"+i+".png";
        this.images["feverHit" + i] = new Image();
        this.images["feverHit" + i].src = "img/laser/feverHit"+i+".png";

    }

//적군 이미지 
    this.images["green"] = new Image();
    this.images["green"].src = "img/enemy/enemyGreen.png";
    this.images["blue"] = new Image();
    this.images["blue"].src = "img/enemy/enemyBlue.png";
    this.images["red"] = new Image();
    this.images["red"].src = "img/enemy/enemyRed.png";
    this.images["black"] = new Image();
    this.images["black"].src = "img/enemy/enemyblack.png";

//운석 이미지
    this.images["big"] = new Image();
    this.images["big"].src = "img/asteroid/1.png";
    this.images["nomal"] = new Image();
    this.images["nomal"].src = "img/asteroid/2.png";
    this.images["small"] = new Image();
    this.images["small"].src = "img/asteroid/3.png";

//boss 
    this.images["Boss"] = new Image();
    this.images["Boss"].src = "img/Boss.png";

//item
    for(let i =0; i<2; i++){
        this.images["item" + i] = new Image();
        this.images["item" + i].src = "img/item"+i+".png";
    }
//shield
    for(let i =1; i<4; i++){
        this.images["shield" + i] = new Image();
        this.images["shield" + i].src = "img/ship/shield"+i+".png";
    }
//아군데미지 입었을 때 이미지
    for(let i =1; i<4; i++){
        this.images["damage" + i] = new Image();
        this.images["damage" + i].src = "img/ship/damage"+i+".png";
    }

//폭발
    for (let i = 0; i < 21; i++) {
        this.images["explosion" + i] = new Image();
        this.images["explosion" + i].src = "./img/explosion/explosion" + i + ".png";
    }
};