//
// To fake scrolling in tests, do:
//
//     $container.scrollTop(TARGET_HEIGHT * 20); xsy.process();
//
// to bypass event handling and callback throttling.

var $container,
    xsy,
    TARGET_HEIGHT = 20,
    n_changeFired = 0,  // number of times `change` was fired if set up
    countChange = function() { ++n_changeFired; };

test('basic properties are set after init', function() {
  var xsy = new XScrollY({
    targets: '#qunit-fixture li'
  });

  ok(xsy.$scrollElement.length);
  ok(xsy.$targets.length);
  equal(xsy.$targets.length, $('#qunit-fixture li').length);
  equal(xsy.$targets.length, xsy.offsets.length);
});


module('basics', {
  setup: function() {
    n_changeFired = 0;
    $container = $('#qunit-fixture ul');
  }
});

test('change event fires', function() {
  var xsy = new XScrollY({
    container: $container,
    targets: '#qunit-fixture li',
    change: countChange
  });

  equal(xsy.$scrollElement.scrollTop(), 0,
    "container should start scrolled to the top");
  equal(xsy.$active[0], xsy.$targets[0],
    "the first target should be active");
  $container.scrollTop(TARGET_HEIGHT * 3);
  equal(xsy.$scrollElement.scrollTop(), TARGET_HEIGHT * 3);
  equal(n_changeFired, 1);
});

test('change event fires twice', function() {
  var xsy = new XScrollY({
    container: $container,
    targets: '#qunit-fixture li',
    change: countChange
  });

  $container.scrollTop(TARGET_HEIGHT * 20); xsy.process();
  equal(n_changeFired, 2);
});

test('getActiveOffset', function() {
  xsy = new XScrollY({
    container: $container,
    targets: '#qunit-fixture li'
  });
  equal(xsy.activeOffset, TARGET_HEIGHT * 0,
    "Scroll depth: " + $container.scrollTop());
  $container.scrollTop(TARGET_HEIGHT / 2); xsy.process();
  equal(xsy.activeOffset, TARGET_HEIGHT * 0,
    "Scroll depth: " + $container.scrollTop());
  $container.scrollTop(TARGET_HEIGHT); xsy.process();
  equal(xsy.activeOffset, TARGET_HEIGHT,
    "Scroll depth: " + $container.scrollTop());
  $container.scrollTop(TARGET_HEIGHT * 2 - 1); xsy.process();
  equal(xsy.activeOffset, TARGET_HEIGHT,
    "Scroll depth: " + $container.scrollTop());
  $container.scrollTop(TARGET_HEIGHT * 2 + 1); xsy.process();
  equal(xsy.activeOffset, TARGET_HEIGHT * 2,
    "Scroll depth: " + $container.scrollTop());
});

test('scroll', function() {
  var n_scrollFired = 0;
  xsy = new XScrollY({
    container: $container,
    targets: '#qunit-fixture li',
    change: countChange,
    scroll: function() {
      ++n_scrollFired;
    }
  });

  equal(n_changeFired, 1);
  equal(n_scrollFired, 1);
  $container.scrollTop(TARGET_HEIGHT / 2); xsy.process();
  equal(n_changeFired, 1);
  equal(n_scrollFired, 2);
  $container.scrollTop(TARGET_HEIGHT); xsy.process();
  equal(n_changeFired, 2);
  equal(n_scrollFired, 3);
  $container.scrollTop(TARGET_HEIGHT * 3 / 2); xsy.process();
  equal(n_changeFired, 2);
  equal(n_scrollFired, 4);
});

test('active property is updated on scroll', function() {
  xsy = new XScrollY({
    container: $container,
    targets: '#qunit-fixture li',
    change: countChange
  });

  equal(xsy.$scrollElement.scrollTop(), 0,
    "container should start scrolled to the top");
  equal(xsy.$active[0], xsy.$targets[0],
    "the first target should be active");
  $container.scrollTop(TARGET_HEIGHT * 3); xsy.process();
  equal(xsy.$active[0].innerHTML, xsy.$targets[3].innerHTML,
    "the third target should be active");
  equal(n_changeFired, 2);
});

test('offset option works', function() {
  var xsy = new XScrollY({
    container: $container,
    offset: TARGET_HEIGHT * 3,
    targets: '#qunit-fixture li',
    change: countChange
  });

  equal($container.find('li').height(), TARGET_HEIGHT,
    "TARGET_HEIGHT variable should be the same as <li> height for testing");
  equal(xsy.$scrollElement.scrollTop(), 0,
    "container should start scrolled to the top");
  equal(xsy.$active[0].innerHTML, xsy.$targets[3].innerHTML,
    "the third target should be active");
  equal(n_changeFired, 1);
});

test('unveil is only called once', function() {
  var n_unveilFired = 0;
  var xsy = new XScrollY({
    container: $container,
    targets: '#qunit-fixture li',
    change: countChange,
    unveil: function($e) {
      ++n_unveilFired;
    }
  });

  equal(n_changeFired, 1);
  equal(n_unveilFired, 1);
  $container.scrollTop(TARGET_HEIGHT * 3); xsy.process();
  equal(n_changeFired, 2);
  equal(n_unveilFired, 2);
  $container.scrollTop(TARGET_HEIGHT * 6); xsy.process();
  equal(n_changeFired, 3);
  equal(n_unveilFired, 3);
  $container.scrollTop(TARGET_HEIGHT * 0); xsy.process();
  equal(n_changeFired, 4);
  equal(n_unveilFired, 3);
  $container.scrollTop(TARGET_HEIGHT * 3); xsy.process();
  equal(n_changeFired, 5);
  equal(n_unveilFired, 3);
  $container.scrollTop(TARGET_HEIGHT * 6); xsy.process();
  equal(n_changeFired, 6);
  equal(n_unveilFired, 3);
});

