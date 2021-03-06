function Tile(track, column, row, size, jsonTile) {
  this.track = track;
  this.column = column;
  this.row = row;
  this.x = column*size;
  this.y = row*size;
  this.size = size;
  this.isTrack = false;
  this.memoizedAdjacentTiles;
  this.memoizedTouchingTiles;

  if (jsonTile) {
    this.isTrack = true;
    if (jsonTile.pickup) {
      this.pickup = new Pickup(this, jsonTile.pickup);
    };
  };
};

Tile.prototype.toJson = function() {
  var jsonTile = {};
  jsonTile["x"] = this.x;
  jsonTile["y"] = this.y;
  jsonTile["column"] = this.column;
  jsonTile["row"] = this.row;
  jsonTile["size"] = this.size;
  if (this.pickup) {
    jsonTile["pickup"] = this.pickup.id;
  };
  return jsonTile;
}

Tile.prototype.touchingTiles = function() {
  if (!this.memoizedTouchingTiles) {
    touchingTiles = [];
    // add self
    touchingTiles.push(this);
    // add top left
    touchingTiles.push(this.adjacentTile(-1, -1));
    // add top
    touchingTiles.push(this.adjacentTile(0, -1));
    // add left
    touchingTiles.push(this.adjacentTile(-1, 0));
    this.memoizedTouchingTiles = touchingTiles;
  }
  return this.memoizedTouchingTiles;
}

Tile.prototype.adjacentTile = function(col, row) {
  var grid = this.track.tileGrid;
  var tile;
  var gridColumn;
  gridColumn = grid[this.column+col];
  if (gridColumn) {
    tile = gridColumn[this.row+row];
  };
  if (tile) {
    return tile;
  };
}

// ====================================
// RENDERING
// ====================================

Tile.prototype.render = function(context) {
  var tile = this;
  var x = this.x+0.5;
  var y = this.y+0.5;
  var size = this.size;

  if (this.isTrack) {
    // tile
    if (this.pickup) {
      this.pickup.render(context);
    } else {
      context.fillStyle = "#eee";
      context.fillRect(x, y, size, size);
      context.fillStyle = "black";
    }

    // border
    context.strokeRect(x, y, size, size);
  };
};

