var TextObject = require('./objects/Text');

module.exports = function(options, audioContext) {
	
	var knownElements = makeListOfKnownElements(options);
	var isElementKnown = makeIsElementKnownFunction(knownElements);

	this.convert = function(element) {

		var name = element.nodeName;
		
		if(!isElementKnown(name)) {
			console.log('rejecting', name);
			return null;
		}

		var nodeProperties = knownElements[name];
		
		// TODO implement more than just text
		/*if(nodeProperties.replace) {
			return elementToReplacedObject(el, THREE, audioContext, nodeProperties);
		} else {
			return elementToTextObject(el, THREE, nodeProperties);
		}*/
		return TextObject(element, nodeProperties);
	};

	
	function makeListOfKnownElements(options) {
		// TODO merge with potential element definitions from `options`

		var colours = options.colours;

		return {
			'H1': { size: 20, colour: colours.primary1 },
			'H2': { size: 10, colour: colours.primary2 },
			// TODO 'IMG': { replace: 'renderable' },
			'P': { size: 8, colour: colours.secondary1 },
			// TODO 'PRE': { replace: 'preformatted', colour: colours.secondary2, size: 7 }
		};

	}
		
	function makeIsElementKnownFunction(knownElements) {

		var keys = Object.keys(knownElements);

		return function(name) {
			return keys.indexOf(name) !== -1;
		}
	
	}

};
