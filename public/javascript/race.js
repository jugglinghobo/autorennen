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
  window.r = this;
}

Race.prototype.initialize = function() {
  this.loadData();
  this.loadCanvas();
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

Race.prototype.moveActivePlayerTo = function(x, y) {
  this.positions[this.activePlayer.id][this.turn]["x"] = x;
  this.positions[this.activePlayer.id][this.turn]["y"] = y;
  this.track.render();
  this.render();
}

Race.prototype.loadPath = function() {
  return "/races/"+this.id+".json";
}

// ====================================
// RENDERING
// ====================================

Race.prototype.render = function() {
  this.renderPlayers();
}

Race.prototype.renderPlayers = function() {
  var race = this;
  this.players.forEach(function(player) {
    var x = race.positions[player.id][race.turn]["x"];
    var y = race.positions[player.id][race.turn]["y"];

    if (x && y) {
      race.context.beginPath();
      race.context.fillStyle = player.color;
      race.context.arc(x, y, 5, 0, 2*Math.PI);
      race.context.fill();
    };
  });
}
