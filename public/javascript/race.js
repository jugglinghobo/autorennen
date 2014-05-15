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
  this.initialize();
  window.race = this;
}

Race.prototype.initialize = function() {
  this.loadData();
  this.loadCanvas();
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
    var nextTile = this.track.tileGrid[Number(nextPosition["x"])/this.track.tileSize][Number(nextPosition["y"])/this.track.tileSize];
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

Race.prototype.calculateNextPosition = function(lastPosition, current_position) {
  var nextPosition = {}
  nextPosition["x"] = Number(current_position["x"]) + (Number(current_position["x"]) - Number(lastPosition["x"]));
  nextPosition["y"] = Number(current_position["y"]) + (Number(current_position["y"]) - Number(lastPosition["y"]));
  return nextPosition;
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
  this.renderValidMoves();
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
    race.context.fillStyle = player.color;
    race.context.lineWidth = lineWidth;
    race.context.strokeStyle = player.color;

    race.context.beginPath();
    for(var turn = 0; turn < race.turn; turn++) {
      var x = race.positions[player.id][turn]["x"];
      var y = race.positions[player.id][turn]["y"];

      if (x && y) {
        race.context.lineTo(x, y);
        race.context.moveTo(x, y);
        race.context.arc(x, y, radius, 0, 2*Math.PI);
        race.context.moveTo(x, y);
      };
    };

    race.context.fill();
    race.context.stroke();
    race.context.strokeStyle = "black";
    race.context.fillStyle = "black";
    race.context.lineWidth = 1;
  });

  var x = race.positions[race.activePlayer.id][race.turn]["x"];
  var y = race.positions[race.activePlayer.id][race.turn]["y"];
  if (x && y) {
    race.context.lineTo(x, y);
    race.context.moveTo(x, y);
    race.context.arc(x, y, radius, 0, 2*Math.PI);
    race.context.moveTo(x, y);
  };
  race.context.fill();
  race.context.stroke();
  race.context.strokeStyle = "black";
  race.context.fillStyle = "black";
  race.context.lineWidth = 1;
}
