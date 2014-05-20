function MoveMenu(race, canvas) {
  this.race = race;
  this.tileSize = race.track.tileSize;
  this.canvas = canvas;

  this.handleEvent = function(event) {
    switch(event.type) {
      case 'mousedown':
        var mouseX = event.pageX - this.canvas.offsetLeft;
        var mouseY = event.pageY - this.canvas.offsetTop;
        this.movePlayer(mouseX, mouseY, false);
      break;
    }
  }

  if (race.currentUser.id == race.activePlayer.id) {
    this.addMoveMenuListeners();
  }
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

MoveMenu.prototype.movePlayer = function(mouseX, mouseY, dragged) {
  var x = Math.round(mouseX / this.tileSize) * this.tileSize;
  var y = Math.round(mouseY / this.tileSize) * this.tileSize;
  this.race.moveActivePlayerTo(x, y);
};
