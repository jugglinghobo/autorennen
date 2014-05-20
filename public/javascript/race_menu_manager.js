function RaceMenuManager(race) {
  this.race = race;
  this.track = race.track;
  this.canvas = this.track.canvas;
  if (debugging || (race.currentUser.id == race.activePlayer.id)) {
  this.activeMenu = new MoveMenu(this.race, this.canvas);
  };
}
