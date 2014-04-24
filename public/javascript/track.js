function Track() {
  this.id = $("#track-id").val();
  this.name = $("#track-name").val();
  this.creator = $("#track-creator").val();

  this.width = 700;
  this.height = 1000;
  this.tileSize = 15;
  this.grid = [];
  this.boundaries = [];
  this.boundaryTiles = []

  this.canvas = document.getElementById("track");
  this.canvas.width = this.width;
  this.canvas.height = this.height;
  this.context = this.canvas.getContext("2d");

  this.initialize();
}

Track.prototype.initialize = function() {
  this.loadTrackInformation();
  this.initializeGrid();
  this.renderGrid();
}

Track.prototype.update = function(data) {
  this.id = data.id;
  this.name = data.name;
  this.creator = data.creator;
  this.boundaries = $.map(data.boundaries, function(value, index) {
    return [value];
  });
  this.render();
}

Track.prototype.loadTrackInformation = function() {
  var track = this;
  if(this.id) {
    var loadPath = "/tracks/"+this.id+".json"
    var track = this;
    $.ajax({
      url: loadPath,
      dataType: 'json',
    }).success(function(data) {
      track.update(data);
    });
  }
}


Track.prototype.initializeGrid = function() {
  for(var x = 0; x < this.width; x+=this.tileSize) {
    this.grid[x] = [];
    for (var y = 0; y < this.height; y+=this.tileSize) {
      var tile = new Tile(x, y, this.tileSize);
      this.grid[x][y] = tile;
    };
  };
}

Track.prototype.addBoundaries = function(mouseInformation) {
  var gridX = Math.round(mouseInformation.x / this.tileSize) * this.tileSize;
  var gridY = Math.round(mouseInformation.y / this.tileSize) * this.tileSize;
  var tile = this.grid[gridX][gridY];
  // do something with tile to let it know it is a boundary
  this.boundaries.push(mouseInformation);
}

Track.prototype.render = function() {
  this.context.strokeStyle = "#df4b26";
  this.context.lineJoin = "round";
  this.context.lineWidth = 5;

  for(var i=0; i < this.boundaries.length; i++) {
    this.context.beginPath();

    if(this.boundaries[i].dragged && i){

      this.context.moveTo(this.boundaries[i-1].x, this.boundaries[i-1].y);
     } else {
       this.context.moveTo(this.boundaries[i].x-1, this.boundaries[i].y);
     }
     this.context.lineTo(this.boundaries[i].x, this.boundaries[i].y);
     this.context.closePath();
     this.context.stroke();
  }
  this.context.lineWidth = 1;
  this.context.fillStyle = "black"
  this.context.strokeStyle = "black";
}


Track.prototype.renderGrid = function() {
  var track = this;
  this.grid.forEach(function(row) {
    row.forEach(function(tile) {
      tile.render(track.context);
    });
  });
};


