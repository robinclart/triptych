(function (window, $) {
  $(document).on("ready", function () {

    window.DEBUG = $("[data-debug]").length;
    slider = $(".slides").triptych();

  });
})(window, jQuery);
