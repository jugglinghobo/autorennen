function Tile(gridX, gridY, tileSize) {
  this.gridX = gridX;
  this.gridY = gridY;
  this.x = this.gridX * tileSize;
  this.y = this.gridY * tileSize;
  this.size = tileSize;
};

Tile.prototype.render = function(context) {
  context.fillStyle = "white"
  context.strokeStyle = "white";
  context.fillRect(this.x, this.y, this.size, this.size);
  context.fillStyle = "black"
  context.strokeStyle = "black";
  context.strokeRect(this.x, this.y, this.size, this.size);
}
