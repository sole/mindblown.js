var TWEEN = require('tween.js');

module.exports = function tweenObject(object, destination, duration) {
	var tween = object.__internalTween;
	if(tween) {
		tween.stop();
	}

	tween = new TWEEN.Tween(object);
	tween.easing(TWEEN.Easing.Exponential.Out);
	tween.to(destination, duration);

	object.__internalTween = tween;
	return tween;
};
