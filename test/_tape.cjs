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
	'google-fonts-once': {
		message: "adds google fonts once",
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
	'custom-google-fonts:with-default-formats': {
		message: "supports custom google fonts (default formats)",
		options: {
			variants: {
				'Open Sans': {
					'300': []
				}
			}
		},
	},
	'custom-google-fonts:unicode-range': {
		message: "supports custom unicode-range",
		options: {
			variants: {
				'Open Sans': {
					'300': [
						'woff',
						'U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF'
					],
					'400 italic': ['eot woff']
				}
			}
		},
	},
	'custom-google-fonts:unicode-range-google-subsets': {
		message: "supports custom unicode-range (google subsets)",
		options: {
			variants: {
				'Open Sans': {
					'300': [
						'woff2',
						'cyrillic, latin-ext'
					],
					'400 italic': ['woff2', 'vietnamese']
				}
			}
		},
	},
	'custom-google-fonts:custom-font-stretch-omit-normal': {
		message: "supports custom unicode-range (google subsets)",
		options: {
			variants: {
				'Open Sans': {
					'300 condensed': ['woff'],
					'400 italic': ['eot woff']
				}
			}
		},
	},
	'custom-google-fonts:custom-font-stretch-with-normal': {
		message: "supports custom unicode-range (google subsets)",
		options: {
			variants: {
				'Open Sans': {
					'300 normal condensed': ['woff'],
					'400 italic': ['eot woff']
				}
			}
		},
	},
	'custom-google-fonts:custom-font-stretch-with-italic': {
		message: "supports custom unicode-range (google subsets)",
		options: {
			variants: {
				'Open Sans': {
					'300': ['woff'],
					'400 italic ultra-condensed': ['eot woff']
				}
			}
		},
	},
	'ignore': {
		message: "supports ignoring a declaration",
	},
	'hosted-fonts': {
		message: "supports hosted fonts",
		options: {
			hosted: ['./test/fonts']
		}
	},
	'hosted-fonts:custom-font-path': {
		message: "supports hosted fonts",
		options: {
			hosted: ['./test/fonts', '/some/custom/path']
		},
	},
	'preserves-existing-font-face': {
		message: "does not overwrite existing @font-face rules",
	},
	'foundry-exclusion': {
		message: "support foundry exclusion",
		options: {
			foundries: 'hosted'
		},
	},
	'font-aliasing': {
		message: "support font aliasing",
		options: {
			aliases: {
				body: 'Open Sans'
			},
			variants: {
				body: {
					'400': ['woff']
				}
			}
		},
	},
	'custom-fonts': {
		message: "support custom fonts",
		options: {
			custom: {
				body: {
					variants: {
						normal: {
							400: {
								url: {
									woff2: 'path/to/my-body-font.woff2'
								}
							}
						}
					}
				}
			}
		},
	},
	'async-font-loading': {
		message: "support async font loading",
		options: {
			async: './test/async-font-loading.js'
		},
	},
	'protocol:http': {
		message: "supports custom configuration protocol (http)",
		options: {
			protocol: 'http:'
		},
	},
	'protocol:https': {
		message: "supports custom configuration protocol (https)",
		options: {
			protocol: 'https:'
		},
	},
	'material-icons': {
		message: "supports Material Icons",
		options: {
			protocol: 'https:'
		},
	},
});
