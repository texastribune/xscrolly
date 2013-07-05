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
updateOffsets: 0,      // force script to re-calculate offsets:
                       //   0 (default)   calculate only the first time
                       //   1             re-calculate after `unveil`
                       //   2             re-calculate after `change`
                       //   3             re-calculate every scroll
offset: 0,             // pixels from the top of the page to set the origin
targets: 'section',    // selector for the targets
throttle: 200          // milliseconds to de-bounce the scroll event
```

## Events

Event callbacks have the general function prototype:

    function($el)

Where `$el` is the object in view, `this` is the instance of XScrollY.

Events are fired in this order:

1. `one`
2. `change`
3. `scroll`

### `one`

Scroll has changed focus from one element to another for the first time.

### `change`

Scroll has changed focus from one element to another.

### `scroll`

Captured a scroll event.


## Properties

* `$active`: The currently active element(s)


## Methods

These are methods you can use on `this` inside the event callbacks:

* `visible(offset, bleed)`: Get the targets visible on screen
* `above(offset, bleed)`: Get the targets above the *top* of the screen
* `aboves(offset, bleed)`: Get the targets above the *bottom* of the screen
* `below(offset, bleed)`: Get the elements below the *top* of the screen
* `belows(offset, bleed)`: Get the elements below the *bottom* of the screen

You can also pass in a custom set of targets as the third argument.


## jquery.xscrolly

Can also be used as a jQuery plugin:

    $('section').xscrolly();

And the instance can be found on $(el).data('xscrolly');


## Live Demos

* http://texastribune.github.io/xscrolly/examples/basic.html
* http://texastribune.github.io/xscrolly/examples/lazyimg.html
* http://texastribune.github.io/xscrolly/examples/offset.html
* http://texastribune.github.io/xscrolly/examples/spy.html
