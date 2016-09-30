var EventEmitter = require('events').EventEmitter;
var util = require('util');
var TWEEN = require('tween.js');
var Loader = require('./Loader');
var getDistanceToFit = require('./functions/getDistanceToFit');
var tweenObject = require('./functions/tweenObject');


function Slides(htmlSlides, options) {
	EventEmitter.call(this);

	var self = this;
	
	// These definitions are mostly to define the 'interface' of this class
	this.sceneData = {
		camera: null,
		cameraTarget: null,
		scene: null
	};
	this.renderer = null;

	var scene;
	var camera;
	var cameraTarget;
	var renderer;
	var rendererWidth;
	var rendererHeight;
	var slides;
	var currentSlideNumber = -1;


	this.load = function() {
		console.log('load');

		// Hand over to the Loader to do the heavy lifting
		// It will set the null variables in `this`.
		Loader(this, htmlSlides, options, (progress) => {
			console.info('on progress', progress);
			self.emit('load_progress', progress);
		}, (slideObjects) => {
			console.info('completed load');

			slides = slideObjects;
			console.log(slides.length);
			
			// Grab some references so it's easier & faster to use these objects
			camera = self.sceneData.camera;
			cameraTarget = self.sceneData.cameraTarget;
			scene = self.sceneData.scene;
			renderer = self.renderer;
			console.log('rendererrrr', renderer);
			
			self.setSize(options.renderer.width, options.renderer.height);

			self.emit('load_complete');
		});

		console.log(this);
	};


	this.render = function(time) {
		
		// Do not try to render the 'current slide' until we have been
		// told which slide is it
		if(currentSlideNumber >= 0) {
			slides[currentSlideNumber].render(time);
		}		
		
		TWEEN.update(time);
		camera.lookAt(cameraTarget);
		renderer.render(scene, camera);

	};


	this.setSize = function(w, h) {
		rendererWidth = w;
		rendererHeight = h;
		renderer.setSize(w, h);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
	};


	this.show = function(slideNumber) {
		
		if(currentSlideNumber >= 0 && currentSlideNumber !== slideNumber) {
			var previousSlide = slides[currentSlideNumber];
			previousSlide.deactivate();
		}

		currentSlideNumber = slideNumber;

		var slide = slides[slideNumber];

		slide.activate();

		var transitionDuration = slide.options.transitionDuration;

		tweenObject(cameraTarget, {
			x: slide.center.x,
			y: slide.center.y,
			z: slide.center.z
		}, transitionDuration).start();

		var distance = getDistanceToFit(camera, slide.contentsObject, rendererWidth, rendererHeight);

		var dstCamera = slide.center.clone();
		dstCamera.z += distance;

		// Make the camera a little more interesting by subtly going randomly left or right
		var r = 20;
		var variationX = r * (0.5 - Math.random());
		var variationY = r * (0.5 - Math.random());
		dstCamera.x += variationX;
		dstCamera.y += variationY;
		dstCamera.z += r;

		tweenObject(camera.position, {
			x: dstCamera.x,
			y: dstCamera.y,
			z: dstCamera.z
		}, transitionDuration)
		.onUpdate(function() {
			// TODO audioContext.listener.setPosition(this.x, this.y, this.z);
		})
		.start();

		this.emit('change', { index: slideNumber });

	};


	this.showNext = function() {
		var nextSlideNumber = (currentSlideNumber + 1) % slides.length;
		this.show(nextSlideNumber);
	};

	
	this.showPrevious = function() {
		var previousSlideNumber = currentSlideNumber - 1;
		if(previousSlideNumber < 0) {
			previousSlideNumber = slides.length - 1;
		}
		this.show(previousSlideNumber);
	};


};

util.inherits(Slides, EventEmitter);
module.exports = Slides;
