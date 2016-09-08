var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Loader = require('./Loader');

/**
 * - audioSystem
 * - renderer
 * - sceneData
 */
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


	this.render = function(t) {		
		/*
		 * controls.update();
		// Do not try to render the 'current slide' until we have been
		// told which slide is it
		if(currentSlideNumber >= 0) {
			threeDeeSlides[currentSlideNumber].render(time);
		}
		TWEEN.update(time);
		camera.lookAt(cameraTarget);
		
		currentRenderer.render(scene, camera);

		 */
		// TODO less this and more local variables
		this.sceneData.camera.position.set(0, 0, 100);
		this.sceneData.camera.lookAt(this.sceneData.cameraTarget);
		this.renderer.render(this.sceneData.scene, this.sceneData.camera);

	};
};

util.inherits(Slides, EventEmitter);
module.exports = Slides;
