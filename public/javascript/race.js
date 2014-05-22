function Race(id) {
  this.id = id;
  this.name;
  this.turn;
  this.activePlayer;
  this.players;
  this.track;
  this.positions;
  this.arsenals;
  this.items;
  this.canvas;
  this.context;
  this.currentUser;
  this.boostersInUse;
  this.initialize();
  window.race = this;
}

Race.prototype.moveActivePlayerTo = function(x, y) {
  var currentPosition = this.positions[this.activePlayer.id][this.turn-1];

  // remove pickups of aleady made moves for this round
  var activePosition = this.positions[this.activePlayer.id][this.turn];
  if (activePosition) {
    this.dropPickupsAt(activePosition.x, activePosition.y);
  };

  var crashed;
  // crash
  if (!this.track.canBeMovedTo(x, y)) {
    var nearestBorder = this.getNearestBorderPositionBetween(x, y, currentPosition);
    x = nearestBorder["x"];
    y = nearestBorder["y"];
    crashed = true;
  }

  this.setCurrentPosition(x, y);
  this.positions[this.activePlayer.id][this.turn]["crashed"] = crashed;
}

Race.prototype.pickupPickupAt = function(x, y) {
  var race = this;
  var pickups = this.track.getPickupsAt(x, y);
  pickups.forEach(function(pickup) {
    if (pickup.type != "finish") {
      race.arsenals[race.activePlayer.id][pickup.type] += 1;
      race.updatePickupCounter(pickup.type);
    };
  });
}

Race.prototype.dropPickupsAt = function(x, y) {
  var race = this;
  var pickups = this.track.getPickupsAt(x, y);
  var race = this;
  pickups.forEach(function(pickup) {
    race.arsenals[race.activePlayer.id][pickup.type] -= 1;
    race.updatePickupCounter(pickup.type);
  });
}

Race.prototype.updatePickupCounter = function(type) {
  var counter = this.arsenals[this.activePlayer.id][type];
  $(".pickup."+type+"").html(counter);
}

Race.prototype.addMine = function(x, y) {
  var mines = this.arsenals[this.activePlayer.id]["mine"];
  if (mines > 0) {
    this.usePickup("mine", 1);
    this.addItemAt(x, y, "activeMine");
  };
}

Race.prototype.addItemAt = function(x, y, type) {
  var item = new Item(this, type, x, y, this.track.tileSize);
  this.items.push(item);
};

Race.prototype.useBoosters = function(boosterCount) {
  this.usePickup("booster", boosterCount);
  this.boostersInUse = boosterCount;
}

Race.prototype.usePickup = function(type, count) {
  this.arsenals[this.activePlayer.id][type] -= (count - this.boostersInUse);
  this.updatePickupCounter(type);
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

Race.prototype.mapToCanvas = function(position) {
  return this.track.mapToGrid(position) * this.track.tileSize;
}

Race.prototype.getActiveArsenal = function(pickup) {
  return this.arsenals[this.activePlayer.id][pickup];
}

Race.prototype.setTargetTiles = function(tiles) {
  this.targetTiles = tiles;
}

// ====================================
// INITIALIZING
// ====================================

Race.prototype.initialize = function() {
  this.loadData();
  this.loadCurrentUser();
  this.loadCanvas();
  this.boostersInUse = 0;
  this.targetTiles = [];
  this.setCurrentPosition();
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
  this.items = this.buildItems(data.items);
  this.activePlayer = data.active_player;
  this.players = data.users;
  this.track = new Track(data.track_id);
}

Race.prototype.buildItems = function(items) {
  var item_array = [];
  var race = this;
  items.forEach(function(item_data) {
    var item = new Item(race, item_data.type, item_data.x, item_data.y, item_data.size);
    item_array.push(item);
  });
  return item_array;
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

Race.prototype.setCurrentPosition = function(x, y) {
  if (!(x && y)) {
    var lastPosition = this.positions[this.activePlayer.id][this.turn-1];
    if (lastPosition) {
      this.positions[this.activePlayer.id][this.turn] = {};
      x = lastPosition.x;
      y = lastPosition.y;
    };
  };

  this.positions[this.activePlayer.id][this.turn]["x"] = x;
  this.positions[this.activePlayer.id][this.turn]["y"] = y;
  this.pickupPickupAt(x, y);
}

Race.prototype.getCurrentPosition = function() {
  return this.positions[this.activePlayer.id][this.turn];
}

Race.prototype.getNextPosition = function() {
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

  return nextPosition;
}

Race.prototype.loadPath = function() {
  return "/races/"+this.id+".json";
}

Race.prototype.jsonItems = function() {
  var jsonitems = [];
  this.items.forEach(function(item) {
    jsonitems.push(item.toJson());
  });
  return jsonitems;
}

// ====================================
// RENDERING
// ====================================

Race.prototype.render = function() {
  this.track.render();
  this.renderItems();
  this.renderPlayers();
}

Race.prototype.renderItems = function() {
  var context = this.context;
  this.items.forEach(function(item) {
    item.render(context);
  });
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


