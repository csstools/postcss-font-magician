var postcss = require('postcss');

var foundries = {
	path: {},
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

function getFontData(fontFamily) {
	for (var name in foundries) {
		var foundry = foundries[name];

		if (fontFamily in foundry) {
			return foundry[fontFamily];
		}
	}
}

function setFontFaceRules(css, fontFamily) {
	var fontData = getFontData(fontFamily);
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
					Object.keys(fontWeightData.url).sort(sortURLs).forEach(function (format) {
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

module.exports = postcss.plugin('postcss-font-magician', function (opts) {
	opts = opts || {};

	return function (css) {
		var fontFamilyInUse = {};
		var rules = [];

		css.eachAtRule('font-face', function (rule) {
			rule.eachDecl('font-family', function (decl) {
				fontFamilyInUse[trimQuotes(decl.value)] = true;
			});
		});

		css.eachDecl(/^font(-family)?$/, function (decl) {
			var fontFamily = getFontFamily(decl.value);

			if (!fontFamilyInUse[fontFamily]) {
				fontFamilyInUse[fontFamily] = true;

				setFontFaceRules(css, fontFamily);
			}
		});

		css.prepend(rules);
	};
});
