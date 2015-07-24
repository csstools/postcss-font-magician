var foundries = {
	bootstrap: require('bootstrap-fonts-complete'),
	google: require('google-fonts-complete')
};

var postcss = require('postcss');

function getFormatValue(format) {
	return format === 'ttf' ? '\'truetype\'' : '\'' + format + '\'';
}

function getReferenceValue(type, reference) {
	return type + '(' + reference + ')';
}

function stripWrappingQuotes(string) {
	return string.replace(/^(['"])(.+)\1$/g, '$2');
}

function stripProtocol(url) {
	return url.replace(/^https?:/, '');
}

function sortURLs(urlA, urlB) {
	var order = 'eot woff2 woff ttf svg'.split(' ');

	return order.indexOf(urlA) - order.indexOf(urlB);
}

function getFontFoundry(family) {
	for (var name in foundries) {
		var foundry = foundries[name];

		if (family in foundry) {
			return foundry[family];
		}
	}

	return false;
}

function getFontFaceRules(css, family) {
	var font = getFontFoundry(family);
	var rules = [];

	if (font) {
		Object.keys(font.variants).forEach(function (style) {
			var srcs = [];
			var styles = font.variants[style];

			Object.keys(styles).forEach(function (weight) {
				var weights = styles[weight];

				if (weights.local) {
					weights.local.forEach(function (local) {
						srcs.push(getReferenceValue('local', local));
					});
				}

				if (weights.url) {
					Object.keys(weights.url).sort(sortURLs).forEach(function (format) {
						var url = stripProtocol(weights.url[format]);
						var formatValue = getFormatValue(format);

						if (format === 'eot') url += '?#';

						srcs.push(getReferenceValue('url', url) + ' ' + getReferenceValue('format', formatValue));
					});
				}

				var rule = postcss.atRule({
					name: 'font-face'
				});

				rule.append(postcss.decl({
					prop: 'font-family',
					value: family
				}));

				rule.append(postcss.decl({
					prop: 'font-style',
					value: style
				}));

				rule.append(postcss.decl({
					prop: 'font-weight',
					value: weight
				}));

				rule.append(postcss.decl({
					prop: 'src',
					value: srcs.join(', ')
				}));

				rules.push(rule);
			});
		});
	} else {
		// not found
	}

	return rules;
}

module.exports = postcss.plugin('postcss-font-magician', function (opts) {
	opts = opts || {};

	return function (css) {
		var rules = [];
		var families = {};

		css.eachAtRule('font-face', function (rule) {
			rule.eachDecl('font-family', function (decl) {
				var family = stripWrappingQuotes(decl.value);

				families[family] = true;
			});

			if (rule.params) {
				var params = postcss.list.space(rule.params);

				var name = params.splice(0, 1)[0];

				console.log(name, params);
			}
		});

		css.eachDecl(/^font(-family)?$/, function (decl) {
			postcss.list.space(decl.value).map(stripWrappingQuotes).forEach(function (family) {
				if (!families[family]) {
					families[family] = true;

					rules = rules.concat(getFontFaceRules(css, family));
				}
			});
		});

		css.prepend(rules);
	};
});
