var defined = require('defined');

/** Slides might define options via dataset attributes. We'll parse them here, important
 * to make sure that strings are converted to numbers where required (data set attributes are initially strings)
 */
module.exports = function parseSlideOptions(data, globalOptions) {
	
	var options = {};
	console.log(data);

	// In seconds - we'll convert to milliseconds. Default = 1 second
	options.transitionDuration = defined(data.transitionDuration, 1) * 1000.0;

	// Whitespace
	options.padding = defined(data.padding, 20) * 1.0;

	// TODO maybe convert to using a Vector3?
	options.offsetY = defined(data.offsetY, 0) * 1.0;

	return options;

};

