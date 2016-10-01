var makeObjectBox = require('./makeObjectBox');

module.exports = function(THREE) {

	return function debugObject(obj) {
		console.log(obj.id, obj.parent);
		//obj.traverse(debugObject);
		//var box = new THREE.BoundingBoxHelper(obj, 0x0);
		//box.update();
		var box = makeObjectBox(obj);
		var size = box.size();
		var cubeGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
		var dashMaterial = new THREE.LineDashedMaterial( { color: 0x000000, dashSize: 2, gapSize: 3 } );
		var cube = new THREE.Line( geo2line(cubeGeometry), dashMaterial, THREE.LinePieces );
		obj.add(cube);

	};

	function geo2line( geo ) // credit to WestLangley!
	{
		var geometry = new THREE.Geometry();
		var vertices = geometry.vertices;
		
		for ( i = 0; i < geo.faces.length; i++ ) 
		{
			var face = geo.faces[ i ];
			if ( face instanceof THREE.Face3 ) 
			{
				var a = geo.vertices[ face.a ].clone();
				var b = geo.vertices[ face.b ].clone();
				var c = geo.vertices[ face.c ].clone();
				vertices.push( a,b, b,c, c,a );
			} 
			else if ( face instanceof THREE.Face4 ) 
			{
				var a = geo.vertices[ face.a ].clone();
				var b = geo.vertices[ face.b ].clone();
				var c = geo.vertices[ face.c ].clone();
				var d = geo.vertices[ face.d ].clone();
				vertices.push( a,b, b,c, c,d, d,a );
			}
		}

		geometry.computeLineDistances();
		return geometry;
	}
};
