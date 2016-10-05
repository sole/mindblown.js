# Contributing

## Filing an issue?

Before you file an issue, please have a look at the list of [existing issues](https://github.com/sole/mindblown.js/issues) to make sure it hasn't been filed yet.

When reporting bugs, it's essential to describe the conditions that cause the bug with as much detail as possible:

- what you expected
- what you did
- what you actually got (screenshots help, devtools console output help)
- the environment you're running this on (browser, version, operating system, any other data that seems relevant like graphics card)
- did you build the library yourself? or did you use the provided bundle?
- does the bug happen every time?
- etc

Also, online examples --preferrably editable, with codepen, jsfiddle, jsbin...-- are so much easier to debug than a few lines of code pasted without context on the issue description.

And online examples which are actually a reduced test case, i.e. everything stripped down to the minimal bit of code that causes the issue, are the best way of getting the issue looked at.

## Requesting new features? Sending Pull Requests?

Feel free to request new features, however right now the main goal is to make sure this engine can be used to build my [Hands On Web Audio](https://github.com/sole/howa/) presentation (from which the engine itself is refactored out). Anything that does not contribute to this goal will be put on hold until late.

Also bear in mind that this engine is to be run on the presenter's computer. Performance issues on lower end devices are evidently something to worry about, but not the most pressing issue right now.

This is also supposed to be just the engine. Anything else that is a bit too generic would better live on its own repository and build on top of this engine.

## Working on this

If you want to work on the code you will need `node.js` and `git` installed in your computer. Then perform the following steps:

* clone repository
* `npm install`
* `npm run build`
* open `example/index.html` in your browser to make sure everything works

The example uses the distributable build in `dist/`, which will be eventually be published to [npm](http://npmjs.com/). If it works with the example, then it's good (eventually we'll also have tests. eventually).

Every time a change is made in the core `mindblow.js` code you'll need to rebuild, so `dist/mindblown.js` is updated.

Alternatively, you can use `npm run watch` instead of `npm run build`, to start a file watcher that rebuilds the library each time files inside `src/` are modified.

The `dist` folder should be checked in the repository, so if someone `git clone`s the repository, they can run the example without even running `npm install && npm run build`.

The `package.json` file exposes `src/index.js`, not the `dist` version. This is for people building presentations with node.js, and this also allows bundlers to do whatever optimisations they can do, which are harder to do if the code is a big bundle.

## Events

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


