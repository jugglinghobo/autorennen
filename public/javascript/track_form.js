$(document).ready(function() {
  var trackId = $("#track-id").val();
  new TrackForm(trackId);
});

function TrackForm(id) {
  this.trackId = id;
  this.track;
  this.width = 700;
  this.height = 1000;
  this.tileSize = 15;
  this.gridWidth = this.width/this.tileSize;
  this.gridHeight = this.height/this.tileSize;
  this.grid = [];

  this.mouseX;
  this.mouseY;
  this.drawing = false;
  this.clickX = [];
  this.clickY = [];
  this.clickDrag = [];
  this.canvas = document.getElementById("track");
  this.canvas.width = this.width;
  this.canvas.height = this.height;
  this.context = this.canvas.getContext("2d");
  this.initialize();
  window.canvas = this.canvas;
  window.trackForm = this;

}

TrackForm.prototype.initialize = function() {
  this.initializeFormListeners();
  this.loadTrackInformation();
  this.initializeGrid();
  this.renderGrid();
  this.initializeDrawListeners();
}

TrackForm.prototype.initializeFormListeners = function() {
  $("#track-form").on("click", function() {

  });
}

TrackForm.prototype.initializeDrawListeners = function() {
  var trackForm = this;

  this.canvas.addEventListener("mousedown", function(e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    var gridX = Math.round(mouseX / trackForm.tileSize) * trackForm.tileSize;
    var gridY = Math.round(mouseY / trackForm.tileSize) * trackForm.tileSize;
    trackForm.mouseX = gridX;
    trackForm.mouseY = gridY;
    trackForm.drawing = true;
    trackForm.addClick(trackForm.mouseX, trackForm.mouseY);
    trackForm.render();
  });

  this.canvas.addEventListener("mousemove", function(e) {
    if(trackForm.drawing) {
      var mouseX = e.pageX - this.offsetLeft;
      var mouseY = e.pageY - this.offsetTop;
      var gridX = Math.round(mouseX / trackForm.tileSize) * trackForm.tileSize;
      var gridY = Math.round(mouseY / trackForm.tileSize) * trackForm.tileSize;
      trackForm.addClick(gridX, gridY, true);
      trackForm.render();
    }
  });

  this.canvas.addEventListener("mouseup", function(e) {
    trackForm.drawing = false
  });

  this.canvas.addEventListener("mouseleave", function(e) {
    trackForm.drawing = false;
  });
}

TrackForm.prototype.addClick = function(x, y, dragging) {
  this.clickX.push(x);
  this.clickY.push(y);
  this.clickDrag.push(dragging);
}

TrackForm.prototype.render = function() {
  //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clears the canvas

  this.context.strokeStyle = "#df4b26";
  this.context.lineJoin = "round";
  this.context.lineWidth = 5;

  for(var i=0; i < this.clickX.length; i++) {
    this.context.beginPath();

    if(this.clickDrag[i] && i){

      this.context.moveTo(this.clickX[i-1], this.clickY[i-1]);
     } else {
       this.context.moveTo(this.clickX[i]-1, this.clickY[i]);
     }
     this.context.lineTo(this.clickX[i], this.clickY[i]);
     this.context.closePath();
     this.context.stroke();
  }
  this.context.lineWidth = 1;
}

TrackForm.prototype.initializeGrid = function() {
  for(var x = 0; x < this.gridWidth; x++) {
    this.grid[x] = [];
    for (var y = 0; y < this.gridHeight; y++) {
      var tile = new Tile(x*this.tileSize, y*this.tileSize, this.tileSize);
      this.grid[x][y] = tile;
    };
  };
}

TrackForm.prototype.renderGrid = function() {
  var trackForm = this;
  this.grid.forEach(function(row) {
    row.forEach(function(tile) {
      tile.render(trackForm.context);
    });
  });
};

TrackForm.prototype.loadTrackInformation = function() {
  var loadPath = "/tracks/"+this.trackId+".json"
  var trackForm = this;
  $.ajax({
    url: loadPath,
    dataType: 'json',
  }).success(function(data) {
    trackForm.track = data;
  });
}



