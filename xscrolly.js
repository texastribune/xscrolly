// alpha scroll event hook
// XScrollY: When X gets scrolled... do Y
// Set up a notification for when targets get scrolled to (top of the viewport).
// Trying to follow this scrollspy implementation as a rough guide:
// https://github.com/twitter/bootstrap/blob/master/js/bootstrap-scrollspy.js
//

/*jshint expr:true*/

// define(['jquery', 'underscore'], function($, _) {
  var defaultOptions = {
    alwaysRefresh: false,  // force script to re-calculate offsets every time
    offset: 0,             // pixels from the top of the page to set origin
    targets: 'section',    // selector for the targets (standalone)
    throttle: 200          // milliseconds to de-bounce the scroll event
  };

  function XScrollY(options) {
    var self = this;
    this._seen = [];
    this.options = $.extend({}, defaultOptions, options || {});
    this.$scrollElement = $(window);
    this.$targets = $(this.options.targets);
    this.offsets = this.$targets.map(function() { return $(this).position().top; });
    // TODO assert offets are monotonic increasing
    this.$scrollElement.on('scroll',
      _.throttle(function() { self.process.call(self); }, this.options.throttle));
    this.process();
  }

  // because target positions keep changing
  XScrollY.prototype.refresh = function() {
    this.offsets = this.$targets.map(function() { return $(this).position().top; });
  };

  // Find the *one* element directly above the origin (should it just be one?)
  XScrollY.prototype.getActive = function() {
    var scrollTop = this.$scrollElement.scrollTop() + this.options.offset,
        i = 1, n = this.offsets.length;
    if (scrollTop < this.offsets[0]) {
      return this.$targets.eq(0);
    }
    for (; i < n; ++i) {
      if (scrollTop < this.offsets[i]) {
        return this.$targets.eq(i - 1);
      }
    }
    return this.$targets.eq(n - 1);
  };

  // Callback for the scroll event
  XScrollY.prototype.process = function() {
    if (this.options.alwaysRefresh) {
      this.refresh();
    }
    var $active = this.getActive();
    if (this.active != $active[0]) {
      this.change($active);
      this.active = $active[0];
    }
  };

  // when target changes
  XScrollY.prototype.change = function($active) {
    if (_.indexOf(this._seen, $active[0]) == -1) {
      this._seen.push($active[0]);
      this.one($active);
    }
    // console.log("change", $active)
    this.options.change && this.options.change.call(this, $active);
  };

  // when target changes the first time
  XScrollY.prototype.one = function($active) {
    // console.log("one", $active)
    this.options.one && this.options.one.call(this, $active);
  };


  // METHODS

  XScrollY.prototype.disable = function() {
    // TODO
  };
  XScrollY.prototype.enable = function() {
    // TODO
  };

  // HELPER METHODS
  //
  // to get elements based purely on internally stored offsets

  // get elements between `top` and `bottom` scroll depth.
  XScrollY.prototype.slice = function(top, bottom) {
    var i = 0, n = this.offsets.length,
        $ret = $(),
        off;
    for (; i < n; ++i) {
      off = this.offsets[i];
      if (top < off && off < bottom) {
        $ret = $ret.add(this.$targets[i]);
      }
    }
    return $ret;
  };

  // get all targets visible on screen
  //
  // arguments:
  //
  //   localOffset    (default: 0) shift the viewport down this many pixels.
  //                  Useful if you need to counter a global offset.
  //   bleed          (default: 0) Extend the viewport this many pixels. Just
  //                  like how bleed works in print.
  //
  XScrollY.prototype.visible = function(localOffset, bleed) {
    localOffset = localOffset || 0;
    bleed = bleed || 0;
    var scrollTop = this.$scrollElement.scrollTop(),
        scrollBottom = scrollTop + this.$scrollElement.height();
    return this.slice(scrollTop + this.options.offset + localOffset - bleed,
        scrollBottom + this.options.offset + localOffset + bleed);
  };

  // get all targets above
  XScrollY.prototype.above = function(localOffset, bleed) {
    localOffset = localOffset || 0;
    bleed = bleed || 0;
    var origin = this.$scrollElement.scrollTop();
    return this.slice(0,
        origin + this.options.offset + localOffset + bleed);
  };

  // get all targets below
  XScrollY.prototype.below = function(localOffset, bleed) {
    localOffset = localOffset || 0;
    bleed = bleed || 0;
    var origin = this.$scrollElement.scrollTop();
    return this.slice(origin + this.options.offset + localOffset - bleed,
      Infinity);
  };

  // set an option: `option('offset', 100)`
  // set several options: `option({offset: 100, throttle: 1000})`
  XScrollY.prototype.option = function(key, value) {
    if (typeof key === 'object' && typeof value === 'undefined') {
      $.extend(this.options, key);
    } else {
      this.options[key] = value;
    }
  };



  // jQuery plugin
  $.fn.xscrolly = function(options, key, value) {
    if (options === 'option') {
      this.data('xscrolly').option(key, value);
    } else {
      options.targets = this;
      this.data('xscrolly', new XScrollY(options));
    }
    return this;
  };
// });
