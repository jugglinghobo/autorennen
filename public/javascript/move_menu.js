function MoveMenu(race, canvas) {
  this.race = race;
  this.tileSize = race.track.tileSize;
  this.canvas = canvas;

  this.handleEvent = function(event) {
    switch(event.type) {
      case 'mousedown':
        var mouseX = event.pageX - this.canvas.offsetLeft;
        var mouseY = event.pageY - this.canvas.offsetTop;
        this.movePlayer(mouseX, mouseY);
      break;
    }
  }

  this.addMoveMenuListeners();
}

MoveMenu.prototype.addMoveMenuListeners = function() {
  this.canvas.addEventListener("mousedown", this);
}

MoveMenu.prototype.disable = function() {
  this.removeEraseTrackEventListeners();
}

MoveMenu.prototype.removeEraseTrackEventListeners = function() {
  this.canvas.removeEventListener("mousedown", this);
}

MoveMenu.prototype.movePlayer = function(x, y) {
  var x = this.race.mapToCanvas(x);
  var y = this.race.mapToCanvas(y);
  this.race.moveActivePlayerTo(x, y);
};
