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

### Slide attributes

Slides might have attributes to define their behaviour or appearance. These attributes are prefixed with `data-`. For example:

```html
<section data-padding="100" data-offset-y="200" data-transition-duration="10">
...
</section>
```

These are written in hyphenated form, and the browser will convert them to `camelCase`. E.g. `transition-duration` in HTML becomes `transitionDuration` when we access them using `dataset` in JavaScript (although you probably shouldn't care about this unless you want to contribute to `mindblown.js`).

These are the available attributes:

* `offset-y`: amount of vertical offset for a given slide. Good for *dramatic effects*, such as having the initial slide with a very tall offset. Can be negative (the slide is shifted downwards) or positive. (the slide is shifted upwards). The default is 0.
* `padding`: padding around the contents of the slide.
* `transition-duration`: the time it takes to transition into this slide, in seconds (default is 1). Also good for *dramatic effects*.

## Allowed elements

`mindblown.js` supports a basic subset of HTML elements, and also supports using your own custom elements.

### Element attributes

All elements can use these attributes:

* `custom-element`: specifies that the element must be replaced with a custom element. These allow you to display custom 3D graphics and audio within your presentation. TODO add link to syntax example
* `is-decoration`: by default all elements are assumed to be "content", and they will be laid out from top to bottom like in a page layout. When the slide is shown, the camera will make sure the full contents are in sight. If an element is decorative or you want it to be placed at the center of the slide, specify the `data-is-decoration` attribute and it will be taken out of the document flow. The camera might not show the full extent of the scene if the decorative objects are too big, but this might be an intended effect in some cases.

### Known elements

The engine knows how to render some text elements: `H1` through `H4`, and `P`.

Not implemented yet, but in the works:

* IMG (<a href="https://github.com/sole/mindblown.js/issues/8">#8</a>)
* and PRE (for code snippets) (<a href="https://github.com/sole/mindblown.js/issues/9">#9</a>).

### Custom elements

Defining your own custom elements is also possible. For example, you could build inline demos for your presentation, and they would be placed inside the slide as with the rest of elements.

Or you could decide you want to render an element differently of how the default elements are rendered. You can do all that with custom elements.

Read [the section on custom elements](#using-custom-elements) to learn more.

## User API

We've roughly described how to go from HTML to three-dimensional slides above. We're now going into more detail.

The whole process can be summarised with the following steps:

1. Write a selector that describes the slides.
2. Call the `MindBlown` function to get an instance of `Slides`, passing any options if necessary.
3. Attach events to the `Slides` instance.
4. Call the `load()` method on the `Slides` instance.
5. Once loaded, insert slides renderer canvas on the page, attach listeners for key events, etc, and other stuff required for presenting using a slide deck.

There are many classes under the hood (you can have a look at [this diagram](./docs/hierarchy.md) to see the relations between them), but you only need to know about the most important ones to use this framework:

* MindBlown ([source](./src/index.js)): the entry point. Sanitises options, builds an HTML slides array using the selector, and creates and returns an instance of `Slides`.
* Slides ([source](./src/Slides.js)): the object you'll interact most with. Provides functions for loading and turning HTML into 3D content, advancing the slide, etc.
* Renderable ([source](./src/Renderable.js)): relevant only if you're going to write your own custom elements, as they need to extend `Renderable`.

### `MindBlown(selector, options)` returns `Slides` instance.

* `selector` is a string describing a DOM selector which points to any number of `section` elements. E.g. `#slides section`. Or just `section`—depends on your particular HTML markup.
* `options` is a JavaScript object, with keys and values. These are split into sections, depending on which component they configure. For example:

```javascript
options = {
	renderer: {
		cheap: true
	},
	customElements: {
		'cube': CubeElement
	}
};
```

The following options can be used when calling `MindBlown()`:

* `colours`: options to configure the presentation colours. TODO: explain format https://github.com/sole/mindblown.js/issues/10
* `renderer`: options to configure the renderer
 * `cheapRenderer`: Uses a lower quality renderer, without antialias. Default is `false` (i.e. use higher quality renderer).
 * `width`: specify renderer canvas width
 * `height`: specify renderer canvas height
* `customElements`: An object with pairs of key and custom element constructors to use when converting the slides into 3D.

All the sections, and even the `options` argument are optional, or in other words: you can get functional basic 3D slides by calling `MindBlown()` with just the HTML selector and *no options*.

### `Slides` (event emitter)

This object exposes methods to select which slide is rendered, and also to render the slide. It also emits events, which you can use to do things such as updating the UI once the slides have been fully loaded, or storing the current slide on a URL hash for easier sharing, for example.

#### Methods

##### `load`

Starts the load process. The `load_progress` and `load_complete` events will be emitted as the process progresses.

##### `render(time)`

Renders a frame with the currently active slide. Note if there are animations (inside custom elements) in other slides, they will not be updated--only the active slide will have animations played, as only that slide gets its `render` method called.

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

### Renderable

`Renderable` extends from `THREE.Object3D`. It differs from standard `Object3D`s in two aspects:

* it has a few additional functions like `render()`, `activate()`, etc.
* it also has an `audioNode` property. If your object extending `Renderable` generates audio, the output should be connected to `audioNode` so the parent can connect the output of its children's `audioNode` to its own internal mixer, and so on.

`Renderable`s are not meant to be instantiated directly, but used as a base class for other objects. They are the base for `Slide`, and they are the base for custom elements as well.

#### Inheriting from Renderable

To make an object extend from `Renderable`, you need to call the `Renderable` function in your constructor, and also set the prototype of your object to be based on the `Renderable` prototype. This gives you access to the base functions. For example:


```javascript
function MyRenderable(element, audioContext, options) {
	Renderable.call(this, audioContext);
	// Rest of body
}

MyRenderable.prototype = Object.create(Renderable.prototype);
MyRenderable.prototype.constructor = MyRenderable;
```

Remember to pass both `this` and `audioContext` when calling `Renderable`; otherwise the instance will not be setup correctly and you might have issues when trying to use it.

#### Methods

##### `traverseChildren(callback)`

Use it to iterate through every children and run the `callback` function on each of them (each child is passed as argument to the function).

This function will **not** do a deep traversal, meaning that children of children won't automatically traverse their children and run the callback.

##### `activate()`

Will be called by the engine when the slide becomes active. Use it to start animations, and start music or sound effects fade ins, etc.

##### `deactivate()`

Will be called by the engine when the slide becomes inactive. Use it to stop animations, and start music or sound effects fade outs, etc.

##### `render()`

This method will traverse the children and call `render` on them. That enables `Slide` instances (which inherit from `Renderable`) to call the `render` method on their children when they are rendered as well.

### Using custom elements

To use your own elements, you need to let the engine know about them first. This is done when initialising the slides, via the `options` object. Add one or more pairs to the `customElements` entry, like for example:

```javascript
slides = MindBlown(slidesSelector, {
	customElements: {
		'other-thing': OtherThingElement,
		// ... maybe more
		'something-else': SomethingElseElement
	}
});
```

Then, each time you want to use them in place of any other HTML element, you must add an attribute in the element to denote it:

```html
<img src="other-thing.jpg" alt="Image of other thing" data-custom-element="other-thing" />
```
You can use them in as many elements as you wish.

Caveat: you cannot specify an instance of `Renderable` directly as a custom element. You need to wrap its constructor with a function, like this:

```javascript
function OtherThingElement(Renderable, THREE) {

	return function(element, audioContext, nodeProperties) {

		Renderable.call(this, audioContext);

		console.log('init other thing');

		// do things to initialise object

		this.activate = function() {
			console.log('activate cube');
			// ...				 
		};

		this.deactivate = function() {
			console.log('deactivate cube');
			// ...
		};

		this.render = function(t) {
			// ...
		};

	}
}
```

The function takes `Renderable` and `THREE` as parameters, and returns the constructor for your custom element.

We wrap the constructor this way in order to get access to the `Renderable` base class and also to the same version of `Three.js` that we are using internally.

Therefore, authors of custom elements don't need to provide their own version of `Three.js`, which avoids bloat and conflicts between versions (for example, if the library API changes), as eventually custom elements are rendered by the version of `Three.js` that `mindblown.js` uses.

## Working on this

If you want to work on the code (perhaps you want to help adding features?! Yay! [here's a list of things to do or fix](https://github.com/sole/mindblown.js/issues)):

* clone repository
* `npm install`
* `npm run build`
* open `example/index.html` in your browser to make sure everything works

The example uses the distributable build in `dist/`, which will be eventually be published to [npm](http://npmjs.com/). If it works with the example, then it's good (eventually we'll also have tests. eventually).

Every time a change is made in the core `mindblow.js` code you'll need to rebuild, so `dist/mindblown.js` is updated.

Alternatively, you can use `npm run watch` instead of `npm run build`, to start a file watcher that rebuilds the library each time files inside `src/` are modified.

The `dist` folder should be checked in the repository, so if someone `git clone`s the repository, they can run the example without even running `npm install && npm run build`.

The `package.json` file exposes `src/index.js`, not the `dist` version. This is for people building presentations with node.js, and this also allows bundlers to do whatever optimisations they can do, which are harder to do if the code is a big bundle.


### Events

There's a lot of asynchronicity here. We use `node.js`'s `EventEmitter` rather than DOM style events.

The pattern to make an object an `EventEmitter` and listen to its events is the following:

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

## License

Copyright 2016 Soledad Penadés (https://soledadpenades.com/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

(A copy of the [License](./LICENSE) is also included in this repository).

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

