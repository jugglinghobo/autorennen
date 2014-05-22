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
  this.pickups;
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

Track.prototype.getPickupsAt = function(x, y) {
  var pickups = []
  this.pickups.forEach(function(pickup) {
    var isThere = false;
    var positions = pickup.positions();

    positions.forEach(function(position) {
      if (position.x == x && position.y == y) {
        isThere = true;
      };
    });

    if (isThere) {
      pickups.push(pickup);
    }
  });

  return pickups;
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

Track.prototype.getAdjacentPositions = function(x, y) {
  var positions = [];
  for (i = -1; i <= 1; i++) {
    for (j = -1; j <= 1; j++) {
      position = {x: x+(i*this.tileSize), y: y+(j*this.tileSize)};
      if (!(this.findByCoordinates(positions, position).length > 0)) {
        positions.push(position);
      };
    };
  };
  return positions;
}

Track.prototype.addTile = function(tile) {
  // add to grid
  this.tileGrid[tile.column] = this.tileGrid[tile.column] || [];
  this.tileGrid[tile.column][tile.row] = tile;
};

Track.prototype.addPickupAt = function(x, y, type) {
  var pickup = new Pickup(this, type, x, y, this.tileSize);
  this.removePickupsAt(x, y);
  this.pickups.push(pickup);
}

Track.prototype.clearAt = function(x, y) {
  this.removeTileAt(x, y);
  this.removePickupsAt(x, y);
}

Track.prototype.clear = function() {
  for(var c = 0; c < this.columns; c++) {
    for(var r = 0; r < this.rows; r++) {
      this.tileGrid[c][r] = new Tile(this, c, r, this.tileSize);
    };
  };
  this.pickups = [];
};

Track.prototype.removeTileAt = function(x, y) {
  var col = this.mapToGrid(x);
  var row = this.mapToGrid(y);
  this.tileGrid[col][row] = undefined;
}

Track.prototype.removePickupsAt = function(x, y) {
  var pickups = this.pickups.filter(function(pickup) { return !(pickup.x == x && pickup.y == y) });
  this.pickups = pickups;
}

Track.prototype.getFinishLinePositions = function() {
  var track = this;
  var finishLine = [];
  this.pickups.forEach(function(pickup) {
    if (pickup.type == "finish") {
      var positions = pickup.positions();
      // add all positions not already in there
      positions.forEach(function(position) {
        if (!(track.findByCoordinates(finishLine, position).length > 0)) {
          finishLine.push(position);
        };
      });
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

Track.prototype.findByCoordinates = function(array, object) {
  var objects = $.grep(array, function(obj) {obj.x == object.x && obj.y == object.y});
  return objects;
}


// ====================================
// INITIALIZING
// ====================================

Track.prototype.initialize = function() {
  this.loadData();
  this.loadCanvas();
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
