$(document).ready(function() {
  var trackId = $("#track-id").val();
  var track = new Track(trackId);
  var trackForm = new TrackForm(track);
});

function TrackForm(track) {
  this.track = track;
  this.menuManager = new TrackMenuManager(track);
  this.initialize();
}

TrackForm.prototype.initialize = function() {
  this.initializeFormListeners();
}

TrackForm.prototype.initializeFormListeners = function() {
  var trackForm = this;

  // add cmd+s keyboard save listener
  document.addEventListener("keydown", function(e) {
    if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey))      {
      e.preventDefault();
      $("#track-form").submit();
    };
  }, false);

  // submit form via ajax on submit
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

  $("#delete-track-form").on("submit", function() {
    return confirm("This can not be undone. Delete track?")
  });
}

TrackForm.prototype.prepareTrackData = function() {
  var data = {};
  data["track"] = {};
  data["track"]["id"] = $("#track-id").val();
  data["track"]["name"] = $("#track-name").val();
  data["track"]["columns"] = $("#track-columns").val();
  data["track"]["rows"] = $("#track-rows").val();
  data["track"]["user_id"] = $("#track-user-id").val();
  data["track"]["tiles"] = this.track.tiles();
  return data;
}
