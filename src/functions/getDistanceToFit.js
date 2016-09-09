var THREE = require('THREE');

module.exports = function getDistanceToFit(camera, object, canvasWidth, canvasHeight) {
	// Sort of comes from here http://stackoverflow.com/a/25597836/205721 but slightly modified to fit both width and height
	var vFOV = camera.fov * Math.PI / 180.0; 
	var ratio = 2 * Math.tan(vFOV / 2);
	var screen = ratio * (canvasWidth / canvasHeight); 
	var box = new THREE.Box3();
	box.setFromObject(object);
	var size = box.size();
	var height = size.y;
	var width = size.x;
	var distance = 1.2 * (Math.max(width, height) / screen); // / 4 ;
	return distance;
};
