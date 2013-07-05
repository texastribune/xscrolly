/*jshint expr:true*/

// define(['jquery', 'underscore'], function($, _) {
window.XScrollY = (function($, _) {
  "use strict";

  var defaultOptions = {
    // setup options: these can only be set once
    container: window,     // scroll container
    targets: 'section',    // selector for the targets

    // configuration options
    updateOffsets: 0,      // force script to re-calculate offsets:
                           //   0 (default)   calculate only the first time
                           //   1             re-calculate after `unveil`
                           //   2             re-calculate after `change`
                           //   3             re-calculate every scroll
    offset: 0,             // pixels from the top of the page to set the origin
    throttle: 200          // milliseconds to de-bounce the scroll event
  };

  function XScrollY(options) {
    var self = this;
    this._seen = [];
    this.options = $.extend({}, defaultOptions, options || {});
    this.$scrollElement = $(this.options.container);
    this.$targets = $(this.options.targets);
    this.updateOffsets();
    this.$scrollElement.on('scroll.xscrolly',
      _.throttle(function() { self.process.call(self); }, this.options.throttle));
    this.process();
  }

  // update the offsets cache and offset-to-target map, passed in by reference.
  XScrollY.prototype._updateOffsets = function($target, _offsets, _map) {
    $target.each(function(idx, target) {
      var offset = $(target).position().top;
      if (!_map[offset]) {
        _map[offset] = [];
      }
      _offsets.push(offset);
      _map[offset].push(target);
    });
    _offsets = _offsets.sort(function(a, b) { return a - b; });
  };

  // update target offset lookup
  XScrollY.prototype.updateOffsets = function() {
    var self = this;
    this.offsets = [];
    this.offsetMap = {};
    this._updateOffsets(this.$targets, this.offsets, this.offsetMap);
  };

  // get the active offset for the current scroll depth
  XScrollY.prototype.getActiveOffset = function() {
    var scrollTop = this.$scrollElement.scrollTop() + this.options.offset,
        i = 0, n = this.offsets.length;
    for (; i < n; ++i) {
      if (scrollTop < this.offsets[i]) {
        return this.offsets[Math.max(0, i - 1)];
      }
    }
    return this.offsets[n - 1];
  };

  // Find target(s) directly above the origin. If there are multiple targets at
  // the same vertical position, return all of them.
  XScrollY.prototype.getActive = function() {
    var offset = this.getActiveOffset();
    this.activeOffset = offset;
    return $(this.offsetMap[offset]);
  };


  // EVENTS

  // Callback for the scroll event
  XScrollY.prototype.process = function() {
    if (this.options.updateOffsets === 3) {
      this.updateOffsets();
    }
    var oldActiveOffset = this.activeOffset,
        $active = this.getActive();  // this.activeOffset gets set in here :(
    if (this.activeOffset != oldActiveOffset) {
      this.change($active);
    }
    this.options.scroll && this.options.scroll.call(this, $active);
    this.$active = $active;
  };

  // when target scope changes
  XScrollY.prototype.change = function($active) {
    if (this.options.updateOffsets === 2) {
      this.updateOffsets();
    }
    if (_.indexOf(this._seen, $active[0]) == -1) {
      this._seen.push($active[0]);
      this.unveil($active);
    }
    this.options.change && this.options.change.call(this, $active);
  };

  // when target scope changes for the first time
  XScrollY.prototype.unveil = function($active) {
    if (this.options.updateOffsets === 1) {
      this.updateOffsets();
    }
    this.options.unveil && this.options.unveil.call(this, $active);
  };


  // METHODS

  XScrollY.prototype.disable = function() {
    // TODO
    this.$scrollElement.off('.xscrolly');
  };
  XScrollY.prototype.enable = function() {
    // TODO
  };


  // HELPER METHODS
  //
  // to get elements based purely on internally stored offsets

  // get elements between `top` and `bottom` scroll depth.
  XScrollY.prototype.slice = function(top, bottom, $target) {
    var offsets = this.offsets,
        offsetMap = this.offsetMap;
    if ($target) {
      offsets = [];
      offsetMap = {};
      this._updateOffsets($target, offsets, offsetMap);
    }
    var i = 0, n = offsets.length,
        $ret = $(),
        off;
    for (; i < n; ++i) {
      off = offsets[i];
      if (top <= off && off < bottom) {
        $ret = $ret.add(offsetMap[off]);
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
  //   $targets       (default: undefined) Use a custom set of targets.
  //
  XScrollY.prototype.visible = function(localOffset, bleed, $targets) {
    localOffset = localOffset || 0;
    bleed = bleed || 0;
    var scrollTop = this.$scrollElement.scrollTop(),
        scrollBottom = scrollTop + this.$scrollElement.height();
    return this.slice(scrollTop + this.options.offset + localOffset - bleed,
        scrollBottom + this.options.offset + localOffset + bleed,
        $targets);
  };

  // get all targets above
  XScrollY.prototype.above = function(localOffset, bleed, $targets) {
    localOffset = localOffset || 0;
    bleed = bleed || 0;
    var origin = this.$scrollElement.scrollTop();
    return this.slice(0,
        origin + this.options.offset + localOffset + bleed,
        $targets);
  };

  // get all targets above origin + screen
  XScrollY.prototype.aboves = function(localOffset, bleed, $targets) {
    localOffset = localOffset || 0;
    bleed = bleed || 0;
    var origin = this.$scrollElement.scrollTop(),
        origins = origin + this.$scrollElement.height();
    return this.slice(0,
        origins + this.options.offset + localOffset + bleed,
        $targets);
  };

  // get all targets below
  XScrollY.prototype.below = function(localOffset, bleed, $targets) {
    localOffset = localOffset || 0;
    bleed = bleed || 0;
    var origin = this.$scrollElement.scrollTop();
    return this.slice(origin + this.options.offset + localOffset - bleed,
      Infinity,
      $targets);
  };

  // get all targets below screen
  XScrollY.prototype.belows = function(localOffset, bleed, $targets) {
    localOffset = localOffset || 0;
    bleed = bleed || 0;
    var origin = this.$scrollElement.scrollTop(),
        origins = origin + this.$scrollElement.height();
    return this.slice(origins + this.options.offset + localOffset - bleed,
      Infinity,
      $targets);
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

  return XScrollY;

})(window.jQuery, window._);
