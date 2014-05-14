function MenuManager(track) {
  this.track = track;
  this.canvas = this.track.canvas;
  this.activeMenu = new TrackMenu(this.track, this.canvas);
  this.initializeMenuListeners();
}

MenuManager.prototype.initializeMenuListeners = function() {
  var menu = this;
  $("#track-menu").on("click", "#draw-track", function(e) {
    e.preventDefault();
    menu.clearActiveMenu();
    menu.activeMenu = new TrackMenu(menu.track, menu.canvas);
  });

  $("#track-menu").on("click", "#booster", function(e) {
    e.preventDefault();
    menu.clearActiveMenu();
    menu.activeMenu = new PickupMenu(menu.track, menu.canvas, "#pickup-booster");
  });

  $("#track-menu").on("click", "#rocket", function(e) {
    e.preventDefault();
    menu.clearActiveMenu();
    menu.activeMenu = new PickupMenu(menu.track, menu.canvas, "#pickup-rocket");
  });

  $("#track-menu").on("click", "#clear", function(e) {
    e.preventDefault();
    menu.track.clear();
  });
};

MenuManager.prototype.clearActiveMenu = function() {
  if (this.activeMenu) {
    this.activeMenu.clear();
  };
  this.activeMenu = undefined;

}

