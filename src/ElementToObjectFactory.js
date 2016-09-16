var TextObject = require('./objects/Text');

module.exports = function(options, audioContext) {
	
	var knownElements = makeListOfKnownElements(options);
	var isElementKnown = makeIsElementKnownFunction(knownElements);

	this.convert = function(element) {

		var name = element.nodeName;
	
		// TODO check if 'data-replace' attribute is present on the node
		if(!isElementKnown(name)) {
			console.log('rejecting', name);
			return null;
		}

		var elementDefinition = knownElements[name];
		console.log(elementDefinition);

		return elementDefinition.constructor(element, audioContext, elementDefinition.settings);

	};

	
	function makeListOfKnownElements(options) {

		// TODO merge with potential element definitions from `options`

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

	function makeIsElementKnownFunction(knownElements) {

		var keys = Object.keys(knownElements);

		return function(name) {
			return keys.indexOf(name) !== -1;
		}
	
	}

};
