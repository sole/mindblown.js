var EventEmitter = require('events').EventEmitter;
var util = require('util');
var THREE = require('three');
var Renderable = require('./Renderable');

function HTMLto3DSlideConverter() {
	
	EventEmitter.call(this);

	var self = this;

	this.process = function(element, options, audioContext) {

		var slideObject = new Renderable(audioContext);



		
		var contentsObject = new THREE.Object3D();
		
		// TODO this is related to the 'empty boxes have infinity size' bug
		var ttt = 10 * Math.random();
		var dummy = new THREE.Mesh(new THREE.BoxGeometry(ttt,ttt,ttt), new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true }));
		contentsObject.add(dummy);

		
		// TODO rest of stuff, obviously
		
		slideObject.add(contentsObject);

		self.emit('processing_end', {
			slide: slideObject,
			element: element
		});
		
	};

}

util.inherits(HTMLto3DSlideConverter, EventEmitter);

module.exports = HTMLto3DSlideConverter;
