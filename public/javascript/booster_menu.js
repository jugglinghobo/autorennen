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

  this.activateBoosterSelect();
  this.addBoosterMenuListeners();
}

BoosterMenu.prototype.useBooster = function() {
  var boosterCount = Number($("#booster-select").val());
  this.race.useBoosters(boosterCount);
  // select movement menu
  $("#move").trigger("click");
}

BoosterMenu.prototype.activateBoosterSelect = function() {
  $("#booster-select").prop("disabled", false);
}

BoosterMenu.prototype.deactivateBoosterSelect = function() {
  $("#booster-select").prop("disabled", true);
}

BoosterMenu.prototype.addBoosterMenuListeners = function() {
  document.getElementById("booster-select").addEventListener("change", this);
}

BoosterMenu.prototype.disable = function() {
  this.removeBoosterMenuListeners();
  this.deactivateBoosterSelect();
}

BoosterMenu.prototype.removeBoosterMenuListeners = function() {
  document.getElementById("booster-select").removeEventListener("change", this);
}

