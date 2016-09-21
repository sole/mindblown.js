# mindblown.js

**NOTE:** *This is a work in progress - please don't file bugs on this yet or tell me it doesn't work for you*

This is a framework for creating presentations in 3D, starting with HTML content. This should make it possible to have a print version, and also make the content accessible for people who are visually impaired or cannot cope with 3D graphics.

## How does it work?

Any suitable HTML container can be the starting point. For example, a `div` with any number of `section` children. Each section corresponds to a slide.

Each section should have `h1`, `h2`, `h3`, `p`, etc... elements. Roughly, known elements will be converted into 3D objects and placed into space, to be rendered in 3D with WebGL.

Sections might have special attributes to define their behaviour or appearance. These attributes are described using element dataset attributes per element. These are written in hyphenated form, and the browser will convert them to `camelCase`. E.g. `transition-duration` in HTML becomes `transitionDuration` when we read the dataset field of the element.

* `offset-y`: amount of vertical offset for a given slide. Good for 'dramatic effects', such as having the initial slide with a very tall offset.
* `is-decoration`: by default all elements are assumed to be "content", and they will be laid out from top to bottom like in a page layout. When the slide is shown, the camera will make sure the full contents are in sight. If an element is decorative or you want it to be placed at the center of the slide, specify the `data-is-decoration` attribute and it will be taken out of the document flow. The camera might not show the full extent of the scene if the decorative objects are too big, but this might be an intended effect in some cases.
* `padding`: slide padding around its contents
* `replace`: specify that the element must be replaced with a custom element. These allow you to display custom 3D graphics and audio within your presentation.
* `transition-duration`: the time it takes to transition into this slide, in seconds (default is 1).

Example:

```html
<section data-padding="100" data-offset-y="200" transition-duration="10">
...
</section>
```

TODO: List known elements and their appearance when rendered.

TODO: List which elements can be replaced by JavaScript defined scenes, and how to define these scenes and provide code to implement them.

### User API

```javascript
var MindBlown = require('mindblown.js');
var selector = '#slides section';
var options = { cheapRenderer: false };

var slides = MindBlown(selector, options);

slides.on('load_complete', function() {
	document.body.appendChild(slides.domElement);
});

slides.load();
```

## Methods

### `MindBlown(selector, options)` returns `Slides` instance.

`selector` is a string describing a DOM selector which points to any number of `section` elements. E.g. `#slides section`. Or just `section`—depends on your particular HTML markup.

`options` is a JavaScript object, with keys and values. For example:

```javascript
options = { cheapRenderer: false };
```

The following options can be passed when calling `MindBlown`:

* `cheapRenderer`: Uses a lower quality renderer, without antialias.

### `Slides` (event emitter)

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
