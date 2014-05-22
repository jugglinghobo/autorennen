function Track(id) {
  this.id = id;
  this.name;
  this.user;
  this.columns;
  this.rows;
  this.width;
  this.height;
  this.tileSize;
  this.canvas;
  this.context;
  this.tileGrid;
  this.initialize();
  window.t = this;
};

Track.prototype.canBeMovedTo = function(x, y) {
  var canBeMovedTo = false;
  var touchingTiles = this.getTilesForPosition(x, y);
  touchingTiles.forEach(function(tile) {
    if (tile.isTrack) {
      canBeMovedTo = true;
    };
  });
  return canBeMovedTo;
}

Track.prototype.hasPickupAt = function(x, y, pickup) {
  var hasPickup = false;
  var touchingTiles = this.getTilesForPosition(x, y);
  touchingTiles.forEach(function(tile) {
    if (tile.pickup && tile.pickup.id == pickup) {
      hasPickup = true;
    };
  });
  return hasPickup;
}

Track.prototype.getTilesForPosition = function(x, y) {
  var col = this.mapToGrid(x);
  var row = this.mapToGrid(y);
  var upLeft = this.tileGrid[col-1][row-1];
  var upRight = this.tileGrid[col][row-1];
  var downLeft = this.tileGrid[col-1][row];
  var downRight = this.tileGrid[col][row];
  return [upLeft, upRight, downLeft, downRight];
}

Track.prototype.addTile = function(tile) {
  // add to grid
  this.tileGrid[tile.column] = this.tileGrid[tile.column] || [];
  this.tileGrid[tile.column][tile.row] = tile;
  this.render();
};

Track.prototype.removeTileAt = function(column, row) {
  this.tileGrid[column][row] = undefined;
  this.render();
}

Track.prototype.addPickupAt = function(x, y, pickup) {
  var pickup = new Pickup(this, pickup, x, y, this.tileSize)
  this.pickups.push(pickup);
  this.render();
}

Track.prototype.clear = function() {
  for(var c = 0; c < this.columns; c++) {
    for(var r = 0; r < this.rows; r++) {
      this.tileGrid[c][r] = new Tile(this, c, r, this.tileSize);
    };
  };
  this.pickups = [];
  this.render();
};

Track.prototype.getFinishLinePositions = function() {
  var finishLine = [];
  this.pickups.forEach(function(pickup) {
    if (pickup.type == "finish") {
      finishLine = finishLine.concat(pickup.positions());
    };
  });
  return finishLine;
}

Track.prototype.jsonTiles = function() {
  var jsonTiles = [];
  for(var c = 0; c < this.columns; c++) {
    for(var r = 0; r < this.rows; r++) {
      var tile = this.tileGrid[c][r];
      if (tile && tile.isTrack) {
        jsonTiles.push(tile.toJson());
      };
    };
  };
  return jsonTiles;
};

Track.prototype.jsonPickups = function() {
  var jsonpickups = [];
  this.pickups.forEach(function(pickup) {
    jsonpickups.push(pickup.toJson());
  });
  return jsonpickups;
}

Track.prototype.loadPath = function() {
  if (this.id) {
    return "/tracks/"+this.id+".json";
  } else {
    return "/tracks/new.json";
  };
};

Track.prototype.mapToGrid = function(position) {
  return Math.round(position / this.tileSize);
}


// ====================================
// INITIALIZING
// ====================================

Track.prototype.initialize = function() {
  this.loadData();
  this.loadCanvas();
  this.render();
};

Track.prototype.loadData = function() {
  var track = this;
  var loadPath = this.loadPath();
  $.ajax({
    url: loadPath,
    dataType: 'json',
    async: false,
  }).success(function(data) {
    track.setData(data);
  });
};

Track.prototype.loadCanvas = function() {
  this.canvas = document.getElementById("track");
  this.canvas.width = this.width;
  this.canvas.height = this.height;
  this.context = this.canvas.getContext("2d");
};

Track.prototype.update = function(data) {
  this.setData(data);
  this.render();
};

Track.prototype.setData = function(data) {
  this.name = data.name;
  this.user = data.user;
  this.columns = data.columns;
  this.rows = data.rows;
  this.tileSize = data.tile_size;
  this.width = this.columns * this.tileSize;
  this.height = this.rows * this.tileSize;
  this.pickups = this.buildPickups(data.pickups);
  this.tileGrid = this.buildGrid(data.tiles);
};

Track.prototype.buildGrid = function(tiles) {
  var tileGrid = [];
  for(var c = 0; c < this.columns; c++) {
    tileGrid[c] = [];
    for (var r = 0; r < this.rows; r++) {
      var jsonTile = $.grep(tiles, function(tile) { return (tile.column == c && tile.row == r) })[0];
      tileGrid[c][r] = new Tile(this, c, r, this.tileSize, jsonTile);
    };
  };
  return tileGrid;
};

Track.prototype.buildPickups = function(pickups) {
  var pickup_array = [];
  var track = this;
  pickups.forEach(function(pickup_data) {
    var pickup = new Pickup(track, pickup_data.type, pickup_data.x, pickup_data.y, track.tileSize)
    pickup_array.push(pickup);
  });
  return pickup_array;
}

// ====================================
// RENDERING
// ====================================

Track.prototype.render = function() {
  this.context.strokeStyle = "black";
  this.context.fillStyle = "black";
  this.renderGrid();
  this.renderPickups();
};

Track.prototype.renderGrid = function() {
  var track = this;
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  // stroke canvas border
  this.context.strokeRect(0+0.5, 0+0.5, this.canvas.width-0.5, this.canvas.height-0.5);

  // stroke non-track tiles
  for(var c = 0; c < this.columns; c++) {
    for(var r = 0; r < this.rows; r++) {
      var tile = this.tileGrid[c][r];
      if(tile) {
        tile.render(this.context);
      };
    };
  };
};

Track.prototype.renderPickups = function() {
  var track = this;
  this.pickups.forEach(function(pickup) {
    pickup.render(track.context);
  });
}
