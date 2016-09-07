var THREE = require('three');
var HTMLto3DConverter = require('./HTMLto3DConverter');

/**
 * Deals with all the loading and initialisation of assets so the Slides object
 * doesn't deal with 'low level' implementation details.
 *
 * Creates THREE WebGL renderer and a Web Audio context.
 */
module.exports = function Loader(slides, htmlItems, options, onProgress, onComplete) {
	console.log('Loader');

	// The beginning is essentially synchronous
	slides.audioSystem = initialiseAudio(options);

	slides.renderer = initialiseRenderer(options);
	slides.sceneData = initialiseScene();

	// This bit is asynchronous due to assets loaded asynchronously
	loadContent(htmlItems, options, slides.audioSystem.context, onProgress, function(slideObjects) {
		// TODO distribute slides horizontally before emitting the event
		
		// Add the slides to the scene
		var scene = slides.sceneData.scene;
		slideObjects.forEach((obj, index) => {
			scene.add(obj);
		});
		
		onComplete(slideObjects);
	});
	
};

function initialiseAudio(options) {

	var audioContext = new AudioContext();
	var limiter = audioContext.createDynamicsCompressor();
	limiter.connect(audioContext.destination);

	return {
		context: audioContext,
		limiter: limiter
	};

}

function initialiseRenderer(options) {
	
	if(options.cheapRenderer) {
		renderer = new THREE.WebGLRenderer({});
	} else {
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
	}

	renderer.setClearColor(options.colours.background, 1.0);

	return renderer;
}

function initialiseScene() {

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(60, 320 / 200, 1, 100000);
	var cameraTarget = new THREE.Vector3(0, 0, 0);
	camera.position.set(0, 20, 40);
	camera.lookAt(cameraTarget);

	return {
		scene: scene,
		camera: camera,
		cameraTarget: cameraTarget
	};
	
}

function loadContent(htmlItems, options, audioSystem, onProgress, onComplete) {
	
	var converter = new HTMLto3DConverter();

	var numElements = 1;

	converter.on('processing_start', function(ev) {
		numElements = ev.numElements;
		console.log('Going to process', numElements);
	});

	converter.on('slide_processing_start', function(ev) {
		console.log('slide start ' + ev.index, ev.element);
		console.time('slide' + ev.index);
	});

	converter.on('slide_processing_end', function(ev) {
		console.timeEnd('slide' + ev.index);
		var perc = (100 * (ev.index + 1) / numElements).toFixed(2);
		onProgress({ value: perc });
	});

	converter.on('processing_end', function(ev) {
		var slideObjs = ev.slides;
		onComplete(slideObjs);
	});

	converter.process(htmlItems, options, audioSystem);

}
