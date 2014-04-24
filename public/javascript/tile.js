function Tile(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size;
};

Tile.prototype.render = function(context) {
  context.fillStyle = "black"
  context.strokeStyle = "black";
  context.strokeRect(this.x, this.y, this.size, this.size);
}
