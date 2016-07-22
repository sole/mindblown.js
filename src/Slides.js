var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Slides(htmlSlides, options) {
	EventEmitter.call(this);

	this.load = function() {
		console.log('load');
	};
};

util.inherits(Slides, EventEmitter);
module.exports = Slides;
