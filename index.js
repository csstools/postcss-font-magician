var path = require('path');
var postcss = require('postcss');
var getDirectoryFonts = require('directory-fonts-complete');

var foundries = {
	directory: {},
	bootstrap: require('bootstrap-fonts-complete'),
	google: require('google-fonts-complete')
};

function getFormatValue(format) {
	return format === 'ttf' ? '"truetype"' : '"' + format + '"';
}

function getReferenceValue(type, reference) {
	return type + '(' + reference + ')';
}

function sortURLs(urlA, urlB) {
	var order = 'eot woff2 woff ttf svg'.split(' ');

	return order.indexOf(urlA) - order.indexOf(urlB);
}

function trimProtocol(url) {
	return url.replace(/^https?:/, '');
}

function trimQuotes(string) {
	return string.replace(/^(['"])(.+)\1$/g, '$2');
}

function safeQuotes(string) {
	var trimmedString = trimQuotes(string);

	return trimmedString.match(/\s/) ? '"' + trimmedString + '"' : trimmedString;
}

function getFontData(fontFamily, opts) {
	for (var name in foundries) {
		if (opts.foundries && opts.foundries.indexOf(name) !== -1) {
			var foundry = foundries[name];

			if (fontFamily in foundry) {
				return foundry[fontFamily];
			}
		}
	}
}

function setFontFaceRules(css, fontFamily, opts) {
	var fontData = getFontData(opts.aliases[fontFamily] || fontFamily, opts);
	var fontFaceRules = [];

	if (fontData) {
		Object.keys(fontData.variants).forEach(function (fontStyle) {
			var fontStyleData = fontData.variants[fontStyle];

			Object.keys(fontStyleData).forEach(function (fontWeight) {
				var fontSrc = [];
				var fontWeightData = fontStyleData[fontWeight];

				if (fontWeightData.local) {
					fontWeightData.local.forEach(function (local) {
						fontSrc.push(getReferenceValue('local', safeQuotes(local)));
					});
				}

				if (fontWeightData.url) {
					Object.keys(fontWeightData.url).sort(sortURLs).filter(function (format) {
						return opts.formats.indexOf(format) !== -1;
					}).forEach(function (format) {
						var url = trimProtocol(fontWeightData.url[format]);

						var formatValue = getFormatValue(format);

						if (format === 'eot') url += '?#';

						fontSrc.push(getReferenceValue('url', url) + ' ' + getReferenceValue('format', formatValue));
					});
				}

				var fontFaceRule = postcss.atRule({
					name: 'font-face'
				});

				fontFaceRule.append(postcss.decl({
					prop: 'font-family',
					value: safeQuotes(fontFamily)
				}));

				fontFaceRule.append(postcss.decl({
					prop: 'font-style',
					value: fontStyle
				}));

				fontFaceRule.append(postcss.decl({
					prop: 'font-weight',
					value: fontWeight
				}));

				fontFaceRule.append(postcss.decl({
					prop: 'src',
					value: fontSrc.join(',')
				}));

				fontFaceRules.push(fontFaceRule);
			});
		});
	}

	css.prepend(fontFaceRules);
}

function getFontFamily(value) {
	return trimQuotes(postcss.list.space(postcss.list.comma(value)[0]).slice(-1)[0]);
}

function getRelativeDirectory(cssPath, opts) {
	var directoryPath = path.dirname(cssPath || '.') + '/' + opts.directory;

	var cleanDirectoryPath = directoryPath.replace(/(^|\/)\.\//g, '$1').replace(/\/$/, '');

	return cleanDirectoryPath;
}

module.exports = postcss.plugin('postcss-font-magician', function (opts) {
	opts = opts || {};

	opts.aliases = 'aliases' in opts ? opts.aliases : {};
	opts.foundries = 'foundries' in opts ? opts.foundries : 'directory bootstrap google';
	opts.formats = 'formats' in opts ? opts.formats : 'eot ttf woff woff2';
	opts.directory = 'directory' in opts ? opts.directory : '';

	return function (css) {
		var fontFamilyInUse = {};
		var rules = [];

		var directory = getRelativeDirectory(css.source.input.file, opts);

		foundries.directory = opts.directory ? getDirectoryFonts(directory) : {};

		css.eachAtRule('font-face', function (rule) {
			rule.eachDecl('font-family', function (decl) {
				fontFamilyInUse[trimQuotes(decl.value)] = true;
			});
		});

		css.eachDecl(/^font(-family)?$/, function (decl) {
			var fontFamily = getFontFamily(decl.value);

			if (!fontFamilyInUse[fontFamily]) {
				fontFamilyInUse[fontFamily] = true;

				setFontFaceRules(css, fontFamily, opts);
			}
		});

		css.prepend(rules);
	};
});
