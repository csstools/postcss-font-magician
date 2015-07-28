'use strict';

var Dacoda = require('dacoda').Dacoda;
var dacoda = new Dacoda();
var plugin = require('postcss-font-magician');
var prism = require('./index.prism.js');

function fromHash(string) {
	return decodeURIComponent(string.replace(/\+/g, ' '));
}

function toHash(string) {
	return encodeURIComponent(string)
		.replace(/%20/g, '+')
		.replace(/%24/g, '$')
		.replace(/%26/g, '&')
		.replace(/%3A/g, ':')
		.replace(/%3B/g, ';')
		.replace(/%40/g, '@');
}

function ontab(event) {
	var input = dacoda.element.input;
	var end = dacoda.current.end;
	var value = dacoda.current.value;

	// prevent default action
	event.preventDefault();

	// insert tab character
	input.value = value.slice(0, end) + '\t' + value.slice(end);

	// update selection range
	input.selectionStart = input.selectionEnd = end + 1;

	// dispatch value change event
	dacoda.dispatch('input', event);
}

// save event
function onsave(event) {
	// prevent default action
	event.preventDefault();

	location.hash = toHash(dacoda.current.value);
}

dacoda.observe('keydown').then(function (event) {
	if (event.keyCode === 9) return ontab.call(this, event);
	if (event.metaKey && event.keyCode === 83) return onsave.call(this, event);
});

dacoda.observe('input').then(function (event) {
	var element = dacoda.element;
	var value = dacoda.current.value;
	var output = value;

	// try to process output 
	try {
		output = plugin.process(output, {
			foundries: ['bootstrap', 'google'],
			safe: true
		});
	} catch (e) {}

	// set style and output
	element.style.innerHTML  = Prism.highlight(value,  Prism.languages.scss);
	element.output.innerHTML = Prism.highlight(output, Prism.languages.scss);
});

document.addEventListener('DOMContentLoaded', function () {
	var input = dacoda.element.input;
	var defaultValue = 'html {\n\tfont-size: 24px;\n}\n\nbody {\n\tfont-family: "Alice";\n}';

	input.value = location.href.slice(-1) === '#' || location.hash ? fromHash(location.hash.slice(1)) : defaultValue;

	dacoda.dispatch('input');

	document.body.appendChild(dacoda.element.block);
});
