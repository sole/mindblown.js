var sanitiseOptions = require('./sanitiseOptions');
var Slides = require('./Slides');

module.exports = function MindBlown(selector, options) {

	options = sanitiseOptions(options);
	var htmlSlides = Array.from(document.querySelectorAll(selector));
	var slides = new Slides(htmlSlides, options);

	return slides;

};
