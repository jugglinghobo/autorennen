function PickupMenu(track, canvas, pickup) {
  this.track = track;
  this.canvas = canvas;
  this.tileSize = track.tileSize;
  this.pickup = pickup;
  this.dragging;

  this.handleEvent = function(event) {
    switch(event.type) {

      case 'mousedown':
        var mouseX = event.pageX - this.canvas.offsetLeft;
        var mouseY = event.pageY - this.canvas.offsetTop;
        this.dragging = true;
        this.addPickupAt(mouseX, mouseY);
      break;

      case 'mousemove':
        if(this.dragging) {
          var mouseX = event.pageX - this.canvas.offsetLeft;
          var mouseY = event.pageY - this.canvas.offsetTop;
          this.addPickupAt(mouseX, mouseY, true);
        }
      break;

      case 'mouseup':
        this.dragging = false;
      break;

      case 'mouseleave':
        this.dragging = false;
      break;
    };
  };

  this.addPickupEventListeners();
};

PickupMenu.prototype.addPickupEventListeners = function() {
  this.canvas.addEventListener("mousedown", this);
  this.canvas.addEventListener("mousemove", this);
  this.canvas.addEventListener("mouseup", this);
  this.canvas.addEventListener("mouseleave", this);
}

PickupMenu.prototype.addPickupAt = function(mouseX, mouseY) {
  var x = Math.floor(mouseX / this.tileSize) * this.tileSize;
  var y = Math.floor(mouseY / this.tileSize) * this.tileSize;
  this.track.addPickupAt(x, y, this.pickup);
  this.render();
};

PickupMenu.prototype.disable = function() {
  this.removePickupEventListeners();
};

PickupMenu.prototype.removePickupEventListeners = function() {
  this.canvas.removeEventListener("mousedown", this);
  this.canvas.removeEventListener("mousemove", this);
  this.canvas.removeEventListener("mouseup", this);
  this.canvas.removeEventListener("mouseleave", this);
}

PickupMenu.prototype.render = function() {
  this.track.render();
}
