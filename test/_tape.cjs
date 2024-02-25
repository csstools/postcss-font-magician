const { postcssTape } = require('@csstools/postcss-tape');
const plugin = require('../index');

postcssTape(plugin)({
	'bootstrap-fonts': {
		message: "supports bootstrap fonts",
	},
	'bootstrap-fonts-once': {
		message: "adds bootstrap fonts once",
	},
	'google-fonts': {
		message: "supports google fonts",
	},
	'font-display-option': {
		message: "supports font-display option",
		options: {
			display: "swap",
		},
	},
	'custom-google-fonts': {
		message: "supports custom google fonts",
		options: {
			variants: {
				'Open Sans': {
					'300': ['woff'],
					'400 italic': ['eot woff']
				}
			}
		},
	},
});
