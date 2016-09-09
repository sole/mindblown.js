(function() {

	window.addEventListener('DOMContentLoaded', init);

	var slides;

	function init() {
		// window.MindBlown is available

		var slidesSelector = '#slides section';
		slides = MindBlown(slidesSelector, {
			renderer: {
				cheap: false,
				width: 320,
				height: 240
			}
		});
		
		var progressElement = document.getElementById('progress');

		slides.on('load_progress', function(ev) {
			progressElement.innerHTML = 'loaded ' + ev.value + '%';
		});

		slides.on('load_complete', finishInit);

		slides.on('change', function(ev) {
			// TODO saveURL(ev.index);
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
		slides.show(0); // TODO read slide number from url
	
		window.addEventListener('keyup', function(ev) {

		var keyCode = ev.keyCode;

		// Left arrow
		if(keyCode === 37 || keyCode === 33) {
			slides.showPrevious();
			// Right arrow
		} else if(keyCode === 39 || keyCode === 34) {
			slides.showNext();
			// F key
		} else if(keyCode === 70) {
			// TODO toggleFullScreen();
		} else if(keyCode === 51) {
			// 3 key
			// TODO slides.toggleAnaglyph();
		}

	}, false);

	}


	function render(t) {
		// TODO uncomment
		// requestAnimationFrame(render);
		slides.render(t);
	}

})();
