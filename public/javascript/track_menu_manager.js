function TrackMenuManager(track) {
  this.track = track;
  this.canvas = this.track.canvas;
  this.activeMenu = new DrawTrackMenu(this.track, this.canvas);
  this.initializeMenuListeners();
}

TrackMenuManager.prototype.initializeMenuListeners = function() {
  var menu = this;
  $("#track-menu").on("change", "#draw-track", function(e) {
    e.preventDefault();
    menu.disableActiveMenu();
    menu.activeMenu = new DrawTrackMenu(menu.track, menu.canvas);
  });

  $("#track-menu").on("change", "#erase-track", function(e) {
    e.preventDefault();
    menu.disableActiveMenu();
    menu.activeMenu = new EraseTrackMenu(menu.track, menu.canvas, true);
  });

  $("#track-menu").on("change", "#finish", function(e) {
    e.preventDefault();
    menu.disableActiveMenu();
    menu.activeMenu = new PickupMenu(menu.track, menu.canvas, "finish");
  });

  $("#track-menu").on("change", "#booster", function(e) {
    e.preventDefault();
    menu.disableActiveMenu();
    menu.activeMenu = new PickupMenu(menu.track, menu.canvas, "booster");
  });

  $("#track-menu").on("change", "#rocket", function(e) {
    e.preventDefault();
    menu.disableActiveMenu();
    menu.activeMenu = new PickupMenu(menu.track, menu.canvas, "rocket");
  });

  $("#track-menu").on("change", "#mine", function(e) {
    e.preventDefault();
    menu.disableActiveMenu();
    menu.activeMenu = new PickupMenu(menu.track, menu.canvas, "mine");
  });

  $("#track-menu").on("click", "#clear", function(e) {
    e.preventDefault();
    menu.track.clear();
  });
};

TrackMenuManager.prototype.disableActiveMenu = function() {
  if (this.activeMenu) {
    this.activeMenu.disable();
  };
};

