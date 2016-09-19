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
			},
			replacements: {
				'cube': CubeReplacement
			}
		});
		
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
		readURL();
	
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
		requestAnimationFrame(render);
		slides.render(t);
	}


	function saveURL(index) {
		window.location.hash = index;
	}


	function readURL() {
		var index = 0;

		if(window.location.hash) {
			var hash = window.location.hash;
			hash = hash.replace('#', '');
			index = parseInt(hash, 10);
			if(isNaN(index)) {
				index = 0;
			}
		}

		slides.show(index);
	}

	function CubeReplacement(Renderable, THREE) {

		return function SceneCube(element, audioContext, nodeProperties) {

			Renderable.call(this, audioContext);

			var n = 200;
			
			console.log('init cube');

			var helper = new THREE.AxisHelper(n);
			this.add(helper);

			var geom = new THREE.BoxGeometry(n, n, n);
			var mat = new THREE.MeshBasicMaterial({ color: 0xFF00FF, linewidth: 4 });
			var mesh = new THREE.Mesh(geom, mat);
			this.add(mesh);

			this.activate = function() {
				console.log('activate cube');
			};

			this.deactivate = function() {
				console.log('deactivate cube');
			};	
		
		}
	}

})();
