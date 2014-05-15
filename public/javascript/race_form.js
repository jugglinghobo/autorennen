$(document).ready(function() {
  var raceId = $("#race-id").val();
  var race = new Race(raceId);
  var raceForm = new RaceForm(race);
});

function RaceForm(race) {
  this.race = race;
  this.menuManager = new RaceMenuManager(race);
  this.initializeFormListeners();
}

RaceForm.prototype.initializeFormListeners = function() {
  var raceForm = this;
  // add cmd+s key listener
  document.addEventListener("keydown", function(e) {
    if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey))      {
      e.preventDefault();
      $("#race-form").submit();
    };
  }, false);

  $("#race-form").on("submit", function(e) {
    e.preventDefault();
    var path = $(this).attr("action");
    var data = raceForm.prepareTrackData();
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
        var url = "/races/"+id+"";

        window.location.href = url;
      };
    }).error(function(data) {
      handleError(data);
    });
  });

  $("#delete-race-form").on("submit", function() {
    return confirm("This can not be undone. Delete race?")
  });
}

RaceForm.prototype.prepareTrackData = function() {
  var data = {};
  data["race"] = {};
  data["race"]["positions"] = this.race.positions;
  return data;
}
