Item.types = ["activeMine"];

function Item(race, type, x, y, size) {
  this.race = race;
  this.type = type;
  this.x = x;
  this.y = y;
  this.size = size;
  this.image = new Image();
  this.itemSources;
  this.loadSources();
  this.image.src = this.itemSources[type];
}

Item.prototype.positions = function() {
  var positions = [];
  positions.push({x: this.x, y: this.y});
  positions.push({x: this.x+this.size, y: this.y});
  positions.push({x: this.x, y: this.y+this.size});
  positions.push({x: this.x+this.size, y: this.y+this.size});
  return positions;
}

Item.prototype.toJson = function() {
  var jsonItem = {};
  jsonItem["type"] = this.type;
  jsonItem["x"] = this.x;
  jsonItem["y"] = this.y;
  jsonItem["size"] = this.size;
  return jsonItem;
}

// ===================================
// INITIALIZING
// ===================================

Item.prototype.loadSources = function() {
  this.itemSources = {};

  var item = this;
  Item.types.forEach(function(type) {
    item.itemSources[type] = "/images/"+type+".png"
  });
}

// ====================================
// RENDERING
// ====================================


Item.prototype.render = function(context) {
  var item = this;
  if (this.image.complete) {
    item.drawImage(context);
  } else {
    this.image.onload = function() {
      item.drawImage(context);
    };
  }
}

Item.prototype.drawImage = function(context) {
  context.drawImage(this.image, this.x+1, this.y+1, this.size-1, this.size-1);
}

