function MoveMenu(race, canvas) {
  this.race = race;
  this.track = race.track;
  this.tileSize = this.track.tileSize;
  this.canvas = canvas;
  this.possiblePositions = [];

  this.handleEvent = function(event) {
    switch(event.type) {
      case 'mousedown':
        var mouseX = event.pageX - this.canvas.offsetLeft;
        var mouseY = event.pageY - this.canvas.offsetTop;
        this.movePlayer(mouseX, mouseY);
      break;
    }
  }

  this.setPossiblePositions();
  this.addMoveMenuListeners();
  this.render();
}

MoveMenu.prototype.isPossiblePosition = function(x, y) {
  var isPossiblePosition = false;
  this.possiblePositions.forEach(function(possiblePosition) {
    if (possiblePosition.x == x && possiblePosition.y == y) {
      isPossiblePosition = true;
    }
  });
  return isPossiblePosition;
}


MoveMenu.prototype.setPossiblePositions = function() {
  var radius = 1 + this.race.boostersInUse;
  var possiblePositions = [];
  var nextPosition = this.race.getNextPosition();

  // if first turn, set possible positions to finish line
  // else compute based on last turn's position
  if (this.race.turn == 0) {
    possiblePositions = this.track.getFinishLinePositions();
  } else {
    var x = nextPosition["x"];
    var y = nextPosition["y"];

    var nextTile = this.track.tileGrid[x/this.track.tileSize][y/this.track.tileSize];

    for(c = -radius; c <= radius; c++) {
      for(r = -radius; r <= radius; r++) {
        var adjacentTile = nextTile.adjacentTile(c, r);
        if (adjacentTile) {
          possiblePositions.push(adjacentTile);
        };
      };
    };
  };
  this.possiblePositions = possiblePositions;
}

MoveMenu.prototype.addMoveMenuListeners = function() {
  this.canvas.addEventListener("mousedown", this);
}

MoveMenu.prototype.disable = function() {
  this.removeMoveMenuListeners();
}

MoveMenu.prototype.removeMoveMenuListeners = function() {
  this.canvas.removeEventListener("mousedown", this);
}

MoveMenu.prototype.movePlayer = function(x, y) {
  var x = this.race.mapToCanvas(x);
  var y = this.race.mapToCanvas(y);
  this.race.moveActivePlayerTo(x, y);
  this.render();
};

MoveMenu.prototype.render = function() {
  this.race.render();
  this.renderPossiblePositions();
}

MoveMenu.prototype.renderPossiblePositions = function() {
  var menu = this;
  var race = this.race;
  var context = this.canvas.getContext("2d");
  var lineWidth = 1;
  var radius = 3;
  this.possiblePositions.forEach(function(possiblePosition) {
    context.beginPath();
    context.strokeStyle = race.activePlayer.color;
    context.arc(possiblePosition.x, possiblePosition.y, radius, 0, 2*Math.PI);
    context.stroke();
    context.strokeStyle = "black"
  });
}
