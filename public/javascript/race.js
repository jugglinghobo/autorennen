function Race(id) {
  this.id = id;
  this.name;
  this.turn;
  this.activePlayer;
  this.players;
  this.track;
  this.arsenals;
  this.canvas;
  this.context;
  this.currentUser;
  this.positions;
  this.possiblePositions;
  this.initialize();
  window.race = this;
}

Race.prototype.moveActivePlayerTo = function(x, y) {
  if (this.isPossiblePosition(x, y)) {
    if (this.track.canBeMovedTo(x, y)) {
      this.positions[this.activePlayer.id][this.turn]["x"] = x;
      this.positions[this.activePlayer.id][this.turn]["y"] = y;
      this.positions[this.activePlayer.id][this.turn]["crashed"] = undefined;
      this.render();

    } else {
      var currentPosition = this.positions[this.activePlayer.id][this.turn-1];
      var nearestBorder = this.getNearestBorderPositionBetween(x, y, currentPosition);

      this.positions[this.activePlayer.id][this.turn]["x"] = nearestBorder["x"];
      this.positions[this.activePlayer.id][this.turn]["y"] = nearestBorder["y"];
      this.positions[this.activePlayer.id][this.turn]["crashed"] = true;

      this.render();
    }
  }
}

Race.prototype.getNearestBorderPositionBetween = function(x, y, currentPosition) {
  var directionX, directionY;
  var positionX = x;
  var positionY = y
  var canBeMovedTo = this.track.canBeMovedTo(positionX, positionY);
  while (!canBeMovedTo) {
    directionX = (currentPosition.x - positionX)/this.track.tileSize;
    directionY = (currentPosition.y - positionY)/this.track.tileSize;

    positionX = positionX + directionX;
    positionY = positionY + directionY;
    canBeMovedTo = this.track.canBeMovedTo(positionX, positionY);
  }

  var borderPosition = {x: this.mapToCanvas(positionX), y: this.mapToCanvas(positionY)};
  return borderPosition;

}

Race.prototype.isPossiblePosition = function(x, y) {
  var isPossiblePosition = false;
  this.possiblePositions.forEach(function(possiblePosition) {
    if (possiblePosition.x == x && possiblePosition.y == y) {
      isPossiblePosition = true;
    }
  });
  return isPossiblePosition;
}

Race.prototype.mapToCanvas = function(position) {
  return this.track.mapToGrid(position) * this.track.tileSize;
}

// ====================================
// INITIALIZING
// ====================================

Race.prototype.initialize = function() {
  this.loadData();
  this.loadCurrentUser();
  this.loadCanvas();
  this.computeNextPosition();
  this.computePossiblePositions();
  this.render();
};

Race.prototype.loadData = function() {
  var race = this;
  var loadPath = this.loadPath();
  $.ajax({
    url: loadPath,
    dataType: 'json',
    async: false,
  }).success(function(data) {
    race.setData(data);
  });
};

Race.prototype.setData = function(data) {
  this.name = data.name;
  this.turn = data.turn;
  this.arsenals = data.arsenals;
  this.positions = data.positions;
  this.activePlayer = data.active_player;
  this.players = data.users;
  this.track = new Track(data.track_id);
}

Race.prototype.loadCurrentUser = function() {
  var race = this;
  var currentUserId = $("#current-user-id").data("id");
  var loadPath = "/users/"+currentUserId+".json";
  $.ajax({
    url: loadPath,
    dataType: 'json',
    async: false,
  }).success(function(data) {
    race.currentUser = data;
  });
}

Race.prototype.loadCanvas = function() {
  this.canvas = document.getElementById("track");
  this.context = this.canvas.getContext("2d");
}

Race.prototype.computePossiblePositions = function() {
  var possiblePositions = [];
  var nextPosition = this.positions[this.activePlayer.id][this.turn];

  // if first turn, set possible positions to finish line
  // else compute based on last turn's position
  if (this.turn == 0) {
    possiblePositions = this.track.getFinishLinePositions();
  } else {
    var x = nextPosition["x"];
    var y = nextPosition["y"];

    var nextTile = this.track.tileGrid[x/this.track.tileSize][y/this.track.tileSize];
    var adjacentTiles = nextTile.adjacentTiles();
    for(c = -1; c < 2; c++) {
      for(r = -1; r < 2; r++) {
        var adjacentTile = adjacentTiles[c][r];
        if (adjacentTile) {
          possiblePositions.push(adjacentTile);
        };
      };
    };
  };
  this.possiblePositions = possiblePositions;
}

