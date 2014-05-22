Pickup.types = ["finish", "booster", "rocket", "mine"];

function Pickup(race, type, x, y, size) {
  this.type = type;
  this.x = x;
  this.y = y;
  this.size = size;
  this.image = new Image();
  this.pickupSources;
  this.loadSources();
  this.image.src = this.pickupSources[type];
}


Pickup.prototype.positions = function() {
  var positions = [];
  positions.push({x: this.x, y: this.y});
  positions.push({x: this.x+this.size, y: this.y});
  positions.push({x: this.x, y: this.y+this.size});
  positions.push({x: this.x+this.size, y: this.y+this.size});
  return positions;
}

Pickup.prototype.toJson = function() {
  var jsonPickup = {};
  jsonPickup["type"] = this.type;
  jsonPickup["x"] = this.x;
  jsonPickup["y"] = this.y;
  return jsonPickup;
}

// ===================================
// INITIALIZING
// ===================================

Pickup.prototype.loadSources = function() {
  this.pickupSources = {};

  var pickup = this;
  Pickup.types.forEach(function(type) {
    pickup.pickupSources[type] = "/images/"+type+".png"
  });
}

// ====================================
// RENDERING
// ====================================

Pickup.prototype.render = function(context) {
  var pickup = this;
  if (this.image.complete) {
    pickup.drawImage(context);
  } else {
    this.image.onload = function() {
      pickup.drawImage(context);
    };
  }
}

Pickup.prototype.drawImage = function(context) {
  context.drawImage(this.image, this.x+1, this.y+1, this.size-1, this.size-1);
}

