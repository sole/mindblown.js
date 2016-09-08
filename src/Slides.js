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
	var scene;
	var camera;
	var cameraTarget;
	var renderer;

	this.load = function() {
		console.log('load');

		// Hand over to the Loader to do the heavy lifting
		// It will set some of our variables like sceneData
		Loader(this, htmlSlides, options, (progress) => {
			console.info('on progress', progress);
			self.emit('load_progress', progress);
		}, (complete) => {
			console.info('completed load', complete);
			
			camera = self.sceneData.camera;
			cameraTarget = self.sceneData.cameraTarget;
			scene = self.sceneData.scene;
			renderer = self.renderer;

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
		
		camera.position.set(0, 0, 100);
		camera.lookAt(this.sceneData.cameraTarget);
		renderer.render(scene, camera);

	};
};

util.inherits(Slides, EventEmitter);
module.exports = Slides;
