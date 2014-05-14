function MenuManager(track) {
  this.track = track;
  this.canvas = this.track.canvas;
  this.activeMenu = new TrackMenu(this.track, this.canvas);
  this.initializeMenuListeners();
}

MenuManager.prototype.initializeMenuListeners = function() {
  var menu = this;
  $("#track-menu").on("change", "#draw-track", function(e) {
    e.preventDefault();
    menu.disableActiveMenu();
    menu.activeMenu = new TrackMenu(menu.track, menu.canvas);
  });

  $("#track-menu").on("change", "#booster", function(e) {
    e.preventDefault();
    menu.disableActiveMenu();
    menu.activeMenu = new PickupMenu(menu.track, menu.canvas, "#pickup-booster");
  });

  $("#track-menu").on("change", "#rocket", function(e) {
    e.preventDefault();
    menu.disableActiveMenu();
    menu.activeMenu = new PickupMenu(menu.track, menu.canvas, "#pickup-rocket");
  });

  $("#track-menu").on("change", "#clear", function(e) {
    e.preventDefault();
    menu.track.clear();
  });
};

MenuManager.prototype.disableActiveMenu = function() {
  if (this.activeMenu) {
    this.activeMenu.disable();
  };
};

