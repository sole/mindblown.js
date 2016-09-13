var EventEmitter = require('events').EventEmitter;
var util = require('util');
var THREE = require('three');
var Renderable = require('./Renderable');
var ElementToObjectFactory = require('./ElementToObjectFactory');
var distributeObjects = require('./functions/distributeObjects');
var makeObjectBox = require('./functions/makeObjectBox');

function HTMLto3DSlideConverter() {
	
	EventEmitter.call(this);

	var self = this;

	this.process = function(element, options, audioContext) {

		var slideObject = new Renderable(audioContext);

		// TODO: parse slide options
		
		var contentsObject = new THREE.Object3D();
		
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

		// We only vertically distribute the non-renderables
		// Renderables are centered in 0, 0 so it's easier to build animations that take over the entire screen, etc
		distributeObjects(contentsObject.children, { offset: 0, dimension: 'y', direction: -1 });
		
		slideObject.add(contentsObject);

		// Keep track of which object is it-we'll use it to zoom to that object
		// and ignore other objects that might act as decorations etc
		slideObject.contentsObject = contentsObject;

		addSpacing(slideObject);

		self.emit('processing_end', {
			slide: slideObject,
			element: element
		});
		
	};


	function addSpacing(slide) {

		var contentsObject = slide.contentsObject;
		var slidePadding = 20; // TODO slide.options.padding;
		var contentBox = makeObjectBox(contentsObject);
		var contentSize = contentBox.size();
		var contentCenter = contentBox.center();

		contentsObject.position.sub(contentCenter);

		// Create box helper including padding so as to 'grow' the slide
		contentBox.expandByScalar(slidePadding);
		contentSize = contentBox.size();
		var containerGeom = new THREE.BoxGeometry(contentSize.x, contentSize.y, contentSize.z);
		var containerMat = new THREE.MeshBasicMaterial({ color: 0xFF00FF, wireframe: true });
		var containerMesh = new THREE.Mesh(containerGeom, containerMat);
		// slide.add(containerMesh);
		
		containerGeom.computeFaceNormals();
		var helper = new THREE.BoxHelper(containerMesh, 0xFF00FF);
		//helper.material.opacity = 0.0;
		//helper.material.transparent = true;
		slide.add(helper);

	}
}

util.inherits(HTMLto3DSlideConverter, EventEmitter);

module.exports = HTMLto3DSlideConverter;
