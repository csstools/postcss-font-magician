// Required

const fs = require('fs');
const path = require('path');
const getDirectoryFonts = require('directory-fonts-complete');

// Options

const arrayOptions = [ 'foundries', 'foundriesOrder', 'formats', 'hosted' ];
const defaultOptions = {
	async: false,
	aliases: {},
	variants: {},
	custom: {},
	foundries: [ 'custom', 'hosted', 'bootstrap', 'google' ],
	formatHints: {
		otf: 'opentype',
		ttf: 'truetype'
	},
	formats: [ 'local', 'eot', 'woff2', 'woff' ],
	hosted: [],
	display: '',
	protocol: ''
};
const initialFoundries = {
	custom: {},
	hosted: {},
	bootstrap: require('./bootstrap-fonts-complete.json'),
	google: require('google-fonts-complete')
};

// Helper Methods

function getConfiguredOptions(options) {
	for (let key in defaultOptions) {
		if (key in options) {
			if (arrayOptions.includes(key) && typeof options[key] === 'string') {
				options[key] = options[key].replace(',', ' ').split(/\s+/);
			}
		} else {
			options[key] = defaultOptions[key];
		}
	}

	return options;
}

function getFont(family, foundries, options) {
	family = options.aliases[family] || family;

	for (let foundryName of options.foundries) {
		const foundry = foundries[foundryName];
		if (foundry && family in foundry) {
			return foundry[family];
		}
	}
	return null;
}

function getFormatHint(formatHints, extension) {
	return '"' + (formatHints[extension] || extension) + '"';
}

function getMethod(name, params) {
	return name + '(' + params + ')';
}

