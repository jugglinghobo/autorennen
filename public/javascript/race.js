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
  this.initialize();
  window.race = this;
}

Race.prototype.initialize = function() {
  this.loadData();
  this.loadCurrentUser();
  this.loadCanvas();
  this.computeNextPosition();
  this.computeValidPositions();
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

Race.prototype.computeValidPositions = function() {
  var validPositions = [];
  var nextPosition = this.positions[this.activePlayer.id][this.turn];

  // if first turn, set valid positions to finish line
  // else compute based on last turn's position
  if (this.turn == 0) {
    validPositions = this.track.getFinishLinePositions();
  } else {
    var x = nextPosition["x"];
    var y = nextPosition["y"];

    var nextTile = this.track.tileGrid[Number(x)/this.track.tileSize][Number(y)/this.track.tileSize];
    var adjacentTiles = nextTile.adjacentTiles();
    for(c = -1; c < 2; c++) {
      for(r = -1; r < 2; r++) {
        var adjacentTile = adjacentTiles[c][r];
        if (adjacentTile) {
          validPositions.push(adjacentTile);
        };
      };
    };
  };
  this.validPositions = validPositions;
}

Race.prototype.computeNextPosition = function() {
  var lastPosition;
  var currentPosition = this.positions[this.activePlayer.id][this.turn-1];
  var nextPosition = {};
  if (currentPosition) {
    var lastPosition = this.positions[this.activePlayer.id][this.turn-2];
  }
  if (lastPosition) {
    console.log("lastPosition exists:");
    nextPosition["x"] = Number(currentPosition["x"]) + (Number(currentPosition["x"]) - Number(lastPosition["x"]));
    nextPosition["y"] = Number(currentPosition["y"]) + (Number(currentPosition["y"]) - Number(lastPosition["y"]));
  } else {
    console.log("lastPosition does not exist");
    nextPosition["x"] = currentPosition["x"];
    nextPosition["y"] = currentPosition["y"];
  }

  this.positions[this.activePlayer.id][this.turn] = {};
  this.positions[this.activePlayer.id][this.turn] = {};

  this.positions[this.activePlayer.id][this.turn]["x"] = nextPosition["x"];
  this.positions[this.activePlayer.id][this.turn]["y"] = nextPosition["y"];
}

Race.prototype.moveActivePlayerTo = function(x, y) {
  if (this.validPosition(x, y)) {
    this.positions[this.activePlayer.id][this.turn]["x"] = x;
    this.positions[this.activePlayer.id][this.turn]["y"] = y;
    this.render();
  }
}

Race.prototype.validPosition = function(x, y) {
  // compare all valid positions with x and y
  // return true if one set matches, else return false
  for (var i = 0; i < this.validPositions.length; i++) {
    if (this.validPositions[i].x == x && this.validPositions[i].y == y) {
      return true;
    };
  };
  return false;
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

Race.prototype.renderValidMoves = function() {
  var race = this;
  var lineWidth = 1;
  var radius = 3;
  this.validPositions.forEach(function(validPosition) {
    race.context.beginPath();
    race.context.strokeStyle = race.activePlayer.color;
    race.context.arc(validPosition.x, validPosition.y, radius, 0, 2*Math.PI);
    race.context.stroke();
    race.context.strokeStyle = "black"
  });
}

Race.prototype.renderPlayers = function() {
  var race = this;
  var lineWidth = 2;
  var radius = 3;

  this.players.forEach(function(player) {
    race.renderPastMoves(player);
  });
  race.renderValidMoves();
}

Race.prototype.renderPastMoves = function(player) {
  var race = this;
  var lineWidth = 2;
  var radius = 3;
  race.context.fillStyle = player.color;
  race.context.strokeStyle = player.color;
  race.context.lineWidth = lineWidth;

  race.context.beginPath();
  for(var turn = 0; turn <= race.turn; turn++) {
    var position = race.positions[player.id][turn];
    var x;
    var y;
    if (position) {
      var x = position["x"];
      var y = position["y"];
    }
    if (x && y) {
      race.context.lineTo(x, y);
      race.context.moveTo(x, y);
      race.context.arc(x, y, radius, 0, 2*Math.PI);
      race.context.moveTo(x, y);
      race.context.fill();
      race.context.stroke();
    };
  };
  race.context.strokeStyle = "black";
  race.context.fillStyle = "black";
  race.context.lineWidth = 1;
}

Race.prototype.renderThisTurn = function() {
  var race = this;
  var lineWidth = 2;
  var radius = 3;

  var movesForTurn = race.positions[this.activePlayer.id][race.turn]
    if (movesForTurn) {
      var x = race.positions[this.activePlayer.id][race.turn]["x"];
      var y = race.positions[this.activePlayer.id][race.turn]["y"];
      if (x && y) {
        race.context.lineTo(x, y);
        race.context.moveTo(x, y);
        race.context.arc(x, y, radius, 0, 2*Math.PI);
        race.context.moveTo(x, y);
        race.context.strokeStyle = this.activePlayer.color;
        race.context.fillStyle = this.activePlayer.color;
        race.context.lineWidth = lineWidth;
        race.context.fill();
        race.context.stroke();
      };
    }
  race.context.strokeStyle = "black";
  race.context.fillStyle = "black";
  race.context.lineWidth = 1;

  this.renderValidMoves();
}
