var makeText = require('./makeText');

module.exports = function Text(element, audioContext, nodeProperties) {
	var str = element.textContent;
	var colour = nodeProperties.colour !== undefined ? nodeProperties.colour : 0xFF00FF;
	
	return makeText(str, {
		size: nodeProperties.size,
		depth: 1,
		curveSegments: 2,
		wireframe: true,
		color: colour,
		lineWidth: 1
	});
	
};
