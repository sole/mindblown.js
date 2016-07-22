module.exports = function(options) {
	options = options || {};
	
	options.colours = options.colours || require('./default-colours');

	return options;
};
