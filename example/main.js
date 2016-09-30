(function() {

	window.addEventListener('DOMContentLoaded', init);

	var slides;

	function init() {
		// window.MindBlown is available

		var slidesSelector = '#slides section';
		slides = MindBlown(slidesSelector, {
			renderer: {
				cheap: false,
				width: 640,
				height: 360
			},
			customElements: {
				'cube': CubeElement
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

	function CubeElement(Renderable, THREE) {

		return function(element, audioContext, nodeProperties) {

			Renderable.call(this, audioContext);

			var n = 200;
			var osc;
			var gain = audioContext.createGain();
			gain.gain.value = 0.5;
			gain.connect(this.audioNode);
			
			console.log('init cube');
			console.log('audioContext', audioContext, 'props', nodeProperties);

			var helper = new THREE.AxisHelper(n);
			this.add(helper);

			var geom = new THREE.BoxGeometry(n, n, n);
			var mat = new THREE.MeshBasicMaterial({ color: 0x0000FF, wireframe: true });
			var mesh = new THREE.Mesh(geom, mat);
			this.add(mesh);

			this.activate = function() {
				console.log('activate cube');

				osc = audioContext.createOscillator();
				osc.connect(gain);
				osc.frequency.value = 110 + 110 * Math.random();
				osc.start();
				 
			};

			this.deactivate = function() {
				console.log('deactivate cube');
				if(osc) {
					osc.stop();
					osc = null;
				}
			};

			this.render = function(t) {
				mesh.rotation.y = t * 0.001;
			};
		
		}
	}

})();
