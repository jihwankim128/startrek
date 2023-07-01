var Item = function(x, y, type, img){
	this.x = x;
	this.y = y;
	this.type = type;
	this.img = img;
	this.w = 34;
	this.h = 33;
	this.drop = false;
}

Item.prototype.drawItem = function(ctx) {
	ctx.drawImage(this.img.images[this.type], this.x, this.y, this.w, this.h);
};