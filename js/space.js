var Space = function(canvas, img) {
    this.canvas = canvas;
    this.spaceImg = img;
    this.y = 0;
};

Space.prototype.play = function() { // 배경 y축으로 2만큼 계속 이동함
    this.y -= 2;

    if (this.y == -this.canvas.height) { //canvas를 초과하면 y를 다시 0부터 시작
        this.y = 0;
    }
};

Space.prototype.drawSpace = function(ctx) {
    ctx.drawImage(this.spaceImg.images["space"], 0, this.y); 
    //0~canvasheight까지
    ctx.drawImage(this.spaceImg.images["space"], 0, this.y + this.canvas.height); 
    //canvas.height~0까지
};