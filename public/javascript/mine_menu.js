function MineMenu(race, canvas) {
  this.race = race;
  this.track = race.track;
  this.canvas = canvas;
  this.targetTiles;
  this.handleEvent = function(event) {
    switch(event.type) {
      case 'mousedown':
        var mouseX = event.pageX - this.canvas.offsetLeft;
        var mouseY = event.pageY - this.canvas.offsetTop;
        this.addMine(mouseX, mouseY);
      break;
    }
  }

  this.setTargetTiles();
  this.addMineMenuEventListeners();
  this.render();
}

MineMenu.prototype.setTargetTiles = function() {
  var currentPosition = this.race.getCurrentPosition();
  var targetTiles = this.race.track.getTilesForPosition(currentPosition.x, currentPosition.y);
  this.targetTiles = targetTiles;
}

MineMenu.prototype.addMine = function(mouseX, mouseY) {
  var x = Math.floor(mouseX / this.track.tileSize) * this.track.tileSize;
  var y = Math.floor(mouseY / this.track.tileSize) * this.track.tileSize;
  this.race.addMine(x, y);
  this.render();
}

MineMenu.prototype.addMineMenuEventListeners = function() {
  this.canvas.addEventListener("mousedown", this);
}

MineMenu.prototype.disable = function() {
  this.removeMineMenuListeners();
}

MineMenu.prototype.removeMineMenuListeners = function() {
  this.canvas.removeEventListener("mousedown", this);
}

MineMenu.prototype.render = function() {
  this.race.render();
  this.renderTargetTiles();
}

MineMenu.prototype.renderTargetTiles = function() {
  var menu = this;
  var race = this.race;
  var context = this.canvas.getContext("2d");
  context.fillStyle = "rgba(255, 0, 0, 0.5)"
  this.targetTiles.forEach(function(tile) {
    context.fillRect(tile.x+1, tile.y+1, tile.size-1, tile.size-1);
  });
  context.fillStyle = "black"
}
