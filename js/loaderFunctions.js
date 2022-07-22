const mapSource =
	'https://storage.googleapis.com/noaa-nidis-drought-gov-data/current-conditions/json/v1/us/usdm/USDM-current.json';
window.onload = init();

/**
 * Attaces functions to relevant buttons in the DOM
 *
 */
function init() {
	const buttonJquery = document.getElementById('olJquery');
	const buttonFetch = document.getElementById('olFetch');
	const buttonXHR = document.getElementById('olXHR');
	buttonJquery.addEventListener('click', function () {
		olJquery('row-1');
	});
	buttonFetch.addEventListener('click', function () {
		olFetch('row-2');
	});
	buttonXHR.addEventListener('click', function () {
		olXHR('row-3');
	});
}

/**
 * Display the proccessing time for the function
 *
 * @param {string} tag the id of the selected button
 * @param {string} time the elapsed time to display
 *
 */
function displayTime(tag, time) {
	let text = document.getElementById(tag);
	text.innerText = time;
}

/**
 * Uses a jQuery AJAX call for an OL source object and reuses the object to populate maps
 *
 * @param {string} rowId The id for the div containing the maps to populate
 *
 */
function olJquery(rowId) {
	// start timer
	let startTime = performance.now();

	const divArray = document.querySelectorAll(`#${rowId} .map`);
	const mapArray = [];

	let vectorSource = new ol.source.Vector({
		format: new ol.format.TopoJSON(),
		loader: function () {
			$.ajax({
				type: 'GET',
				url: mapSource,
				dataType: 'json',
				success: function (response) {
					var features = vectorSource.getFormat().readFeatures(response, {
						dataProjection: 'EPSG:4326',
						featureProjection: 'EPSG:3857'
					});
					vectorSource.addFeatures(features);
				},
				fail: function (response) {
					console.log(response.status + ': ' + response.statusText);
				}
			});
		}
	});

	divArray.forEach(function (element, index) {
		element.style.backgroundColor = '#f6f6fa';
		let map = new ol.Map({
			view: new ol.View({
				center: [-50868082.00499239, 4706347.515686587],
				zoom: 3
			}),
			target: element.id
		});
		let layer = new ol.layer.Vector({
			source: vectorSource,
			visible: true,
			title: window['map' + ++index]
		});
		map.addLayer(layer);
		mapArray.push(map);
	});

	// stop timer and display results
	let endTime = performance.now();
	displayTime('olJquery', (endTime - startTime).toFixed(2));
}

/**
 * Uses a fetch method for an OL source object and reuses the object to populate maps
 *
 * @param {string} rowId The id for the div containing the maps to populate
 *
 */
function olFetch(rowId) {
	// start timer
	let startTime = performance.now();

	const divArray = document.querySelectorAll(`#${rowId} .map`);
	const mapArray = [];

	let vectorSource = new ol.source.Vector({
		format: new ol.format.TopoJSON(),
		loader: function () {
			fetch(mapSource)
				.then(response => handleErrors(response))
				.then(data => fetchSuccess(data))
				.catch(error => console.log(error));
			function handleErrors(response) {
				if (!response.ok) {
					throw response.status + ': ' + response.statusText;
				}
				return response.json();
			}
			function fetchSuccess(data) {
				var features = vectorSource.getFormat().readFeatures(data, {
					dataProjection: 'EPSG:4326',
					featureProjection: 'EPSG:3857'
				});
				vectorSource.addFeatures(features);
			}
		}
	});

	divArray.forEach(function (element, index) {
		element.style.backgroundColor = '#f6f6fa';
		let map = new ol.Map({
			view: new ol.View({
				center: [-50868082.00499239, 4706347.515686587],
				zoom: 3
			}),
			target: element.id
		});
		let layer = new ol.layer.Vector({
			source: vectorSource,
			visible: true,
			title: window['map' + ++index]
		});
		map.addLayer(layer);
		mapArray.push(map);
	});

	// stop timer and display results
	let endTime = performance.now();
	displayTime('olFetch', (endTime - startTime).toFixed(2));
}

/**
 * Uses the standard XHR method for an OL source object and reuses the object to populate maps
 *
 * @param {string} rowId The id for the div containing the maps to populate
 *
 */
function olXHR(rowId) {
	// start timer
	let startTime = performance.now();

	const divArray = document.querySelectorAll(`#${rowId} .map`);
	const mapArray = [];

	let vectorSource = new ol.source.Vector({
		url: mapSource,
		format: new ol.format.TopoJSON()
	});

	divArray.forEach(function (element, index) {
		element.style.backgroundColor = '#f6f6fa';
		let map = new ol.Map({
			view: new ol.View({
				center: [-50868082.00499239, 4706347.515686587],
				zoom: 3
			}),
			target: element.id
		});
		let layer = new ol.layer.Vector({
			source: vectorSource,
			visible: true,
			title: window['map' + ++index]
		});
		map.addLayer(layer);
		mapArray.push(map);
	});

	// stop timer and display results
	let endTime = performance.now();
	displayTime('olXHR', (endTime - startTime).toFixed(2));
	// displayTime('olJquery', endTime - startTime);
}
