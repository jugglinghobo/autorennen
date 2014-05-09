//$(document).ready(function() {
//  var track = new Track(trackId);
//});

function Track(id) {
  this.id = id;
  this.name;
  this.creator;
  this.columns;
  this.rows;
  this.width;
  this.height;
  this.tileSize;
  this.canvas;
  this.context;
  this.tileGrid;
  window.crack = this;
  this.initialize();
};

Track.prototype.initialize = function() {
  this.loadData();
  this.loadCanvas();
  this.render();
};

Track.prototype.loadCanvas = function() {
  this.canvas = document.getElementById("track");
  this.canvas.width = this.width;
  this.canvas.height = this.height;
  this.context = this.canvas.getContext("2d");
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

Track.prototype.update = function(data) {
  this.setData(data);
  this.render();
}

Track.prototype.setData = function(data) {
  this.name = data.name;
  this.creator = data.creator;
  this.columns = data.columns;
  this.rows = data.rows;
  this.tileSize = data.tile_size;
  this.width = this.columns * this.tileSize;
  this.height = this.rows * this.tileSize;
  this.tileGrid = data.tile_grid;
};

Track.prototype.render = function() {
  this.renderGrid();
};

Track.prototype.renderGrid = function() {
  var track = this;
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  // stroke canvas border
  this.context.strokeRect(0+0.5, 0+0.5, this.canvas.width-0.5, this.canvas.height-0.5);

  // stroke non-track tiles
  for(col = 0; col < this.columns; col++) {
    for(row = 0; row < this.rows; row++) {
      var tile = this.tileGrid[col][row];
      if(tile) {
        this.renderTile(tile)
      };
    };
  };
};

Track.prototype.renderTile = function(tile) {
  var x = tile.x+0.5;
  var y = tile.y+0.5;
  var size = tile.size;
  this.context.strokeRect(x, y, size, size);
}

Track.prototype.addTile = function(tile) {
  if (!this.tileGrid[tile.column][tile.row]) {
    this.tileGrid[tile.column][tile.row] = tile;
    console.log(""+tile.column+", "+tile.row);
  };
}

Track.prototype.clear = function() {
  for(col = 0; col < this.columns; col++) {
    for(row = 0; row < this.rows; row++) {
      this.tileGrid[col][row] = null;
    };
  };
  this.render();
}

Track.prototype.loadPath = function() {
  if (this.id) {
    return "/tracks/"+this.id+".json";
  } else {
    return "/tracks/new.json";
  };
};
