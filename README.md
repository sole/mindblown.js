# mindblown.js

**NOTE:** *This is a work in progress - please don't file bugs on this yet or tell me it doesn't work for you*

This is a framework for creating presentations in 3D, starting with HTML content. This should make it possible to have a print version, and also make the content accessible for people who are visually impaired or cannot cope with 3D graphics.

## How does it work

Any suitable HTML container can be the starting point. For example, a `div` with any number of `section` children. Each section corresponds to a slide.

Each section should have `h1`, `h2`, `h3`, `p`, etc... elements. Roughly, known elements will be converted into 3D objects and placed into space, to be rendered in 3D with WebGL.

Sections might have special attributes to define their behaviour or appearance. TODO: list which ones.

TODO: List known elements and their appearance when rendered.

TODO: List which elements can be replaced by JavaScript defined scenes, and how to define these scenes and provide code to implement them.

### User API

```javascript
var MindBlown = require('mindblown.js');
var htmlSlidesElement = document.getElementById('slides');
var slides = new MindBlown();

slides.on('load_complete', function() {
	document.body.appendChild(slides.domElement);
});

slides.load(htmlSlidesElement);
```

## Options

These options can be passed when calling the MindBlown.js constructor:

```javascript
var slides = new MindBlown({ optionA: ... });
```

### `cheapRenderer`

Uses lower quality renderer without antialias

## Working on this

To try it out locally

* clone repository
* `npm install`
* `npm run build`
* open `example/index.html` in your browser

The example uses the distributable build in `dist/` which will be eventually also published to npm. If it works with the example, then it's good.

Every time a change is made in the core MindBlown code you'll need to rebuild. TODO: add a file watcher to rebuild on demand.

## Internals

`
slides = new MindBlown();
slides.init(htmlSlides)
	// ...
	MindBlown -> htmlTo3D
					-> htmlTo3DSlide
					...
`

### Events

There's lots of asynchronicity here. We use `EventEmitter` rather than DOM style events.

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
