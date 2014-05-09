$(document).ready(function() {
  var trackId = $("#track").data("id");
  var track = new Track(trackId);
  var trackForm = new TrackForm(track);
});

function TrackForm(track) {
  this.track = track;
  this.trackMenu = new TrackMenu(track);
  this.initialize();
}

TrackForm.prototype.initialize = function() {
  this.initializeFormListeners();
}

TrackForm.prototype.initializeFormListeners = function() {
  var trackForm = this;
  $("#track-form").on("submit", function(e) {
    e.preventDefault();
    var path = $(this).attr("action");
    var data = trackForm.prepareTrackData();
    $.ajax({
      url: path,
      dataType: "html",
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
  data["track"]["tiles"] = this.track.tiles;
  return data;
}
