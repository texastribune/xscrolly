// alpha scroll event hook
// XScrollY: When X gets scrolled to... do Y
// Set up a notification for when targets get scrolled to (top of the viewport).
// Trying to follow this scrollspy implementation as a rough guide:
// https://github.com/twitter/bootstrap/blob/master/js/bootstrap-scrollspy.js
//

/*jshint expr:true*/

// define(['jquery', 'underscore'], function($, _) {
  var defaultOptions = {
    offset: 0,           // pixels from the top of the page to set origin
    targets: 'section',  // selector for the targets
    throttle: 200
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

  XScrollY.prototype.process = function() {
    this.refresh();
    var $active = this.getActive();
    if (this.active != $active[0]) {
      this.change($active);
      this.active = $active[0];
    }
  };

  // when target changes
  XScrollY.prototype.change = function ($active) {
    if (_.indexOf(this._seen, $active[0]) == -1) {
      this._seen.push($active[0]);
      this.one($active);
    }
    console.log("change", $active)
    this.options.change && this.options.change($active);
  };

  // when target changes the first time
  XScrollY.prototype.one = function ($active) {
    console.log("one", $active)
    this.options.one && this.options.one($active);
  };
// });
