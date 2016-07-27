var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Renderable = require('./Renderable');

function HTMLto3DSlideConverter() {
	
	EventEmitter.call(this);

	var self = this;

	this.process = function(element, options, audioContext) {

		var slideObject = new Renderable(audioContext);

		// TODO rest of stuff, obviously
		
		self.emit('processing_end', {
			slide: slideObject,
			element: element
		});
		
	};

}

util.inherits(HTMLto3DSlideConverter, EventEmitter);

module.exports = HTMLto3DSlideConverter;
