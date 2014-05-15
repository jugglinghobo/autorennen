function Tile(column, row, size, jsonTile) {
  this.column = column;
  this.row = row;
  this.x = column*size;
  this.y = row*size;
  this.size = size;
  this.loadPickups();
  if (jsonTile) {
    this.partOfTrack = true;
    if (jsonTile.pickup) {
      debugger;
      this.setPickup(jsonTile.pickup);
    };
  };
};

Tile.prototype.setPickup = function(pickupId) {
  this.pickupId = pickupId;
  this.pickup = new Image();
  this.pickup.src = this.pickupSources[this.pickupId];
}

Tile.prototype.toJson = function() {
  var jsonTile = {};
  jsonTile["x"] = this.x;
  jsonTile["y"] = this.y;
  jsonTile["column"] = this.column;
  jsonTile["row"] = this.row;
  jsonTile["size"] = this.size;
  jsonTile["pickup"] = this.pickupId;
  return jsonTile;
}

Tile.prototype.touchesPickup = function() {
}

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
      if (this.pickup.complete) {
        context.drawImage(tile.pickup, x+0.5, y+0.5, size-1, size-1);
      } else {
        this.pickup.onload = function() {
          context.drawImage(tile.pickup, x+0.5, y+0.5, size-1, size-1);
        };
      };
    } else {
      context.fillStyle = "#eee";
      context.fillRect(x, y, size, size);
      context.fillStyle = "black";
    }

    // border
    context.strokeRect(x, y, size, size);
  }

}

Tile.prototype.loadPickups = function(pickupId) {
  var pickupIds = ["pickup-finish", "pickup-booster", "pickup-rocket", "pickup-mine"]
  this.pickupSources = {};

  var tile = this;
  pickupIds.forEach(function(id) {
    var pickup = id.replace(/pickup-/g, '');
    tile.pickupSources[id] = "/images/"+pickup+".png"
  });
}
