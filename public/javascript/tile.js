function Tile(track, column, row, size, jsonTile) {
  this.track = track;
  this.column = column;
  this.row = row;
  this.x = column*size;
  this.y = row*size;
  this.size = size;
  this.memoizedAdjacentTiles;
  this.memoizedTouchingTiles;
  if (jsonTile) {
    this.partOfTrack = true;
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

Tile.prototype.adjacentTiles = function(col, row) {
  if (!this.memoizedAdjacentTiles) {
    adjacentTiles = {};

    // left column
    adjacentTiles[-1] = {};
    adjacentTiles[-1][-1] = this.adjacentTile(-1, -1);
    adjacentTiles[-1][0] = this.adjacentTile(-1, 0);
    adjacentTiles[-1][1] = this.adjacentTile(-1, 1);

    // same column
    adjacentTiles[0] = {};
    adjacentTiles[0][-1] = this.adjacentTile(0, -1);
    adjacentTiles[0][0] = this.adjacentTile(0, 0);
    adjacentTiles[0][1] = this.adjacentTile(0, 1);

    // right column
    adjacentTiles[1] = {};
    adjacentTiles[1][-1] = this.adjacentTile(1, -1);
    adjacentTiles[1][0] = this.adjacentTile(1, 0);
    adjacentTiles[1][1] = this.adjacentTile(1, 1);
    this.memoizedAdjacentTiles = adjacentTiles;
  };
  return this.memoizedAdjacentTiles;
}

Tile.prototype.touchingTiles = function() {
  if (!this.memoizedTouchingTiles) {
    touchingTiles = [];
    // add self
    touchingTiles.push(this);
    // add top left tile
    touchingTiles.push(this.adjacentTile(-1, -1));
    // add top down
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

Tile.prototype.touchesPickup = function(pickup) {
  var touch = false;
  var touchingTiles = this.touchingTiles();
  touchingTiles.forEach(function(touching) {
    if (touching && touching.pickup && touching.pickup.id == pickup) {
      debugger;
      touch = true;
    }
  });
  return touch;
};

// ====================================
// RENDERING
// ====================================

Tile.prototype.render = function(context) {
  var tile = this;
  var x = this.x+0.5;
  var y = this.y+0.5;
  var size = this.size;

  if (this.partOfTrack) {
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

