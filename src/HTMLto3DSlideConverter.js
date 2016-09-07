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
		// TODO make it create 0 sized boxes again (i.e. not ttt but 0, 0, 0)
		var ttt = 10 * Math.random();
		var dummy = new THREE.Mesh(new THREE.BoxGeometry(ttt,ttt,ttt), new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true }));
		contentsObject.add(dummy);

		
		// TODO rest of stuff, obviously
		var children = Array.from(element.childNodes);
		var isElementKnown = makeIsElementKnownFunction(options);
		
		console.log(children);
		var childObjects = children.filter(isElementKnown);//.map(elementTo3D);
		console.log(childObjects);

		//var childObjects = childrenTo3D(children, audioContext);
		//selectivelyAppend(childObjects, slideObject, contentsObject);
		
		slideObject.add(contentsObject);

		// Keep track of which object is it-we'll use it to zoom to that object
		// and ignore other objects that might act as decorations etc
		slideObject.contentsObject = contentsObject;


		self.emit('processing_end', {
			slide: slideObject,
			element: element
		});
		
	};

		
	function makeIsElementKnownFunction(options) {

		console.log('opt', options);

		var colours = options.colours;

		var knownNodes = {
			'H1': { size: 20, colour: colours.primary1 },
			'H2': { size: 10, colour: colours.primary2 },
			//'IMG': { replace: 'renderable' },
			'P': { size: 8, colour: colours.secondary1 },
			//'PRE': { replace: 'preformatted', colour: colours.secondary2, size: 7 }
		};

		var knownNodesKeys = Object.keys(knownNodes);

		return function(element) {
			var name = element.nodeName;
			return knownNodesKeys.indexOf(name) !== -1;
		}
	
	}
	
}

util.inherits(HTMLto3DSlideConverter, EventEmitter);

module.exports = HTMLto3DSlideConverter;