Race.prototype.computeNextPosition = function() {
  var lastPosition;
  var currentPosition = this.positions[this.activePlayer.id][this.turn-1];
  var nextPosition = {};

  // initial position was already set


  if (currentPosition) {
    var lastPosition = this.positions[this.activePlayer.id][this.turn-2];

    // normal turn, position is calculated by speed of last turn
    if (lastPosition) {
      nextPosition["x"] = currentPosition["x"] + (currentPosition["x"] - lastPosition["x"]);
      nextPosition["y"] = currentPosition["y"] + (currentPosition["y"] - lastPosition["y"]);

    // first real turn, position is initially set position
    } else {
      nextPosition["x"] = currentPosition["x"];
      nextPosition["y"] = currentPosition["y"];
    }

  // very first turn, setting position on finish line
  } else {
    nextPosition["x"] = undefined;
    nextPosition["y"] = undefined;
  }

  this.positions[this.activePlayer.id][this.turn] = {};
  this.positions[this.activePlayer.id][this.turn] = {};

  this.positions[this.activePlayer.id][this.turn]["x"] = nextPosition["x"];
  this.positions[this.activePlayer.id][this.turn]["y"] = nextPosition["y"];
}

Race.prototype.loadPath = function() {
  return "/races/"+this.id+".json";
}

// ====================================
// RENDERING
// ====================================

Race.prototype.render = function() {
  this.track.render();
  this.renderPlayers();
}

Race.prototype.renderPlayers = function() {
  var race = this;
  var lineWidth = 2;
  var radius = 3;

  this.players.forEach(function(player) {
    race.context.beginPath()
    race.renderPastPositions(player);
    race.renderThisRound(player);
  });
  race.renderPossiblePositions();
}

Race.prototype.renderPastPositions = function(player) {
  for(var turn = 0; turn < this.turn; turn++) {
    this.renderTurnFor(player, turn);
  };
  this.context.strokeStyle = "black";
  this.context.fillStyle = "black";
  this.context.lineWidth = 1;
}

Race.prototype.renderThisRound = function(player) {
  var race = this;

  // set line dash for active player
  if (player.id == race.activePlayer.id) {
    var lineDash = [2];
    race.context.setLineDash(lineDash);
  }

  race.renderTurnFor(player, race.turn);

  race.context.setLineDash([0]);
  race.context.strokeStyle = "black";
  race.context.fillStyle = "black";
  race.context.lineWidth = 1;
}

Race.prototype.renderTurnFor = function(player, turn) {
  var race = this;
  var lineWidth = 2;
  var radius = 3;
  race.context.fillStyle = player.color;
  race.context.strokeStyle = player.color;
  race.context.lineWidth = lineWidth;

  var position = race.positions[player.id][turn];
  var x;
  var y;
  if (position) {
    var x = position["x"];
    var y = position["y"];

    if (x && y) {
      race.context.lineTo(x, y);
      race.context.moveTo(x, y);
      race.context.arc(x, y, radius, 0, 2*Math.PI);
      race.context.moveTo(x, y);
      race.context.fill();
      race.context.stroke();
    };

    // render crashed
    var crashed = position["crashed"];
    if (crashed) {
      var crashImg = new Image();
      crashImg.src = "/images/crash.gif";
      if (crashImg.complete) {
        race.context.drawImage(crashImg, x-(race.track.tileSize/2), y-(race.track.tileSize/2), 15, 15);
      } else {
        crashImg.onload = function() {
          race.context.drawImage(crashImg, x-(race.track.tileSize/2), y-(race.track.tileSize/2), 15, 15);
        };
      };
    };
  };
}

Race.prototype.renderPossiblePositions = function() {
  var race = this;
  var lineWidth = 1;
  var radius = 3;
  this.possiblePositions.forEach(function(possiblePosition) {
    race.context.beginPath();
    race.context.strokeStyle = race.activePlayer.color;
    race.context.arc(possiblePosition.x, possiblePosition.y, radius, 0, 2*Math.PI);
    race.context.stroke();
    race.context.strokeStyle = "black"
  });
}

