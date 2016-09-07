var EventEmitter = require('events').EventEmitter;
var util = require('util');
var THREE = require('three');
var HTMLto3DSlideConverter = require('./HTMLto3DSlideConverter');

/**
 * Takes an array of HTML slides (often <section> elements with their children),
 * and converts them into 3D slides.
 *
 * The result of the conversion will be an array of Renderable objects.
 *
 * Conversion is delegated to HTMLto3DSlideConverter.
 *
 */
function HTMLto3DConverter() {

	EventEmitter.call(this);

	var self = this;

	this.process = function(elements, options, audioContext) {
		
		var slideObjects = [];
		var index = 0;
		var delay = 10;
		var slideConverter = new HTMLto3DSlideConverter();
		slideConverter.on('processing_end', finishSlide);

		console.log('Converting HTML to 3D: ', elements.length + ' elements');
		console.log(elements);

		self.emit('processing_start', {
			numElements: elements.length
		});

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
			
			self.emit('slide_processing_end', {
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

