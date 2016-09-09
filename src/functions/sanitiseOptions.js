module.exports = function(options) {
	options = options || {};
	
	// TODO sanitise render options too, loading from ./defaultSettings/renderer.js
	options.colours = options.colours || require('../default-colours'); // TODO move to ./defaultSettings/colours.js

	return options;
};
