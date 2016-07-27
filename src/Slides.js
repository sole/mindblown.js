var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Loader = require('./Loader');

function Slides(htmlSlides, options) {
	EventEmitter.call(this);

	var self = this;

	this.load = function() {
		console.log('load');

		// Hand over to the Loader to do the heavy lifting
		Loader(this, htmlSlides, options, (progress) => {
			console.info('on progress', progress);
			self.emit('load_progress', progress);
		}, (complete) => {
			console.info('completed load', complete);
			self.emit('load_complete', complete);
		});

		console.log(this);
	};
};

util.inherits(Slides, EventEmitter);
module.exports = Slides;
