var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Loader = require('./Loader');

function Slides(htmlSlides, options) {
	EventEmitter.call(this);

	this.load = function() {
		console.log('load');

		// Hand over to the Loader to do the heavy lifting
		Loader(this, htmlSlides, options);

		console.log(this);
	};
};

util.inherits(Slides, EventEmitter);
module.exports = Slides;
