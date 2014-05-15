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
  this.pickups;
  this.initialize();
  window.t = this;
};

Track.prototype.initialize = function() {
  this.loadData();
  this.loadCanvas();
  this.loadPickups();
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

Track.prototype.loadPickups = function() {
  var pickupIds = ["pickup-finish", "pickup-booster", "pickup-rocket", "pickup-mine"]
  this.pickupSources = {};

  var track = this;
  pickupIds.forEach(function(id) {
    var pickup = id.replace(/pickup-/g, '');
    track.pickupSources[id] = "/images/"+pickup+".png"
  });
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
  this.tileGrid = this.buildGrid(data.tiles);
};

Track.prototype.buildGrid = function(tiles) {
  var tileGrid = [];
  for(var c = 0; c < this.columns; c++) {
    tileGrid[c] = [];
    for (var r = 0; r < this.rows; r++) {
      var tile = $.grep(tiles, function(tile) { return (tile.column == c && tile.row == r) })[0];
      tileGrid[c][r] = tile;
    };
  };
  return tileGrid;
};

Track.prototype.tiles = function() {
  var tiles = [];
  for(c = 0; c < this.columns; c++) {
    for(r = 0; r < this.rows; r++) {
      var tile = this.tileGrid[c][r];
      if (tile) {
        tiles.push(tile);
      };
    };
  };
  return tiles;
};

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

Track.prototype.addPickupAt = function(column, row, pickup) {
  var tile = this.tileGrid[column][row];
  if (tile) {
    tile.pickup = pickup;
    this.render();
  }
}

Track.prototype.clear = function() {
  for(c = 0; c < this.columns; c++) {
    for(r = 0; r < this.rows; r++) {
      this.tileGrid[c][r] = undefined;
    };
  };
  this.render();
};

Track.prototype.loadPath = function() {
  if (this.id) {
    return "/tracks/"+this.id+".json";
  } else {
    return "/tracks/new.json";
  };
};

// ====================================
// RENDERING
// ====================================

Track.prototype.render = function() {
  this.renderGrid();
};

Track.prototype.renderGrid = function() {
  var track = this;
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  // stroke canvas border
  this.context.strokeRect(0+0.5, 0+0.5, this.canvas.width-0.5, this.canvas.height-0.5);

  // stroke non-track tiles
  for(c = 0; c < this.columns; c++) {
    for(r = 0; r < this.rows; r++) {
      var tile = this.tileGrid[c][r];
      if(tile) {
        this.renderTile(tile);
      };
    };
  };
};

Track.prototype.renderTile = function(tile) {
  var x = tile.x+0.5;
  var y = tile.y+0.5;
  var size = tile.size;

  // tile
  if (tile.pickup) {
    var pickupImg = new Image();
    pickupImg.src = this.pickupSources[tile.pickup];
    var track = this;
    pickupImg.onload = function() {
      track.context.drawImage(this, x+0.5, y+0.5, size-1, size-1);
    }
  } else {
    this.context.fillStyle = "#eee";
    this.context.fillRect(x, y, size, size);
    this.context.fillStyle = "black";
  }

  // border
  this.context.strokeRect(x, y, size, size);
};

