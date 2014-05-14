$(document).ready(function() {
  var trackId = $("#track-id").val();
  var track = new Track(trackId);
  var trackForm = new TrackForm(track);
});

function TrackForm(track) {
  this.track = track;
  this.menuManager = new MenuManager(track);
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
      dataType: "json",
      method: 'POST',
      data: data,
    }).success(function(data) {
      if (data.error) {
        handleError(data);
      } else {
        var id = data.id;
        var url = "/tracks/"+id+"/edit";

        window.location.href = url;
      };
    }).error(function(data) {
      handleError(data);
    });
  });
}

TrackForm.prototype.prepareTrackData = function() {
  var data = {};
  data["track"] = {};
  data["track"]["id"] = $("#track-id").val();
  data["track"]["name"] = $("#track-name").val();
  data["track"]["creator_id"] = $("#track-creator-id").val();
  data["track"]["tiles"] = this.track.tiles();
  return data;
}
