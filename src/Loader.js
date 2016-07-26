var THREE = require('three');

module.exports = function Loader(slides, htmlItems, options) {
	console.log('Loader');

	// The beginning is essentially synchronous
	slides.audioSystem = initialiseAudio(options);

	slides.renderer = initialiseRenderer(options);
	slides.sceneData = initialiseScene();

	// This bit is asynchronous due to assets loaded asynchronously
	loadContent(htmlItems, options, (progress) => {
	}, (complete) => {
	});
	
};

function initialiseAudio(options) {

	var audioContext = new AudioContext();
	var limiter = audioContext.createDynamicsCompressor();
	limiter.connect(audioContext.destination);

	return {
		audioContext: audioContext,
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

function loadContent(htmlItems, options, onProgress, onComplete) {
	
}
