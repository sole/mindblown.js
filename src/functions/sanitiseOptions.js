var defaults = {
	colours: require('../defaultSettings/colours'),
	customElements: {},
	renderer: require('../defaultSettings/renderer')
};

module.exports = function(options) {

	options = options || {};
	
	Object.keys(defaults).forEach((k) => {
		var optionsSet = options[k] || {};
		copyToObject(defaults[k], optionsSet);
		options[k] = defaults[k];
	});

	return options;

};

function copyToObject(dst, src) {
	var srcKeys = Object.keys(src);
	srcKeys.forEach((k) => {
		dst[k] = src[k];
	});
}
