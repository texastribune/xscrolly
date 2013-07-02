# xscrolly.js

When `X` gets scrolled... do `Y`.


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

### `change`

Scroll has changed focus from one element to another.

### `one`

Scroll has changed focus from one element to another for the first time.


## Properties

* `active`: The currently active element


## jquery.xscrolly

Can also be used as a jQuery plugin:

    $('section').xscrolly();

And the instance can be found on $(el).data('xscrolly');
