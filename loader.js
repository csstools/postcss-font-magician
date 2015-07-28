function insertFontFaceRule(inlineStyle) {
	// set document head
	var head = document.head || document.getElementsByTagName('head')[0];

	// set style element
	var style = head.appendChild(document.createElement('style'));

	// return style element text
	return style.appendChild(
		document.createTextNode('@font-face{' + inlineStyle + '}')
	);
}

function insertFontFaceDetector(inlineStyle, family, fallback) {
	// set inline style
	var inlineStyle = inlineStyle.concat(detectorStyle);

	// generate font detection element
	var detectBlock = document.createElement('font-detection');

	// configure font detection element
	detectBlock.appendChild(document.createTextNode(detectorText));

	// update inline style to use fallback
	inlineStyle[0] = 'font-family:' + fallback;

	detectBlock.setAttribute('style', inlineStyle.join(';'));

	// append element to document body
	document.body.appendChild(detectBlock);

	var returnValue = {
		element: detectBlock,
		width: detectBlock.offsetWidth,
		height: detectBlock.offsetHeight
	};

	// update inline style to use family before fallback
	inlineStyle[0] = 'font-family:' + family + ',' + fallback;

	detectBlock.setAttribute('style', inlineStyle.join(';'));

	// return data about the element
	return returnValue;
}

function loadFont(family, weight, style, src) {
	// set generated family
	var familyGenerated = family + Math.floor(Math.random() * 99999999);

	// set inline style
	var inlineStyle = [
		'font-family:' + family,
		'font-style:' + style,
		'font-weight:' + weight
	];

	// set font face rule
	var styleText = insertFontFaceRule(
		inlineStyle.concat('src:' + src).join(';')
	);

	function onready() {
		if (document.readyState === 'complete') {
			// set detectors
			var detectors = {
				monospace: insertFontFaceDetector(inlineStyle, family, 'monospace'),
				sansserif: insertFontFaceDetector(inlineStyle, family, 'sans-serif'),
				serif: insertFontFaceDetector(inlineStyle, family, 'serif')
			};

			// set timeout
			function timeout() {
				if (
					detectors.monospace.width === detectors.monospace.element.offsetWidth &&
					detectors.monospace.height === detectors.monospace.element.offsetHeight &&
					detectors.sansserif.width === detectors.sansserif.element.offsetWidth &&
					detectors.sansserif.height === detectors.sansserif.element.offsetHeight &&
					detectors.serif.width === detectors.serif.element.offsetWidth &&
					detectors.serif.height === detectors.serif.element.offsetHeight
				) setImmediate(timeout);
				else {
					document.body.removeChild(detectors.monospace.element);
					document.body.removeChild(detectors.sansserif.element);
					document.body.removeChild(detectors.serif.element);

					styleText.nodeValue = styleText.nodeValue.replace(familyGenerated, family);
				}
			}

			timeout();
		} else setImmediate(onready);
	}

	onready();
}

function loadFonts(fonts) {
	var index = -1;

	while (font = fonts[++index]) {
		loadFont(font.family, font.weight, font.style, font.src);
	}
}

// set detect styles
var detectorStyle = [
	'clip:rect(0 0 0 0)',
	'overflow: hidden',
	'position: absolute'
];

// set detector text
var detectorText = 'AxmTYklsjo190QW';

// set immediate method
var setImmediate = window.requestAnimationFrame || window.setTimeout;
