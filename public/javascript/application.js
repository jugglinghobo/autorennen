$(document).ready(function() {
  $("#login").on("click", function(e) {
    e.preventDefault();
    var input = $("#username");
    input.focus();
  });
});
