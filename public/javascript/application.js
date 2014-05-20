$(document).ready(function() {
  loadDebugging();
  initializeLoginAutofocus();
});

var loadDebugging = function() {
  $.ajax({
    url: '/debugging.json',
    dataType: 'json',
    async: false,
  }).success(function(data) {
    debugging = data['debugging'];
  });
}

var initializeLoginAutofocus = function() {
  $("#login").on("click", function(e) {
    setTimeout(function() {
      var input = $("#username");
      input.focus();
    }, 50);
  });
}

var handleError = function(data) {
  var message = data.message;
  if(!message) {
    message = "something bad happened. contact füzgü!"
  }
  $("#notifications").append(
      "<div class='notification alert alert-danger alert-dismissable'>"+
        "<button class=close data-dismiss=alert type=button>×</button>"+
        message+
      "</div>");
  $("#notifications").find(".notification").alert();
}
