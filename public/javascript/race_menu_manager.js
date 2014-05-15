function RaceMenuManager(race) {
  this.race = race;
  this.track = race.track;
  this.canvas = this.track.canvas;
  this.activeMenu = new MoveMenu(this.race, this.canvas);
}
