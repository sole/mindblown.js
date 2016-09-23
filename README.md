# mindblown.js

**NOTE:** *This is a work in progress - please don't file bugs on this yet or tell me it doesn't work for you*

This is a framework for creating presentations in 3D, starting with HTML content. This makes the content accessible in more ways, e.g. for people who are visually impaired or cannot cope with 3D graphics and also allows for having a print version (for those conferences that want a PDF copy of your slides).

## How does it work?

Any suitable HTML container can be the starting point. For example, a `div` with any number of `section` children. Each section corresponds to a slide, and it contains normal HTML elements such as `h1`, `h2`, `h3`, `p`, etc.

For example:

```html
<div id="slides">
	<section>
		<h1>Hello everyone</h1>
	</section>
	<section>
		<h1>Second slide</h1>
		<h2>And last!</h2>
	</section>
</div>
```

When **mindblown.js** is called, it will read the contents of elements it knows how to deal with, convert them into 3D objects and render them with WebGL and Web Audio.

Assuming you're using the distributable bundle, you can get three-dimensional slides with something like this:

```javascript
var slidesSelector = '#slides section';
var slides = MindBlown(slidesSelector);
slides.on('load_complete', function() {
	body.appendChild(slides.renderer.domElement);
});
slides.load();
```

## Slides

### Custom slide attributes

Slides might have special attributes to define their behaviour or appearance. These attributes are prefixed with `data-`. For example:

```html
<section data-padding="100" data-offset-y="200" data-transition-duration="10">
...
</section>
```

These are written in hyphenated form, and the browser will convert them to `camelCase`. E.g. `transition-duration` in HTML becomes `transitionDuration` when we access them using `dataset` in JavaScript.

These are the available attributes:

* `offset-y`: amount of vertical offset for a given slide. Good for 'dramatic effects', such as having the initial slide with a very tall offset. Can be negative (the slide is shifted downwards) or positive. (the slide is shifted upwards). The default is 0.
* `padding`: padding around the contents of the slide.
* `transition-duration`: the time it takes to transition into this slide, in seconds (default is 1).

## Elements

mindblown.js supports a basic set of HTML elements, and also supports replacing them with your own provided implementation.

### Element attributes

All elements can use these attributes.

* `replace`: specify that the element must be replaced with a custom element. These allow you to display custom 3D graphics and audio within your presentation.
* `is-decoration`: by default all elements are assumed to be "content", and they will be laid out from top to bottom like in a page layout. When the slide is shown, the camera will make sure the full contents are in sight. If an element is decorative or you want it to be placed at the center of the slide, specify the `data-is-decoration` attribute and it will be taken out of the document flow. The camera might not show the full extent of the scene if the decorative objects are too big, but this might be an intended effect in some cases.

### Known elements

The engine knows how to render some text elements: `H1` through `H4`, and `P`.

