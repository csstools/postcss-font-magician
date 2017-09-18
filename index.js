/* Required
   ========================================================================== */

var fs = require('fs');
var path = require('path');
var postcss = require('postcss');
var getDirectoryFonts = require('directory-fonts-complete');

/* Options
   ========================================================================== */

var arrayOptions = ['foundries', 'foundriesOrder', 'formats'],
  defaultOptions = {
    async: false,
    aliases: {},
    variants: {},
    custom: {},
    foundries: ['custom', 'hosted', 'bootstrap', 'google'],
    formatHints: {
      otf: 'opentype',
      ttf: 'truetype'
    },
    formats: ['local', 'eot', 'woff2', 'woff'],
    hosted: [],
    display: '',
    protocol: ''
  },
  foundries = {
    custom: {},
    hosted: {},
    bootstrap: require('bootstrap-fonts-complete'),
    google: require('google-fonts-complete')
  };

/* Helper Methods
   ========================================================================== */

function getConfiguredOptions(options) {
  for (var key in defaultOptions) {
    if (key in options) {
      if (arrayOptions.indexOf(key) && typeof options[key] === 'string') {
        options[key] = options[key].replace(',', ' ').split(/\s+/);
      }
    } else {
      options[key] = defaultOptions[key];
    }
  }

  return options;
}

function getFont(family, options) {
  var index = -1,
    foundryName,
    foundry;

  family = options.aliases[family] || family;

  while (foundryName = options.foundries[++index]) {
    foundry = foundries[foundryName];

    if (foundry && family in foundry) {
      return foundry[family];
    }
  }
}

function getFormatHint(formatHints, extension) {
  return '"' + (formatHints[extension] || extension) + '"';
}

function getMethod(name, params) {
  return name + '(' + params + ')';
}

