function DrawTrackMenu(track, canvas) {
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
    switch(event.type) {

      case 'mousedown':
        var mouseX = event.pageX - this.canvas.offsetLeft;
        var mouseY = event.pageY - this.canvas.offsetTop;
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        this.drawing = true;
        this.addTile(this.mouseX, this.mouseY, false);
      break;

      case 'mousemove':
        if(this.drawing) {
          var mouseX = event.pageX - this.canvas.offsetLeft;
          var mouseY = event.pageY - this.canvas.offsetTop;
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
  this.addDrawTrackEventListeners();
}

DrawTrackMenu.prototype.addDrawTrackEventListeners = function() {
  this.canvas.addEventListener("mousedown", this);
  this.canvas.addEventListener("mousemove", this);
  this.canvas.addEventListener("mouseup", this);
  this.canvas.addEventListener("mouseleave", this);
}

DrawTrackMenu.prototype.disable = function() {
  this.removeDrawTrackEventListeners();
}

DrawTrackMenu.prototype.removeDrawTrackEventListeners = function() {
  this.canvas.removeEventListener("mousedown", this);
  this.canvas.removeEventListener("mousemove", this);
  this.canvas.removeEventListener("mouseup", this);
  this.canvas.removeEventListener("mouseleave", this);
}

DrawTrackMenu.prototype.addTile = function(mouseX, mouseY, dragged) {
  var x = Math.floor(mouseX / this.tileSize) * this.tileSize;
  var y = Math.floor(mouseY / this.tileSize) * this.tileSize;
  var col = x/this.tileSize;
  var row = y/this.tileSize;
  var tile = new Tile(col, row, x, y, this.tileSize);
  this.track.addTile(tile);
};

