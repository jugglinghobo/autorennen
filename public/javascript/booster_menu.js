function BoosterMenu(race) {
  this.race = race;
  this.boosterOptions;
  this.selectedBoosters = 0;
  this.handleEvent = function(event) {
    switch(event.type) {
      case 'change':
        this.useBooster();
      break;
    }
  }

  this.addBoosterMenuListeners();
}

BoosterMenu.prototype.useBooster = function() {
  var boosterCount = Number($("#booster-select").val());
  this.race.useBoosters(boosterCount);
  // select movement menu
  $("#booster-select").trigger("blur");
  $("#move").trigger("click");
}

BoosterMenu.prototype.addBoosterMenuListeners = function() {
  document.getElementById("booster-select").addEventListener("change", this);
}

BoosterMenu.prototype.disable = function() {
  this.removeBoosterMenuListeners();
}

BoosterMenu.prototype.removeBoosterMenuListeners = function() {
  document.getElementById("booster-select").removeEventListener("change", this);
}

