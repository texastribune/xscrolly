//
// To fake scrolling in tests, do:
//
//     $container.scrollTop(TARGET_HEIGHT * 20); xsy.process();
//
// to bypass event handling and callback throttling.

var $container,
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


module('todo', {
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
  equal(xsy.active, xsy.$targets[0],
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

test('active property is updated on scroll', function() {
  var xsy = new XScrollY({
    container: $container,
    targets: '#qunit-fixture li',
    change: countChange
  });

  equal(xsy.$scrollElement.scrollTop(), 0,
    "container should start scrolled to the top");
  equal(xsy.active, xsy.$targets[0],
    "the first target should be active");
  $container.scrollTop(TARGET_HEIGHT * 3); xsy.process();
  equal(xsy.active.innerHTML, xsy.$targets[3].innerHTML,
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
  equal(xsy.active.innerHTML, xsy.$targets[3].innerHTML,
    "the third target should be active");
  equal(n_changeFired, 1);
});