test('start', function() {
  var startActive;
  xsy = new XScrollY({
    container: $container,
    targets: '#qunit-fixture li',
    start: function($el) {
      startActive = $el;
      this.visible().html('x');
    }
  });
  equal(startActive[0], xsy.$targets[0]);  // This may change in the future.
  equal(xsy.$targets.text(), 'xxxxxxxxxxABCDEFGHIJKLMNOPQRSTUVWXYZ');
});

test('event callback args', function() {
  var changeActive, changeOldActive,
      unveilActive, unveilOldActive,
      scrollActive, scrollOldActive;
  xsy = new XScrollY({
    container: $container,
    targets: '#qunit-fixture li'
  });

  equal(xsy.$active[0], xsy.$targets[0],
    "the first target should be active");
  xsy.option('change', function($el) { changeActive = $el; changeOldActive = this.$active; });
  xsy.option('unveil', function($el) { unveilActive = $el; unveilOldActive = this.$active; });
  xsy.option('scroll', function($el) { scrollActive = $el; scrollOldActive = this.$active; });
  $container.scrollTop(TARGET_HEIGHT * 3); xsy.process();

  equal(changeActive.text(), '3');
  equal(changeOldActive.text(), '0');

  equal(unveilActive.text(), '3');
  equal(unveilOldActive.text(), '0');

  equal(scrollActive.text(), '3');
  equal(scrollOldActive.text(), '0');
});


module('target selection', {
  setup: function() {
    $container = $('#qunit-fixture ul');
    xsy = new XScrollY({
      container: $container,
      targets: '#qunit-fixture li'
    });
  }
});

test('slice -  slicing at the limits returns all', function() {
  total = xsy.$targets.length;
  equal(xsy.slice(-Infinity, Infinity).length, total);
  equal(xsy.slice(0, Infinity).length, total);
});

test('visible', function() {
  equal(xsy.visible().text(), '0123456789');
  $container.scrollTop(TARGET_HEIGHT * 3); xsy.process();
  equal(xsy.visible().text(), '3456789ABC');

  equal(xsy.visible(TARGET_HEIGHT * 2).text(), '56789ABCDE');
  equal(xsy.visible(TARGET_HEIGHT * 2, TARGET_HEIGHT).text(), '456789ABCDEF');
});

test('above', function() {
  equal(xsy.above().text(), '');
  $container.scrollTop(TARGET_HEIGHT * 3); xsy.process();
  equal(xsy.above().text(), '012');

  equal(xsy.above(TARGET_HEIGHT * 2).text(), '01234');
  equal(xsy.above(TARGET_HEIGHT * 2, TARGET_HEIGHT).text(), '012345');
});

test('aboves', function() {
  equal(xsy.aboves().text(), '0123456789');
  $container.scrollTop(TARGET_HEIGHT * 3); xsy.process();
  equal(xsy.aboves().text(), '0123456789ABC');

  equal(xsy.aboves(TARGET_HEIGHT * 2).text(), '0123456789ABCDE');
  equal(xsy.aboves(TARGET_HEIGHT * 2, TARGET_HEIGHT).text(), '0123456789ABCDEF');
});

test('below', function() {
  equal(xsy.below().text(), '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  $container.scrollTop(TARGET_HEIGHT * 3); xsy.process();
  equal(xsy.below().text(), '3456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');

  equal(xsy.below(TARGET_HEIGHT * 2).text(), '56789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  equal(xsy.below(TARGET_HEIGHT * 2, TARGET_HEIGHT).text(), '456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
});

test('belows', function() {
  equal(xsy.belows().text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  $container.scrollTop(TARGET_HEIGHT * 3); xsy.process();
  equal(xsy.belows().text(), 'DEFGHIJKLMNOPQRSTUVWXYZ');

  equal(xsy.belows(TARGET_HEIGHT * 2).text(), 'FGHIJKLMNOPQRSTUVWXYZ');
  equal(xsy.belows(TARGET_HEIGHT * 2, TARGET_HEIGHT).text(), 'EFGHIJKLMNOPQRSTUVWXYZ');
});

test('slice with custom targets', function() {
  // using .visible

  equal(xsy.visible().text(), '0123456789');
  equal(xsy.visible(0).text(), '0123456789');
  equal(xsy.visible(0, 0, xsy.$targets).text(), '0123456789');
  equal(xsy.visible(0, 0, xsy.$targets.filter(':nth-child(odd)')).text(), '02468');
  equal(xsy.visible(0, 0, xsy.$targets.filter(':nth-child(even)')).text(), '13579');
  // shortcut syntax
  equal(xsy.visible(xsy.$targets).text(), '0123456789');
});


module('multiple columns', {
  setup: function() {
    $container = $('#qunit-fixture ul');
    $('#qunit-fixture li').css({
      float: 'left',
      width: '50%'
    });
    xsy = new XScrollY({
      container: $container,
      targets: '#qunit-fixture li'
    });
  }
});

test('$active is multiple elements', function() {
  equal(xsy.$active.text(), '01');
  $container.scrollTop(TARGET_HEIGHT * 2); xsy.process();
  equal(xsy.$active.text(), '45');
  equal(xsy.above().text(), '0123');
  equal(xsy.visible().text(), '456789ABCDEFGHIJKLMN');
  equal(xsy.belows().text(), 'OPQRSTUVWXYZ');
});