function getQuoteless(str) {
	return str.replace(/^(['"])(.+)\1$/g, '$2');
}

function getUnicodeRange(font, userRange) {
	if (!userRange) {
		return null;
	}
	const isValidUnicodeRange = /^U\+[0-9a-fA-F\-, ]+/g.test(userRange);

	const unicodeRangeList = userRange.replace(/\s/g, '').split(',');
	const isUserUnicodeRangeExist = unicodeRangeList.every(range => range in font.unicodeRange);
	if (font.unicodeRange && !isValidUnicodeRange && isUserUnicodeRangeExist) {
		return unicodeRangeList.map(range => font.unicodeRange[range]);
	} else {
		return [ userRange.toUpperCase() ];
	}
}

function getRelativePath(cssPath, relativePath) {
	cssPath = cssPath ? path.dirname(cssPath.toString()) : '';
	relativePath = path.resolve(process.cwd(), relativePath.toString());
	return path.relative(cssPath, relativePath);
}

function getSafelyQuoted(str) {
	str = getQuoteless(str);
	return str.match(/\s/) ? '"' + str + '"' : str;
}

function splitValue(value) {
	let splittedValue = value.split(' ');

	if (splittedValue.length) {
		if (!splittedValue[1] || ![ 'normal', 'italic' ].includes(splittedValue[1])) {
			splittedValue.splice(1, 0, 'normal');
		}

		return {
			weight: splittedValue[0],
			style: splittedValue[1],
			stretch: splittedValue[2] || ''
		};
	}
}

function removeTrailingSlash(url) {
	return url.replace(/\/$/, '');
}

function generateFont(postcss, node, family, fontFaceRules, options, defaultOptions) {
	// set the sources array
	let sources = [],
	formats = options.formats || defaultOptions.formats;

	// for each format
	formats.forEach((format) => {
		// if the format is local
		if (format === 'local' && options.urls.local) {
			// for each local font
			options.urls.local.forEach(local => {
				// set the source as the local font
				const localSource = getMethod('local', getSafelyQuoted(local));
				// add the source to the sources array
				sources.push(localSource);
			});
		} else if (options.urls.url) {
			let url = options.urls.url[format];
			// conditionally return early if no url is available
			if (!url) return;

			// change the font url protocol
			url = url.replace(/^https?:/, defaultOptions.protocol);

			// add the IE hack
			if (format === 'eot') {
				url += '?#';
			}

			// set the format hint and set the source as the url and format hint
			const formatHint = getFormatHint(defaultOptions.formatHints, format);
			const source = getMethod('url', url) + ' ' + getMethod('format', formatHint);
			sources.push(source);
		}
	});

	// if the sources array is filled
	if (sources.length) {
		// create a font face rule
		let fontFaceRule = postcss.atRule({
			name: 'font-face',
			source: node.source
		});

		fontFaceRule.append(
			// append a font-family declaration
			postcss.decl({
				prop: 'font-family',
				value: getSafelyQuoted(family),
				source: node.source
			}),
			// append a font-style declaration
			postcss.decl({
				prop: 'font-style',
				value: options.style,
				source: node.source
			}),
			// append a font-weight declaration
			postcss.decl({
				prop: 'font-weight',
				value: options.weight,
				source: node.source
			}),
			// append a src declaration
			postcss.decl({
				prop: 'src',
				value: sources.join(','),
				source: node.source
			})
		);

		// append a font-stretch declaration
		if (options.stretch) {
			fontFaceRule.append(
				postcss.decl({
					prop: 'font-stretch',
					value: options.stretch,
					source: node.source
				})
			);
		}

		// append a font-display declaration
		if (options.display) {
			fontFaceRule.append(
				postcss.decl({
					prop: 'font-display',
					value: options.display,
					source: node.source
				})
			);
		}

		// append an unicode-range declaration
		if (options.ranges) {
			options.ranges.forEach(range => {
				fontFaceRules.push(
					fontFaceRule.clone().append(
						postcss.decl({
							prop: 'unicode-range',
							value: range,
							source: node.source
						})
					)
				);
			});
		} else {
			fontFaceRules.push(fontFaceRule);
		}
	}

	return fontFaceRules;
}

// CSS Methods

function getValueByDeclaration(rule, property) {
	for (const declaration of rule.nodes) {
		if (declaration.prop === property) {
			return declaration.value;
		}
	}

	return '';
}

function getFirstFontFamily(list, decl) {
	return getQuoteless(
		list.space(
			list.comma(decl.value)[0]
		).slice(-1)[0]
	);
}

function getFontFaceRules(postcss, node, family, foundries, options) {
	let fontFaceRules = [];
	const font = getFont(family, foundries, options);

	const variants = options.variants;

	// conditionally return early if no font is found
	if (!font) {
		return fontFaceRules;
	}

	if (variants && variants[family] && !options.hosted.length) {
		Object.keys(variants[family]).forEach(key => {
			const variant = variants[family][key];
			const { weight, style, stretch } = splitValue(key);

			const formats = variant[0]
				? variant[0].replace(/\W+/g, ' ').split(' ')
				: options.formats;

			const ranges = getUnicodeRange(font, variant[1]);
			const googleWeights = font.variants[style];

			if (googleWeights && googleWeights[weight]) {
				fontFaceRules = generateFont(
					postcss,
					node,
					family,
					fontFaceRules,
					{
						style,
						urls: googleWeights[weight],
						weight,
						formats,
						ranges,
						stretch,
						display: options.display
					},
					options
				);
			}
		});
	} else {
		// for each font style
		Object.keys(font.variants).forEach(style => {
			// set the font weights
			const weights = font.variants[style];
			// for each font weight
			Object.keys(weights).forEach(weight => {
				const urls = weights[weight];
				fontFaceRules = generateFont(
					postcss,
					node,
					family,
					fontFaceRules,
					{
						style,
						urls,
						weight,
						formats: null,
						ranges: null,
						stretch: null,
						display: options.display
					},
					options
				);
			});
		});
	}

	return fontFaceRules;
}

function isRuleIgnored(rule) {
	let previous = rule.prev();

	if (
		previous &&
		previous.type === 'comment' &&
		/(!\s*)?font-magician:\s*ignore(-|\s+)next/i.test(previous.text)
	) {
		return true;
	}

	return false;
}

function prepend(root, nodes) {
	for (let i = 0; i < root.nodes.length; i++) {
		const child = root.nodes[i];

		if ('nodes' in child) {
			child.before(nodes);
			return;
		}
	}

	root.prepend(nodes);
}

function plugin(initialOptions) {
	// get configured option
	const options = getConfiguredOptions(initialOptions || {});
	// set the custom foundry
	const foundries = {
		...initialFoundries,
		custom: options.custom
	};

	// return the plugin
	return {
		postcssPlugin: 'postcss-font-magician',
		Once(root, { result, postcss, list }) {
			// set font families in use
			let fontFamiliesDeclared = {};
			let hostedOption = options.hosted;

			// if hosted fonts are present and permitted
			if (hostedOption.length) {
				options.foundries = [
					'hosted',
					...options.foundries.filter(f => f !== 'hosted')
				];

				// get the relative font path specified by the user
				if (typeof hostedOption === 'string') {
					hostedOption = hostedOption.split();
				}

				const relativePath = removeTrailingSlash(hostedOption[0]);

				// get the relative path to the font style file
				const relativeFontPath = root.source.input.file
				? getRelativePath(root.source.input.file, relativePath.toString())
				: null;

				// use the custom font path specified by the user or the relative path
				const customFontPath = hostedOption[1]
				? removeTrailingSlash(hostedOption[1])
				: relativeFontPath;

				// set the hosted fonts by relative directory
				foundries.hosted = getDirectoryFonts(relativePath, customFontPath, true);
			} else {
				// otherwise delete the hosted foundries
				delete foundries.hosted;
			}

			// for each font face rule
			root.walkAtRules('font-face', rule => {
				// for each font-family declaration
				rule.walkDecls('font-family', decl => {
					// set the font family
					const family = getQuoteless(decl.value);

					// set the font family as declared
					fontFamiliesDeclared[family] = true;
				});
			});

			// for each font declaration
			root.walkDecls(/^font(-family)?$/, decl => {
				// set the font family as the first declared font family
				const family = getFirstFontFamily(list, decl);

				// if the font family is not declared
				if (!fontFamiliesDeclared[family] && !isRuleIgnored(decl)) {
					// set the font family as declared
					fontFamiliesDeclared[family] = true;

					// set the font face rules
					const fontFaceRules = getFontFaceRules(postcss, decl, family, foundries, options);

					// if the font face rules array is filled
					if (fontFaceRules.length) {
						// prepend the font face rules
						prepend(root, fontFaceRules);
					}
				}
			});

			if (options.async) {
				let fontFaces = [];

				// for each font face rule
				root.walkAtRules('font-face', rule => {
					rule.remove();

					fontFaces.push({
						family: getValueByDeclaration(rule, 'font-family'),
						weight: getValueByDeclaration(rule, 'font-weight'),
						style: getValueByDeclaration(rule, 'font-style'),
						src: getValueByDeclaration(rule, 'src')
					});
				});

				if (fontFaces) {
					const asyncPath = path.resolve(process.cwd(), options.async)

					const asyncJs =
					'(function(){' +
					fs.readFileSync('loader.min.js', 'utf8') +
					'loadFonts(' +
					JSON.stringify(fontFaces) +
					')' +
					'})()';

					fs.writeFileSync(asyncPath, asyncJs);
				}
			}
		}
	};
}

plugin.postcss = true;

// set plugin
module.exports = plugin;
