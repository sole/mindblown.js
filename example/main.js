(function() {

	window.addEventListener('DOMContentLoaded', init);

	var slides;

	function init() {
		// window.MindBlown is available

		var slidesSelector = '#slides section';
		slides = MindBlown(slidesSelector, {});
		
		var progressElement = document.getElementById('progress');

		slides.on('load_progress', function(ev) {
			progressElement.innerHTML = 'loaded ' + ev.value + '%';
		});

		slides.on('load_complete', finishInit);

		slides.on('change', function(ev) {
			saveURL(ev.index);
		});

		slides.load();

	}


	function finishInit() {
		console.log('Loading complete');
		
		var loaderElement = document.getElementById('loader');
		loaderElement.classList.add('transparent')

		var rendererContainer = document.getElementById('renderer');
		rendererContainer.appendChild(slides.renderer.domElement);
		rendererContainer.classList.remove('transparent');

		requestAnimationFrame(render);
	}


	function render(t) {
		// TODO uncomment
		// requestAnimationFrame(render);
		slides.render(t);
	}

})();
