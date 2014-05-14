function PickupMenu(track, canvas, pickup) {
  this.track = track;
  this.canvas = canvas;
  this.tileSize = track.tileSize;
  this.pickup = pickup;

  this.handleEvent = function(event) {
    switch(event.type) {

      case 'mousedown':
        var mouseX = event.pageX - this.canvas.offsetLeft;
        var mouseY = event.pageY - this.canvas.offsetTop;
        this.addPickupAt(mouseX, mouseY);
      break;
    };
  };

  this.addPickupEventListeners();
};

PickupMenu.prototype.addPickupEventListeners = function() {
  this.canvas.addEventListener("mousedown", this);
}

PickupMenu.prototype.addPickupAt = function(mouseX, mouseY) {
  var x = Math.floor(mouseX / this.tileSize) * this.tileSize;
  var y = Math.floor(mouseY / this.tileSize) * this.tileSize;
  var col = x/this.tileSize;
  var row = y/this.tileSize;

  this.track.addPickupAt(col, row, this.pickup);
};

PickupMenu.prototype.disable = function() {
  this.removeDrawTrackEventListeners();
};

PickupMenu.prototype.removePickupEventListener = function() {
  this.canvas.removeEventListener("mousedown", this);
}
