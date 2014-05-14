function TrackMenu(track, canvas) {
  this.track = track;
  this.canvas = canvas;
  this.tileSize = track.tileSize;
  this.mouseX;
  this.mouseY;
  this.drawing;

  // special handleEvent function, because we'd lose the reference to
  // the trackMenu if we extract the eventHandling code otherwise. See
  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener#The_value_of_this_within_the_handler
  this.handleEvent = function(event) {
    var canvas = event.currentTarget;
    switch(event.type) {

      case 'mousedown':
        var mouseX = event.pageX - canvas.offsetLeft;
        var mouseY = event.pageY - canvas.offsetTop;
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        this.drawing = true;
        this.addTile(this.mouseX, this.mouseY, false);
      break;

      case 'mousemove':
        if(this.drawing) {
          var mouseX = event.pageX - canvas.offsetLeft;
          var mouseY = event.pageY - canvas.offsetTop;
          this.addTile(mouseX, mouseY, true);
        }
      break;

      case 'mouseup':
        this.drawing = false;
      break;

      case 'mouseleave':
        this.drawing = false;
      break;
    }
  }
  this.addTrackEventListeners();
}

TrackMenu.prototype.addTrackEventListeners = function() {
  this.canvas.addEventListener("mousedown", this);
  this.canvas.addEventListener("mousemove", this);
  this.canvas.addEventListener("mouseup", this);
  this.canvas.addEventListener("mouseleave", this);
}

TrackMenu.prototype.disable = function() {
  this.removeTrackEventListeners();
}

TrackMenu.prototype.removeTrackEventListeners = function() {
  this.canvas.removeEventListener("mousedown", this);
  this.canvas.removeEventListener("mousemove", this);
  this.canvas.removeEventListener("mouseup", this);
  this.canvas.removeEventListener("mouseleave", this);
}

TrackMenu.prototype.addTile = function(mouseX, mouseY, dragged) {
  var x = Math.floor(mouseX / this.tileSize) * this.tileSize;
  var y = Math.floor(mouseY / this.tileSize) * this.tileSize;
  var col = x/this.tileSize;
  var row = y/this.tileSize;
  var tile = new Tile(col, row, x, y, this.tileSize);
  this.track.addTile(tile);
  this.track.render();
};

