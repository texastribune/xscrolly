
test('basic properties are set after init', function() {
  var xsy = new XScrollY({
    targets: '#qunit-fixture li'
  });

  ok(xsy.$scrollElement.length);
  ok(xsy.$targets.length);
  equal(xsy.$targets.length, $('#qunit-fixture li').length);
  equal(xsy.$targets.length, xsy.offsets.length);
});
