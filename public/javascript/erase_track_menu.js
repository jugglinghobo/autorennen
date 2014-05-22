function EraseTrackMenu(track, canvas) {
  this.track = track;
  this.canvas = canvas;
  this.tileSize = track.tileSize;
  this.mouseX;
  this.mouseY;
  this.erasing;

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
        this.erasing = true;
        this.removeAt(this.mouseX, this.mouseY, false);
      break;

      case 'mousemove':
        if(this.erasing) {
          var mouseX = event.pageX - this.canvas.offsetLeft;
          var mouseY = event.pageY - this.canvas.offsetTop;
          this.removeAt(mouseX, mouseY, true);
        }
      break;

      case 'mouseup':
        this.erasing = false;
      break;

      case 'mouseleave':
        this.erasing = false;
      break;
    }
  }
  this.addEraseTrackEventListeners();
}

EraseTrackMenu.prototype.addEraseTrackEventListeners = function() {
  this.canvas.addEventListener("mousedown", this);
  this.canvas.addEventListener("mousemove", this);
  this.canvas.addEventListener("mouseup", this);
  this.canvas.addEventListener("mouseleave", this);
}

EraseTrackMenu.prototype.disable = function() {
  this.removeEraseTrackEventListeners();
}

EraseTrackMenu.prototype.removeEraseTrackEventListeners = function() {
  this.canvas.removeEventListener("mousedown", this);
  this.canvas.removeEventListener("mousemove", this);
  this.canvas.removeEventListener("mouseup", this);
  this.canvas.removeEventListener("mouseleave", this);
}

EraseTrackMenu.prototype.removeAt = function(mouseX, mouseY, dragged) {
  var x = Math.floor(mouseX / this.tileSize) * this.tileSize;
  var y = Math.floor(mouseY / this.tileSize) * this.tileSize;
  this.track.clearAt(x, y);
};

