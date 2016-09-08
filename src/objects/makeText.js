var THREE = require('three');
var defined = require('defined');

// This lets us include a default font in the bundle instead of loading it asynchronously
var defaultFontSrc = require('./helvetiker_regular.typeface.json');
var loader = new THREE.FontLoader();
var defaultFont = loader.parse(defaultFontSrc);


module.exports = function makeText(str, options) {
	
	options = options || {};

	var font = defined(options.font, defaultFont);
	var color = defined(options.color, 0x0000FF);
	var size = defined(options.size, 5);
	var weight = defined(options.weight, 'normal');
	var depth = defined(options.depth, 1);
	var curveSegments = defined(options.curveSegments, 2);
	var lineWidth = defined(options.lineWidth, 1);
	var wireframe = defined(options.wireframe, false);

	// This makes no freaking sense.
	// "height" is actually the depth (in Z),
	// "size" is the... thickness?
	//  (╯°□°）╯︵ ┻━┻
	var geom = new THREE.TextGeometry(str, {
		font: font,
		size: size,
		height: depth,
		weight: weight,
		curveSegments: curveSegments
	});

	geom.computeBoundingBox();
	geom.computeVertexNormals();

	var material = new THREE.MeshBasicMaterial({ wireframe: wireframe, color: color, wireframeLinewidth: lineWidth });

	material.wireframe = wireframe;
	material.wireframeLinewidth = 1;
	material.blending = THREE.AdditiveBlending;

	var obj = new THREE.Mesh(geom, material);

	return obj;

};
