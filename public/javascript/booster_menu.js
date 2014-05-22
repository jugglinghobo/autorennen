function BoosterMenu(race, canvas) {
  this.race = race;
  this.canvas = canvas;
  this.boosterOptions;
  this.selectedBoosters = 0;
  this.handleEvent = function(event) {
    switch(event.type) {
      case 'change':
        this.useBooster();
      break;
    }
  }

  this.displayBoosterSelect();
  this.addBoosterMenuListeners();
}

BoosterMenu.prototype.useBooster = function() {
  var selectedBoosters = Number($("#booster-select").val());
  var usedBoosters = selectedBoosters - this.selectedBoosters;
  // this adds previously used boosters back to the arsenal
  race.updatePickup("booster", usedBoosters);
  race.updatePossiblePositions(selectedBoosters+1);
  this.selectedBoosters = selectedBoosters;
}

BoosterMenu.prototype.displayBoosterSelect = function() {
  $("#booster-select").removeClass("hidden");
}

BoosterMenu.prototype.hideBoosterSelect = function() {
  $("#booster-select").addClass("hidden");
}

BoosterMenu.prototype.addBoosterMenuListeners = function() {
  document.getElementById("booster-select").addEventListener("change", this);
}

BoosterMenu.prototype.disable = function() {
  this.removeBoosterMenuListeners();
  this.hideBoosterSelect();
}

BoosterMenu.prototype.removeBoosterMenuListeners = function() {
  document.getElementById("booster-select").removeEventListener("change", this);
}

