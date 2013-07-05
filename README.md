# xscrolly.js

When `X` gets scrolled... do `Y`.

This was created because we have a general desire to want to do stuff depending
on the scroll position, and only found specific libraries for doing specific
things. This library on its own does nothing. You have to give it a set of
targets, and a event callbacks for what to do when those targets scroll past. If
you have a library that already works, use it. If you have a library that
doesn't work... you might want to consider adapting it to use this underneath so
you can write your own code specific to your situation.


## Options

```JavaScript
// setup options: these can only be set once
container: window,     // scroll container, should also be an offset parent
targets: 'section',    // selector for the targets

// configuration options
updateOffsets: 0,      // force script to re-calculate offsets:
                       //   0 (default)   calculate only the first time
                       //   1             re-calculate after `unveil`
                       //   2             re-calculate after `change`
                       //   3             re-calculate every scroll
offset: 0,             // pixels from the top of the page to set the origin
throttle: 200          // milliseconds to de-bounce the scroll event
```

## Events

To actually do something, you have to set up at least one event callback.

Event callbacks have the general function prototype:

    function($el)

Where `$el` is the object(s) immediately above the the origin line (typically
the top of the screen), and `this` is the instance of XScrollY. Note that `$el`
is not the same as `this.$active`.

Events are fired in this order:

1. `unveil`
2. `change`
3. `scroll`

### `unveil`

Scroll has changed focus from one element to another for the first time.
Example:

```JavaScript
// mark target as read
function($el) {
  $el.addClass('read');
}
```

### `change`

Scroll has changed focus from one element to another. Example:

```JavaScript
// mark target as active
function($el) {
  this.$active.removeClass('active');
  $el.addClass('active');
}
```

### `scroll`

Captured a scroll event. This isn't that useful, but if you want a de-bounced
scroll event listener, you can use this. Example:


```JavaScript
// decorate all visible images
function($el) {
  this.visible($('img')).css('border', '1px solid #' + Math.floor(Math.random() * 16777215).toString(16));
}
```


## Properties

* `$active`: The currently active element(s)


## Methods

These are methods you can use on `this` inside the event callbacks:

* `visible()`  Get the targets visible on screen
* `above()`    Get the targets above the *top* of the screen
* `aboves()`   Get the targets above the *bottom* of the screen
* `below()`    Get the targets below the *top* of the screen
* `belows()`   Get the targets below the *bottom* of the screen

Arguments:

  1. `offset`    Fudge the origin this many pixels down, stacks with `offset` option.
  2. `bleed`     Fudge the boundaries out this many pixels.
  3. `$targets`  Don't use the internal targets, define a new set.

Usage:

```JavaScript
visible();
visible(offset);
visible(offset, bleed);
visible(offset, bleed, $targets);
visible($targets);
```


## jquery-xscrolly.sj

This can also be used as a jQuery plugin:

    $('section').xscrolly({});

And the instance can be found on $(el).data('xscrolly');


## Live Demos

* http://texastribune.github.io/xscrolly/examples/basic.html
* http://texastribune.github.io/xscrolly/examples/lazyimg.html
* http://texastribune.github.io/xscrolly/examples/offset.html
* http://texastribune.github.io/xscrolly/examples/spy.html
