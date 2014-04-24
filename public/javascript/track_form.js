$(document).ready(function() {
  var trackId = $("#track-id").val();
  new TrackForm(trackId);
});

function TrackForm(id) {
  this.trackId = id;
  this.track = new Track();
  this.canvas = document.getElementById("track");

  this.mouseX;
  this.mouseY;
  this.drawing = false;
  this.trackBoundaries = [];

  this.initialize();
  window.canvas = this.canvas;
  window.trackForm = this;
}

TrackForm.prototype.initialize = function() {
  this.initializeFormListeners();
  this.initializeDrawListeners();
}

TrackForm.prototype.initializeFormListeners = function() {
  var trackForm = this;
  $("#track-form").on("submit", function(e) {
    e.preventDefault();
    var path = $(this).attr("action");
    var data = trackForm.prepareTrackData();
    $.ajax({
      url: path,
      dataType: 'json',
      method: 'POST',
      data: data,
    }).success(function(data) {
      trackForm.track.update(data);
    });
  });
}

TrackForm.prototype.prepareTrackData = function() {
  var data = {};
  data["track"] = {};
  data["track"]["id"] = $("#track-id").val();
  data["track"]["name"] = $("#track-name").val();
  data["track"]["creator"] = $("#track-creator").val();
  data["track"]["boundaries"] = this.track.boundaries;
  return data;
}

TrackForm.prototype.initializeDrawListeners = function() {
  var trackForm = this;

  this.canvas.addEventListener("mousedown", function(e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    trackForm.mouseX = mouseX;
    trackForm.mouseY = mouseY;
    trackForm.drawing = true;
    trackForm.addMousePosition(trackForm.mouseX, trackForm.mouseY, false);
  });

  this.canvas.addEventListener("mousemove", function(e) {
    if(trackForm.drawing) {
      var mouseX = e.pageX - this.offsetLeft;
      var mouseY = e.pageY - this.offsetTop;
      trackForm.addMousePosition(mouseX, mouseY, true);
    }
  });

  this.canvas.addEventListener("mouseup", function(e) {
    trackForm.drawing = false
  });

  this.canvas.addEventListener("mouseleave", function(e) {
    trackForm.drawing = false;
  });
}

TrackForm.prototype.addMousePosition = function(x, y, dragged) {
  this.track.addBoundaries({x: x, y: y, dragged: dragged})
  this.track.render();
}
