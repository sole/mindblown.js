var EventEmitter = require('events').EventEmitter;
var util = require('util');
var THREE = require('three');
var Renderable = require('./Renderable');
var ElementToObjectFactory = require('./ElementToObjectFactory');
var distributeObjects = require('./distributeObjects');

function HTMLto3DSlideConverter() {
	
	EventEmitter.call(this);

	var self = this;

	this.process = function(element, options, audioContext) {

		var slideObject = new Renderable(audioContext);
		
		var contentsObject = new THREE.Object3D();
		
		// TODO this is related to the 'empty boxes have infinity size' bug
		// TODO make it create 0 sized boxes again (i.e. not ttt but 0, 0, 0)
		var ttt = 10 * Math.random();
		var dummy = new THREE.Mesh(new THREE.BoxGeometry(ttt,ttt,ttt), new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true }));
		contentsObject.add(dummy);

		
		// TODO rest of stuff, obviously
		var factory = new ElementToObjectFactory(options, audioContext);
		var children = Array.from(element.childNodes);
		
		var childObjects = [];
		
		children.forEach((el) => {

			var object = factory.convert(el);
			
			if(object) {
				childObjects.push(object);
				
				if(object.isRenderable) {
					slideObject.add(object);
				} else {
					contentsObject.add(object);
				}

				if(object.audioNode) {
					object.audioNode.connect(slideObject.audioNode);
				}

			}

		});

		// We only distribute vertically the non-renderables
		// Renderables are centered in 0, 0 so it's easier to build animations that take over the entire screen, etc
		distributeObjects(contentsObject.children, { offset: 0, dimension: 'y', direction: -1 });
		
		slideObject.add(contentsObject);

		// Keep track of which object is it-we'll use it to zoom to that object
		// and ignore other objects that might act as decorations etc
		slideObject.contentsObject = contentsObject;


		self.emit('processing_end', {
			slide: slideObject,
			element: element
		});
		
	};


		
}

util.inherits(HTMLto3DSlideConverter, EventEmitter);

module.exports = HTMLto3DSlideConverter;
