// jQuery plugin version
//
/* globals $, XScrollY */
$.fn.xscrolly = function(options, key, value) {
  if (options === 'option') {
    this.data('xscrolly').option(key, value);
  } else {
    options.targets = this;
    this.data('xscrolly', new XScrollY(options));
  }
  return this;
};
