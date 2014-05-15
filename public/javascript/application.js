$(document).ready(function() {
  $("#login").on("click", function(e) {
    e.preventDefault();
    var input = $("#username");
    input.focus();
  });
});

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