Not implemented yet, but in the works: IMG (<a href="https://github.com/sole/mindblown.js/issues/8">#8</a>) and PRE (for code snippets) (<a href="https://github.com/sole/mindblown.js/issues/9">#9</a>).

### Custom elements

TODO https://github.com/sole/mindblown.js/issues/2


## User API

We've roughly described how to go from HTML to three-dimensional slides above. We're now going into more detail.

The whole process can be summarised with the following steps:

1. Write a selector that describes the slides.
2. Call the `MindBlown` function to get an instance of `Slides`, passing any options if necessary.
3. Attach events to the `Slides` instance.
4. Call the `load()` method on the `Slides` instance.
5. Once loaded, insert slides renderer canvas on the page, attach listeners for key events, etc, and other stuff required for presenting using a slide deck.

There are many classes under the hood (you can have a look at [this diagram](./docs/hierarchy.md) to see the relations between them), but you only need to know about the most important ones to use this framework:

* MindBlown ([source](./src/index.js)): the entry point. Sanitises options, builds HTML slides array using the selector, creates and returns an instance of `Slides`.
* Slides ([source](./src/Slides.js)): the object you'll interact most with. Provides functions for loading and turning HTML into 3D content, advancing the slide, etc.
* Renderable ([source](./src/Renderable.js)): relevant only if you're going to write your own 3D content. 3D elements are 'Renderables'. Instances are passed an audio context instance and a reference to THREE.js, so they can be written and distributed without including their own copy of THREE.

### `MindBlown(selector, options)` returns `Slides` instance.

`selector` is a string describing a DOM selector which points to any number of `section` elements. E.g. `#slides section`. Or just `section`—depends on your particular HTML markup.

`options` is a JavaScript object, with keys and values. These are split into sections, depending on which component they configure. For example:

```javascript
options = {
	renderer: {
		cheap: true
	},
	replacements: {
		'cube': CubeReplacement
	}
};
```

The following options can be passed when calling `MindBlown()`:

* `colours`: options to configure the presentation colours. TODO: explain format https://github.com/sole/mindblown.js/issues/10
* `renderer`: options to configure the renderer
 * `cheapRenderer`: Uses a lower quality renderer, without antialias. Default is `false` (i.e. use higher quality renderer).
 * `width`: specify renderer canvas width
 * `height`: specify renderer canvas height
* `replacements`: An object with pairs of replacements to be used when converting the slides into 3D.

All the sections and even the options argument are optional, which is to say that you can get functional basic 3D slides by calling `MindBlown()` with just the HTML selector and *no options*.

### `Slides` (event emitter)

This object exposes methods to select which slide is rendered, and also to render the slide. It also emits events, which you can use to do things such as updating the UI once the slides have been fully loaded, or storing the current slide on a URL hash for easier sharing, for example.

#### Methods

##### `load`

Starts the load process. The `load_progress` and `load_complete` events will be emitted as the process progresses.

##### `render(time)`

Renders a frame with the currently active slide. Note if there are animations (inside replaced elements) in other slides, they will not be played--only the active slide will have animations played.

##### `setSize(width, height)`

Sets renderer size.

##### `show(slideNumber)`

Show slide at position `slideNumber`. Moves the camera to focus on the slide contents, and emits the `change` event when the camera transition is finished.

##### `showNext()`

Shows the next slide. If we're already on the last slide, it shows the first slide.

##### `showPrevious()`

Shows the previous slide. If we're already on the first slide, it shows the last slide.

#### Events

The following events will be triggered when actions happen on a `Slides` instance:

* `load_progress` (`value: %`), each time a section is loaded. `value` represents the loaded percentage, out of the total.
* `load_complete` (no parameters).
* `change` (`{ index: the new active section number }`).

To listen for events, use the `on` method:

```javascript
slides.on('load_progress', function(ev) {
	console.log('Loaded: ' + ev.value);
});
```

## Working on this

To try it out locally

* clone repository
* `npm install`
* `npm run build`
* open `example/index.html` in your browser

The example uses the distributable build in `dist/` which will be eventually also published to npm. If it works with the example, then it's good.

Every time a change is made in the core MindBlown code you'll need to rebuild. Or you can use `npm run watch` to start a file watcher that rebuilds the presentation on demand.

The `dist` folder should be checked in the repository - so if someone git clones the repository, they can run the example without even running `npm install && npm run build`.
The `package.json` file exposes `src/index.js`, not the `dist` version. This is for people building presentations with node.js, and this also allows bundlers to do whatever optimisations they need to do, which are harder to do if the code is a big bundle.

## Internals

```
slides = new MindBlown();
slides.init(htmlSlides)
	// ...
	MindBlown -> htmlTo3D
					-> htmlTo3DSlide
					...
```

### Events

There's a lot of asynchronicity here. We use node.js's `EventEmitter` rather than DOM style events.

The pattern to make an object an EventEmitter and listen to its events is the following:

```javascript
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var MyObject = function() {
	EventEmitter.call(this);

	this.doSomething = function() {
		this.emit('somethingWasDone', { when: Date.now() });
	};
};

util.inherits(MyObject, EventEmitter);

var instance = new MyObject();
instance.on('somethingWasDone', function(ev) {
	console.log('something was done!', ev.when);
});
instance.doSomething();

```

### Slide objects structure

TODO: are them Renderables?

`
slideObject
    |
	+-> contentsObject <[[the camera focus on this when this is the active slide]]
	|
	+-> other stuff
`

## TODO

* AudioContext polyfill
* Make this list and all TODO items in the code / README into issues in github
