var TextObject = require('./objects/Text');
var Renderable = require('./Renderable');
var THREE = require('THREE');

module.exports = function(options, audioContext) {
	
	var knownElements = makeListOfKnownElements(options);
	var isElementKnown = makeContainsFunction(knownElements);
	var customElements = makeCustomElementsList(options);

	this.convert = function(element) {

		var name = element.nodeName;
		var dataset = element.dataset || {};
	
		// We check if the 'data-custom-element' attribute is present on the node
		// If it is, it takes priority vs a possible element we might know how to render already
		var customElementName = dataset.customElement;
		var customElement = customElements[customElementName];
		var ctor;
		var settings;
		var object = null;
		
		if(customElement) {
			console.log('choosing customElement = ', customElementName);
			object = new customElement(element, audioContext, element.dataset);
		} else if(isElementKnown(name)) {
			var elementDefinition = knownElements[name];
			object = elementDefinition.constructor(element, audioContext, elementDefinition.settings);
		} else {
			console.log('rejecting', name);
		}

		if(object) {
			var isContent = true;
			console.log('***', dataset);
			if(dataset.isDecoration !== undefined) {
				isContent = false;
			}
			object.isContent = isContent;
		}

		return object;

	};

	
	function makeListOfKnownElements(options) {

		var list = makeTextElementsList(options);
		
		// TODO IMG
		// TODO PRE/CODE
		
		return list;

	}
	
	// We'll generate the list of text elements we know how to render using the TextObject class
	function makeTextElementsList(options) {
		
		var colours = options.colours;
		var ctor = TextObject;
		var pairs = {
			'H1': { size: 68.54, colour: colours.primary1 },
			'H2': { size: 42.36, colour: colours.primary2 },
			'H3': { size: 26.18, colour: colours.primary2 },
			'H4': { size: 16.18, colour: colours.primary2 },
			'P': { size: 10, colour: colours.secondary1 },
		};
		var defs = {};

		for(var k in pairs) {
			var def = {};
			def.settings = pairs[k];
			def.constructor = ctor;
			defs[k] = def;
		}

		return defs;

	}

	
	function makeContainsFunction(obj) {
		var keys = Object.keys(obj);
		return function(name) {
			return keys.indexOf(name) !== -1;
		};
	}


	// We cannot use the customElements directly because in order for them to use
	// both the same Renderable and THREE objects we have to generate their
	// constructors via the functions the author provided.
	// Then we need to augment their constructor prototype too (so authors don't
	// have to do it, which can be tedious)
	function makeCustomElementsList(options) {
		var sources = options.customElements;
		var keys = Object.keys(sources);
		var customElements = {};
		
		keys.forEach((k) => {
			var gen = sources[k];
			var ctor = gen(Renderable, THREE);
			ctor.prototype = Object.create(Renderable.prototype);
			ctor.prototype.constructor = ctor;
			customElements[k] = ctor;
		});

		return customElements;

	}

};
