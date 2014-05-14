$(document).ready(function() {
  ColorPicker.initialize();
});

var ColorPicker = function() {
  var initColorPicker = function() {
    $(".color input").colorpicker().on("changeColor", function(ev) {
      $(this).val(ev.color.toHex());
      $(this).parents(".input-group").find(".dropdown-toggle").css("background-color", ev.color.toHex());
    });
    $(".color .dropdown-toggle").on("click", function() {
      $("#user-color").colorpicker("show");
    });
  }

  return {
    initialize: function() {
      initColorPicker();
    }
  }
}();

