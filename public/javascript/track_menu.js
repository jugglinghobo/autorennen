function TrackMenu(track) {
  this.track = track;
  this.tileSize = track.tileSize;
  this.mouseX;
  this.mouseY;
  this.drawing;
  this.canvas = this.track.canvas;
  this.initializeDrawListeners();
  this.initializeMenuListeners();
}

TrackMenu.prototype.initializeMenuListeners = function() {
  var menu = this;
  $("#track-menu").on("click", "#clear", function(e) {
    e.preventDefault();
    menu.track.clear();
  });
}

TrackMenu.prototype.initializeDrawListeners = function() {
  var trackMenu = this;

  this.canvas.addEventListener("mousedown", function(e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    trackMenu.mouseX = mouseX;
    trackMenu.mouseY = mouseY;
    trackMenu.drawing = true;
    trackMenu.addTile(trackMenu.mouseX, trackMenu.mouseY, false);
  });

  this.canvas.addEventListener("mousemove", function(e) {
    if(trackMenu.drawing) {
      var mouseX = e.pageX - this.offsetLeft;
      var mouseY = e.pageY - this.offsetTop;
      trackMenu.addTile(mouseX, mouseY, true);
    }
  });

  this.canvas.addEventListener("mouseup", function(e) {
    trackMenu.drawing = false
  });

  this.canvas.addEventListener("mouseleave", function(e) {
    trackMenu.drawing = false;
  });
}
// var tile = this.grid[gridX][gridY];
// // do something with tile to let it know it is a boundary
// this.boundaries.push(mouseInformation);

TrackMenu.prototype.addTile = function(mouseX, mouseY, dragged) {
  var x = Math.floor(mouseX / this.tileSize) * this.tileSize;
  var y = Math.floor(mouseY / this.tileSize) * this.tileSize;
  var col = x/this.tileSize;
  var row = y/this.tileSize;
  var tile = new Tile(col, row, x, y, this.tileSize);
  this.track.addTile(tile);
  this.track.render();
}

