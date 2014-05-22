function RaceMenuManager(race) {
  this.race = race;
  this.track = race.track;
  this.canvas = this.track.canvas;
  if (debugging || (race.currentUser.id == race.activePlayer.id)) {
    this.activeMenu = new MoveMenu(this.race, this.canvas);
  };
  this.initializeMenuListeners();
}

RaceMenuManager.prototype.initializeMenuListeners = function() {
  var manager = this;

  $("#race-menu").on("change", "#move", function(e) {
    e.preventDefault();
    manager.disableActiveMenu();
    manager.activeMenu = new MoveMenu(manager.race, manager.canvas);
  });

  $("#race-menu").on("change", "#booster", function(e) {
    e.preventDefault();
    manager.disableActiveMenu();
    manager.activeMenu = new BoosterMenu(manager.race, manager.canvas);
  });

  $("#race-menu").on("change", "#rocket", function(e) {
    e.preventDefault();
    manager.disableActiveMenu();
    manager.activeMenu = new RocketMenu(manager.race, manager.canvas);
  });

  $("#race-menu").on("change", "#mine", function(e) {
    e.preventDefault();
    manager.disableActiveMenu();
    manager.activeMenu = new MineMenu(manager.race, manager.canvas);
  });
};

RaceMenuManager.prototype.disableActiveMenu = function() {
  if (this.activeMenu) {
    this.activeMenu.disable();
  };
};

