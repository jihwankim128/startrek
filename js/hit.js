var Hit = function(game) {
    this.game = game;
    this.ship = game.ship;
    this.enemies = game.enemies;
    this.item = game.item;
    this.boss = game.boss;

    this.asteroid = game.asteroid;
    this.ctx = game.ctx;
};
//request 부딪혔는지 체크하는 play함수
Hit.prototype.play = function() {
	for(var i = 0; i<this.enemies.length;i++){
		//각 모서리가 부딪혔는지
		if(!this.enemies[i].living()&&this.checkCrash(this.ship, this.enemies[i],1)) {
			//ship의 곡선 중앙 enemy 꼭짓점이 닿았는지 적군과 닿으면 적군 즉시사망
			if(this.checkCrash(this.ship, this.enemies[i],3)){
				this.enemies[i].hp-=2;
				this.enemies[i].boom();
				//shield 상태 
				if(!this.ship.shieldStatus) {
					this.ship.hitCombo(true);
					this.ship.hp-=2;
				}
            	else {
	                if(this.enemies[i].color=="black") this.ship.score+=40;
	                else if(this.enemies[i].color=="green") this.ship.score+=30;
	                else this.ship.score+=20;
	            }
			}
		}
		//총알이 없는 적군일 경우 무시
		if (this.enemies[i].color === "blue" || this.enemies[i].color === "red") continue;
        for (var j = 0; j < this.enemies[i].laser.length; j++) {
        	//적군 총알이 이미 ship을 맞추었을 경우 무시
            if (this.enemies[i].laser[j].hitted()) continue;
            //ship과 적레이저가 닿았는지 꼭짓점, 곡선 테두리 위치로 체크
            if (this.checkCrash(this.ship, this.enemies[i].laser[j],1)) {
                if (this.checkCrash(this.ship, this.enemies[i].laser[j],3)) {
                    this.enemies[i].laser[j].shootDown();
                    if(!this.ship.shieldStatus){
                    	this.ship.hitCombo(true);
                		this.ship.hp-=4;
                    }
                }
            }
        }
	}
	for (var i = 0; i < this.asteroid.length; i++) {
		//ship의 곡선부분과 운석(원형)이 부딪혔을 때
        if (!this.asteroid[i].living() && this.checkCrash(this.ship, this.asteroid[i],2)) {
        	//운석의 곡선부분과 ship의 꼭짓점이 부딪혔을 때
            if (this.checkCrash(this.asteroid[i], this.ship,3)) {
	            this.asteroid[i].boom();
            	if(!this.ship.shieldStatus){
	                this.ship.hitCombo(true);
	                if(this.asteroid[i].size=="big") this.ship.hp-=4;
	                else if(this.asteroid[i].size=="nomal") this.ship.hp-=2;
	                else this.ship.hp-=1;
            	}
            	else this.ship.score+=10;
            }
        }
	}
	//shipLaser가 적들을 맞출 때
	for (var i = 0; i < this.ship.laser.length; i++) {
        if (this.ship.laser[i].hitted()) continue;
        for (var k = 0; k < this.enemies.length; k++) {
            if (this.enemies[k].living()) continue;
            if (this.checkCrash(this.enemies[k], this.ship.laser[i],1)) {
            	if (this.checkCrash(this.enemies[k], this.ship.laser[i],3)){
					this.enemies[k].hp -= this.ship.damage;
	                this.ship.laser[i].shootDown();
					if(this.enemies[k].hp<=0) {
						this.enemies[k].boom();
		                if(this.enemies[k].color=="black") this.ship.score+=40;
		                else if(this.enemies[k].color=="green") this.ship.score+=30;
		                else this.ship.score+=20;
					}
            	}
            }
        }
        for (var j = 0; j < this.asteroid.length; j++) {
            if (this.asteroid[j].living()) continue;
            if (this.checkCrash(this.asteroid[j], this.ship.laser[i],3)) {
                this.asteroid[j].boom();
                this.ship.laser[i].shootDown();
                this.ship.score+=10;
            }
        }
        if (this.checkCrash(this.boss, this.ship.laser[i],1)) {
			this.boss.hp -= this.ship.damage;
            this.ship.laser[i].shootDown();
            this.ship.hitCombo();
			if(this.boss.hp<=0) {
				this.game.level++;
				return;
			}
        }
    }
    for (var i = 0; i < this.item.length; i++) {
        if (this.checkCrash(this.ship, this.item[i],1)) {
            if (this.checkCrash(this.ship, this.item[i],3)) {
                if (this.item[i].type === "item0") this.ship.damageUp(); //데미지 증가
                else if (this.item[i].type === "item1") this.ship.shield(); //실드생성
                this.item[i].drop = true;//아이템을 먹은 상태
            }
        }

	}
	for(var i=0; i<this.item.length;i++){
		if(this.item[i].drop) {
			this.item.splice(i,1); // 먹은 아이템은 삭제
			i--;
		}
	}

    	//보스 공격 ship
    if(this.checkCrash(this.boss, this.ship, 1)) this.ship.hp = 0;
    for(var i =0; i<this.boss.laser.length; i++){
    	if (this.boss.laser[i].hitted()) continue;
    	if(this.checkCrash(this.ship, this.boss.laser[i],1)) {
            if (this.checkCrash(this.ship, this.boss.laser[i],3)){
            	this.boss.laser[i].shootDown();
            	if(!this.ship.shieldStatus) {
            		this.ship.hp-=5;
            		this.ship.hitCombo(true);
            	}
            } 
        }
    }
    //combo 이미지
    this.ctx.fillStyle = "#f2f2f2";
	this.ctx.font = "50px kenvector_future_thin";
    if(this.ship.combo<10){
    	this.ctx.fillText("COMBO: "+this.ship.combo,350,100);
    }
    else { //combo가 10이 되면 fever모드
    	this.ctx.fillStyle = "red";
    	this.ctx.fillText("FEVER !!!",200,350);
    }
};

Hit.prototype.checkCrash = function(unit1, unit2, check) {
	//이미지의 꼭짓점 부분이 닿았을 때
	if(check==1){
		return (unit1.x<unit2.x+unit2.w)
			&&(unit1.x+unit1.w>unit2.x)
			&&(unit1.y<unit2.y+unit2.h)
			&&(unit1.y+unit1.h>unit2.y);
	}

	//두 유닛의 곡선 부분 중앙이 닿았는지 확인, 좌표거리
	if(check==2){
		var rx = unit1.rx - unit2.rx;
		var ry = unit1.ry - unit2.ry;
		var distanse = Math.sqrt(rx*rx + ry*ry);
		return unit1.r+unit2.r>distanse;
	}
	//두 유닛의 곡선 부분 중앙과 꼭짓점이 닿았는지 확인, 좌표거리
	if(check==3){
		var dx = Math.abs(unit1.rx - unit2.x - unit2.w/2);
		var dy = Math.abs(unit1.ry - unit2.y - unit2.h/2);
		if(dx>(unit2.w/2)+(unit1.r)) return 0;
		if(dy>(unit2.h/2)+(unit1.r)) return 0;
		if(dx<=(unit2.w/2)) return 1;
		if(dy<=(unit2.h/2)) return 1;
		var x = dx-unit2.w/2;
		var y = dy-unit2.h/2;
		return (x*x + y*y) <= (unit1.w/2 * unit1.w/2);
	}
};
