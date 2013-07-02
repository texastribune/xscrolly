# xscrolly.js

When `X` gets scrolled... do `Y`.

This was created because there's a general desire to want to do stuff depending
on the scroll position, and only specific libraries for doing just one thing.
This library on its own does nothing. You have to give it a set of targets, and
a callback for what to do. If you have a library that already works, use it. If
you have a library that doesn't work... you might want to consider adapting it
to use this underneath so you can write your own code specific to your
situation.


## Options

```JavaScript
alwaysRefresh: false,  // force script to re-calculate offsets every time
offset: 0,             // pixels from the top of the page to set origin
targets: 'section',    // selector for the targets (not used for jquery version)
throttle: 200          // milliseconds to de-bounce the scroll event
```

## Events

Event callbacks have the general function prototype:

    function($el)

Where `$el` is the object in view, `this` is the instance of XScrollY.

Events are fired in this order:

1. `one`
2. `change`

### `change`

Scroll has changed focus from one element to another.

### `one`

Scroll has changed focus from one element to another for the first time.


## Properties

* `active`: The currently active element


## Methods

These are methods you can use on `this` inside the event callbacks:

* `visible(offset, bleed)`: Get the targets visible on screen
* `above(offset, bleed)`: Get the targets above the top of the screen
* `below(offset, bleed)`: Get the elements below the top of the screen


## jquery.xscrolly

Can also be used as a jQuery plugin:

    $('section').xscrolly();

And the instance can be found on $(el).data('xscrolly');


## Live Demos

* http://texastribune.github.io/xscrolly/examples/basic.html
* http://texastribune.github.io/xscrolly/examples/lazyimg.html
* http://texastribune.github.io/xscrolly/examples/offset.html
* http://texastribune.github.io/xscrolly/examples/spy.html
