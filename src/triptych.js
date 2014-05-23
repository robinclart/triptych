(function ($) {

  var Triptych;

  Triptych = (function () {

    var log, defaults, constructor, cpi, wrap, ready;

    // Convenience function for logging stuff into the console when DEBUG
    // is set to true.
    log = function () {
      if (window.DEBUG && console) console.log.apply(console, arguments);
    }

    defaults = {
      "csstransitions": (!!Modernizr && Modernizr.csstransitions),
      "wrapper": {
        "template": "<div></div>",
        "css": {
          "overflow": "hidden"
        }
      }
    };

    constructor = function (element, options) { var self = this;
      var images;
      self.settings = $.extend(true, defaults, options);
      self.element = $(element);
      self.images = $([]);
      self.margins = [];
      self.originalImages = self.element.find("img");
      self.element.width(0);
      self.imageCount = 0;
      self.index = 1;
      wrap.apply(self);

      self.originalImages.on("load.triptych", function () {
        self.addImage(this);
        self.trigger("addimage");
        self.checkIfReady();
      })

      self.originalImages.on("error.triptych", function () {
        self.removeImage(this);
        self.trigger("removeimage");
        self.checkIfReady();
      });

      self.trigger("init");
    }

    cpi = constructor.prototype;

    cpi.trigger = function (eventName) { var self = this;
      var fullEventName;
      fullEventName = eventName + ".triptych";

      log("Event triggered: " + fullEventName)
      self.element.trigger(fullEventName);
    }

    cpi.checkIfReady = function () { var self = this;
      if (self.originalImages.length == self.images.length) {
        ready.apply(self);
      }
    }

    cpi.centerImage = function (index) { var self = this;
      var image, position, transition;
      image = self.images.eq(index);
      self.index = index;
      position = index + 1;
      transition = { "marginLeft": self.margins[index] };

      if (position == self.images.length) {
        self.trigger("lastimage");
      } else if (position == 1) {
        self.trigger("firstimage");
      }

      self.trigger("moveimages");

      if (self.settings.csstransitions) {
        self.element.css(transition);
      } else {
        self.element.animate(transition, 200);
      }
    }

    cpi.addImage = function (imageElement) { var self = this;
      var image;
      image = $(imageElement);
      self.imageCount = self.imageCount + 1;
      self.images = self.images.add(image);
      self.element.width(self.element.width() + image.width());
    }

    cpi.removeImage = function (imageElement) { var self = this;
      var image;
      image = $(imageElement);
      image.hide();
      self.originalImages = self.element.find("img:visible");
    }

    cpi.measure = function () { var self = this;
      var offset;
      offset = 0
      self.width = self.wrapper.width();
      self.images.each(function(index) {
        var image, width;
        image = $(this);
        width = image.width();
        self.margins[index] = -1 * (offset + Math.ceil((width - self.width) / 2));
        offset = offset + width;
      });
      self.element.width(offset);
    }

    wrap = function() { var self = this;
      self.wrapper = $(self.settings.wrapper.template);
      self.wrapper.css(self.settings.wrapper.css)
      self.element.after(self.wrapper);
      self.wrapper.prepend(self.element);
    }

    ready = function() { var self = this;
      $(window).on("resize.triptych", function () {
        self.measure();
        self.centerImage(self.index);
      });

      self.element.on("click.triptych", "img", function () {
        self.centerImage(self.images.index(this));
      });

      $(window).triggerHandler("resize.triptych");
      self.trigger("ready.triptych");
    }

    return constructor;

  })();

  window.Triptych = Triptych;

  // jQuery Interface
  $.fn.triptych = function (options) {
    return this.each(function () {
      $(this).data("triptych", new Triptych(this, options));
    });
  };

}(jQuery));