function getQuoteless(string) {
  return string.replace(/^(['"])(.+)\1$/g, '$2');
}

function getRelativePath(cssPath, relativePath) {
  relativePath = relativePath.toString();
  cssPath = cssPath ? path.dirname(cssPath.toString()) : '';
  relativePath = path.resolve(process.cwd(), relativePath);
  return path.relative(cssPath, relativePath);
}

function getSafelyQuoted(string) {
  string = getQuoteless(string);
  return string.match(/\s/) ? '"' + string + '"' : string;
}

function splitValue(value) {
  var splittedValue = value.split(' ');

  if (splittedValue.length) {
    if (
      !splittedValue[1] ||
      splittedValue[1] !== 'normal' && splittedValue[1] !== 'italic') {
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

function generateFont(family, fontFaceRules, options, defaultOptions) {
  // set the sources array
  var sources = [],
    formats = options.formats || defaultOptions.formats;

  // for each format
  formats.forEach(function (format) {
    var url, formatHint, source;

    // if the format is local
    if (format === 'local' && options.urls.local) {
      // for each local font
      options.urls.local.forEach(function (local) {
        // set the source as the local font
        var localSource = getMethod('local', getSafelyQuoted(local));
        // add the source to the sources array
        sources.push(localSource);
      });
    } else if (options.urls.url) {
      url = options.urls.url[format];
      // conditionally return early if no url is available
      if (!url) return;

      // change the font url protocol
      url = url.replace(/^https?:/, defaultOptions.protocol);

      // add the IE hack
      if (format === 'eot') {
        url += '?#';
      }

      // set the format hint and set the source as the url and format hint
      formatHint = getFormatHint(defaultOptions.formatHints, format);
      source = getMethod('url', url) + ' ' + getMethod('format', formatHint);
      sources.push(source);
    }
  });

  // if the sources array is filled
  if (sources.length) {

    // create a font face rule
    var fontFaceRule = postcss.atRule({
      name: 'font-face'
    });

    // append a font-family declaration
    fontFaceRule.append(postcss.decl({
      prop: 'font-family',
      value: getSafelyQuoted(family)
    }));

    // append a font-style declaration
    fontFaceRule.append(postcss.decl({
      prop: 'font-style',
      value: options.style
    }));

    // append a font-weight declaration
    fontFaceRule.append(postcss.decl({
      prop: 'font-weight',
      value: options.weight
    }));

    // append a src declaration
    fontFaceRule.append(postcss.decl({
      prop: 'src',
      value: sources.join(',')
    }));

    // append an unicode-range declaration
    if (options.ranges) {
      fontFaceRule.append(postcss.decl({
        prop: 'unicode-range',
        value: options.ranges
      }));
    }

    // append a font-stretch declaration
    if (options.stretch) {
      fontFaceRule.append(postcss.decl({
        prop: 'font-stretch',
        value: options.stretch
      }));
    }

    // append a font-display declaration
    if (options.display) {
      fontFaceRule.append(postcss.decl({
        prop: 'font-display',
        value: options.display
      }));
    }

    // return the font face rules array
    return [].concat(fontFaceRules, fontFaceRule);
  } else {
    return fontFaceRules;
  }
}


/* CSS Methods
   ========================================================================== */

function getValueByDeclaration(rule, property) {
  var index = -1,
    declaration;

  while (declaration = rule.nodes[++index]) {
    if (declaration.prop === property) {
      return declaration.value;
    }
  }

  return '';
}

function getFirstFontFamily(decl) {
  return getQuoteless(
    postcss.list.space(
      postcss.list.comma(decl.value)[0]
    ).slice(-1)[0]
  );
}

function getFontFaceRules(family, options) {
  var weight, style, formats, ranges, stretch, googleWeights, key, splittedValue,
    // set the font face rules array
    fontFaceRules = [],
    // get the font
    font = getFont(family, options),
    variants = options.variants;

  // conditionally return early if no font is found
  if (!font) {
    return fontFaceRules;
  }

  if (variants && variants[family] && !options.hosted.length) {
    for (key in variants[family]) {
      splittedValue = splitValue(key);
      weight = splittedValue.weight;
      style = splittedValue.style;
      stretch = splittedValue.stretch;
      formats = variants[family][key][0]
        ? variants[family][key][0].replace(/\W+/g, ' ').split(' ')
        : options.formats;
      ranges = variants[family][key][1]
        ? variants[family][key][1].toUpperCase()
        : null;
      googleWeights = font.variants[style];

      if (googleWeights && googleWeights[weight]) {
        fontFaceRules = generateFont(
          family,
          fontFaceRules,
          {
            style: style,
            urls: googleWeights[weight],
            weight: weight,
            formats: formats,
            ranges: ranges,
            stretch: stretch,
            display: options.display
          },
          options
        );
      }
    }
  } else {
    // for each font style
    Object.keys(font.variants).forEach(function (style) {
      // set the font weights
      var weights = font.variants[style];
      // for each font weight
      Object.keys(weights).forEach(function (weight) {
        var urls = weights[weight];
        fontFaceRules = generateFont(
          family,
          fontFaceRules,
          {
            style: style,
            urls: urls,
            weight: weight,
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

function plugin(options) {
  // get configured option
  options = getConfiguredOptions(options || {});
  // set the custom foundry
  foundries.custom = options.custom;

  // return the plugin
  return function (css) {
    // set font families in use
    var fontFamiliesDeclared = {},
      hostedIndex,
      relativePath,
      relativeFontPath,
      customFontPath;

    var hostedOption = options.hosted;

    // if hosted fonts are present and permitted
    if (hostedOption.length) {
      hostedIndex = options.foundries.indexOf('hosted');
      if (hostedIndex > 0) {
        options.foundries.splice(hostedIndex, 1);
      }
      options.foundries.unshift('hosted');

      // get the font relative path specified by the user
      if (typeof hostedOption === 'string') {
        hostedOption = hostedOption.split();
      }

      relativePath = removeTrailingSlash(hostedOption[0]);

      // get the relative path relative to the font style file
      relativeFontPath = css.source.input.file
        ? getRelativePath(css.source.input.file, relativePath.toString())
        : null;

      // use the custom font path specified by the user or the relative path
      customFontPath = hostedOption[1]
        ? removeTrailingSlash(hostedOption[1])
        : relativeFontPath;

      // set the hosted fonts by relative directory
      foundries.hosted = getDirectoryFonts(relativePath, customFontPath, true);
    } else {
      // otherwise delete the hosted foundries
      delete foundries.hosted;
    }

    // for each font face rule
    css.walkAtRules('font-face', function (rule) {
      // for each font-family declaration
      rule.walkDecls('font-family', function (decl) {
        // set the font family
        var family = getQuoteless(decl.value);

        // set the font family as declared
        fontFamiliesDeclared[family] = true;
      });
    });

    // for each font declaration
    css.walkDecls(/^font(-family)?$/, function (decl) {
      // set the font family as the first declared font family
      var family = getFirstFontFamily(decl);

      // if the font family is not declared
      if (!fontFamiliesDeclared[family]) {
        // set the font family as declared
        fontFamiliesDeclared[family] = true;

        // set the font face rules
        var fontFaceRules = getFontFaceRules(family, options);

        // if the font face rules array is filled
        if (fontFaceRules.length) {
          // prepend the font face rules
          css.prepend(fontFaceRules);
        }
      }
    });

    if (options.async) {
      var fontFaces = [];

      // for each font face rule
      css.walkAtRules('font-face', function (rule) {
        rule.remove();

        fontFaces.push({
          family: getValueByDeclaration(rule, 'font-family'),
          weight: getValueByDeclaration(rule, 'font-weight'),
          style: getValueByDeclaration(rule, 'font-style'),
          src: getValueByDeclaration(rule, 'src')
        });
      });

      if (fontFaces) {
        var asyncPath = getRelativePath(css.source.input.file, options.async);

        var asyncJs = '(function(){' +
          fs.readFileSync('loader.min.js', 'utf8') + 'loadFonts(' + JSON.stringify(fontFaces) + ')' +
          '})()';

        fs.writeFileSync(asyncPath, asyncJs);
      }
    }
  };
}

// set plugin
module.exports = postcss.plugin('postcss-font-magician', plugin);
