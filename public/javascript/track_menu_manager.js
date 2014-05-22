function TrackMenuManager(track) {
  this.track = track;
  this.canvas = this.track.canvas;
  this.activeMenu = new DrawTrackMenu(this.track, this.canvas);
  this.initializeMenuListeners();
}

TrackMenuManager.prototype.initializeMenuListeners = function() {
  var manager = this;
  $("#track-menu").on("change", "#draw-track", function(e) {
    e.preventDefault();
    manager.disableActiveMenu();
    manager.activeMenu = new DrawTrackMenu(manager.track, manager.canvas);
  });

  $("#track-menu").on("change", "#erase-track", function(e) {
    e.preventDefault();
    manager.disableActiveMenu();
    manager.activeMenu = new EraseTrackMenu(manager.track, manager.canvas, true);
  });

  $("#track-menu").on("change", "#finish", function(e) {
    e.preventDefault();
    manager.disableActiveMenu();
    manager.activeMenu = new PickupMenu(manager.track, manager.canvas, "finish");
  });

  $("#track-menu").on("change", "#booster", function(e) {
    e.preventDefault();
    manager.disableActiveMenu();
    manager.activeMenu = new PickupMenu(manager.track, manager.canvas, "booster");
  });

  $("#track-menu").on("change", "#rocket", function(e) {
    e.preventDefault();
    manager.disableActiveMenu();
    manager.activeMenu = new PickupMenu(manager.track, manager.canvas, "rocket");
  });

  $("#track-menu").on("change", "#mine", function(e) {
    e.preventDefault();
    manager.disableActiveMenu();
    manager.activeMenu = new PickupMenu(manager.track, manager.canvas, "mine");
  });

  $("#track-menu").on("click", "#clear", function(e) {
    e.preventDefault();
    manager.track.clear();
  });
};

TrackMenuManager.prototype.disableActiveMenu = function() {
  if (this.activeMenu) {
    this.activeMenu.disable();
  };
};

