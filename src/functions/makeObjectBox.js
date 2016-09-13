var THREE = require('three');

/**
 * This function will create a box with sane dimensions, also
 * returning sane values for size() and center()
 */
module.exports = function(object) {

	var box = new THREE.Box3();
	box.setFromObject(object);

	// Careful here, if there are no objects inside the object, three.js creates a box
	// with "Infinity" dimensions... which messes up with everything else
	
	var boxMin = box.min;
	var boxMax = box.max;

	function equals(vec, value) {
		return (vec.x === value) && (vec.y === value) && (vec.z === value);
	}

	var minInf = equals(boxMin, Infinity);
	var maxInf = equals(boxMax, -Infinity);

	if(minInf && maxInf) {
		boxMin.set(0, 0, 0);
		boxMax.set(0, 0, 0);
	}

	return box;

}
