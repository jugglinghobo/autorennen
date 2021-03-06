function DrawTrackMenu(track, canvas) {
  this.track = track;
  this.canvas = canvas;
  this.tileSize = track.tileSize;
  this.dragging;

  // special handleEvent function, because we'd lose the reference to
  // the trackMenu if we extract the eventHandling code otherwise. See
  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener#The_value_of_this_within_the_handler
  this.handleEvent = function(event) {
    switch(event.type) {

      case 'mousedown':
        var mouseX = event.pageX - this.canvas.offsetLeft;
        var mouseY = event.pageY - this.canvas.offsetTop;
        this.dragging = true;
        this.addTile(mouseX, mouseY, false);
      break;

      case 'mousemove':
        if(this.dragging) {
          var mouseX = event.pageX - this.canvas.offsetLeft;
          var mouseY = event.pageY - this.canvas.offsetTop;
          this.addTile(mouseX, mouseY, true);
        }
      break;

      case 'mouseup':
        this.dragging = false;
      break;

      case 'mouseleave':
        this.dragging = false;
      break;
    }
  }
  this.addDrawTrackEventListeners();
  this.render();
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
  var tile = new Tile(this.track, col, row, this.tileSize, true);
  this.track.addTile(tile);
  this.render();
};

DrawTrackMenu.prototype.render = function() {
  this.track.render();
}

