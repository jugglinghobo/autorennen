function Pickup(tile, id) {
  this.id = id;
  this.x = tile.x+1;
  this.y = tile.y+1;
  this.size = tile.size - 1;
  this.image = new Image();
  this.pickupSources;
  this.loadSources();
  this.image.src = this.pickupSources[id];
}

Pickup.prototype.render = function(context) {
  var pickup = this;
  if (this.image.complete) {
    context.drawImage(pickup.image, pickup.x, pickup.y, pickup.size, pickup.size);
  } else {
    this.image.onload = function() {
      context.drawImage(pickup.image, pickup.x, pickup.y, pickup.size, pickup.size);
    };
  }
}

Pickup.prototype.loadSources = function() {
  var pickupIds = ["pickup-finish", "pickup-booster", "pickup-rocket", "pickup-mine"]
  this.pickupSources = {};

  var pickup = this;
  pickupIds.forEach(function(id) {
    var name = id.replace(/pickup-/g, '');
    pickup.pickupSources[id] = "/images/"+name+".png"
  });
}
