var EventEmitter = require('events').EventEmitter;
var util = require('util');
var THREE = require('three');
var HTMLto3DSlideConverter = require('./HTMLto3DSlideConverter');


function HTMLto3DConverter() {

	EventEmitter.call(this);

	var self = this;

	this.process = function(elements, options, audioContext) {
		
		var slideObjects = [];
		var index = 0;
		var delay = 10;
		var slideConverter = new HTMLto3DSlideConverter();
		slideConverter.on('processing_end', finishSlide);

		console.log('converting html to 3d');
		console.log(elements);

		function processNextSlide() {
			var el = elements[index];

			self.emit('slide_processing_start', {
				index: index,
				element: el
			});

			slideConverter.process(el, options, audioContext);
		}

		function finishSlide(ev) {
		
			console.log('slide processor finished', ev, index);
			
			self.emit('slide_process_end', {
				index: index
			});

			slideObjects.push(ev.slide);

			index++;
			
			if(index < elements.length) {
				setTimeout(processNextSlide, delay);
			} else {
				self.emit('processing_end', {
					slides: slideObjects
				});
			}
		}

		processNextSlide();

	};

};

util.inherits(HTMLto3DConverter, EventEmitter);

module.exports = HTMLto3DConverter;

