# Font Magician [![Build Status][ci-img]][ci]

<img align="right" width="135" height="95" src="http://postcss.github.io/postcss/logo-leftp.png" title="Philosopher’s stone, logo of PostCSS">

[Font Magician] is a [PostCSS] plugin that magically generates all of your `@font-face` rules. Never write a `@font-face` rule again.

Just use the **font** and **font-family** properties as if they were magic.

```css
/* before */

body {
   font-family: "Alice";
}

/* after */

@font-face {
   font-family: "Alice";
   font-style: normal;
   font-weight: 400;
   src: local("Alice"), local("Alice-Regular"),
        url("http://fonts.gstatic.com/s/alice/v7/sZyKh5NKrCk1xkCk_F1S8A.eot?#") format("eot"),
        url("http://fonts.gstatic.com/s/alice/v7/l5RFQT5MQiajQkFxjDLySg.woff2") format("woff2"),
        url("http://fonts.gstatic.com/s/alice/v7/_H4kMcdhHr0B8RDaQcqpTA.woff")  format("woff"),
        url("http://fonts.gstatic.com/s/alice/v7/acf9XsUhgp1k2j79ATk2cw.ttf")   format("truetype")
}

body {
  font-family: "Alice";
}
```

Want to use **Google Fonts**? I’ll add them for you.

Want to use the visitor’s **local** copy of a font? Done.

Want to **host** your own fonts? Just tell me where they are, and I’ll do the rest.

Want to load a font **async** and only use it after it has been loaded? I can do that too.

Want to use **Bootstrap** typography? Beautiful, fully-stacked families for **serif**, **sans-serif**, and **monospace** are waiting for you.

Seriously, never write a `@font-face` rule again.

Need more? Request additional magic by [creating an issue].

## Usage

Follow these steps to use [Font Magician]:

Add [Font Magician] to your build tool.
```sh
npm install postcss-font-magician --save-dev
```

### Node

1. Add [PostCSS] to your build tool:
   ```sh
   npm install postcss --save-dev
   ```

2. Use [Font Magician] in your script:
   ```js
   postcss([
      require('postcss-font-magician')({ /* options */ })
   ]).process(
      fs.readFileSync('./css/src/style.css', 'utf8')
   ).then(function (result) {
      fs.writeFileSync('./css/style.css', result.css);
   });
   ```

### Grunt

1. Add [Grunt PostCSS] to your build tool:
   ```sh
   npm install postcss-font-magician --save-dev
   ```

2. Use [Font Magician] in your Gruntfile:
   ```js
   grunt.loadNpmTasks('grunt-postcss');

   grunt.initConfig({
      postcss: {
         options: {
            processors: [
               require('postcss-font-magician')({ /* options */ })
            ]
         },
         src: './css/src/*.css',
         dest: './css'
      }
   });
   ```

### Gulp

1. Add [Gulp PostCSS] to your build tool:
   ```sh
   npm install --save-dev gulp-postcss
   ```

2. Use [Font Magician] in your Gulpfile:
   ```js
   var postcss = require('gulp-postcss');

   gulp.task('css', function () {
      return gulp.src('./css/src/*.css').pipe(
         postcss([
            require('postcss-font-magician')({ /* options */ })
         ])
      ).pipe(
         gulp.dest('./css')
      );
   });
   ```

## Options

#### hosted

Have a directory of self-hosted fonts?

```js
require('postcss-font-magician')({
   hosted: '../fonts'
});
```

The directory will be scanned for font files, which will be read and automatically added if they are used in the document.

#### aliases

Prefer another name for particular fonts?

```js
require('postcss-font-magician')({
   aliases: {
      'sans-serif': 'Source Sans Pro'
   }
});
```

The `@font-face` rule will be updated so that your alias key is the new name of the font family.

#### async

Need to load the fonts asynchronously?

```js
require('postcss-font-magician')({
   async: 'path/to/your-fonts-async-loader.js'
});
```

Any `@font-face` rules are moved out of CSS and into a JavaScript file may be added to a page separately. It will automatically load the fonts before using them.

#### formats

Want to control which font formats are used?

```js
require('postcss-font-magician')({
   formats: 'woff2 woff'
});
```

By default, `local`, `woff2`, `woff`, and `eot` are enabled.
Supported formats include `local`, `woff2`, `woff`, `ttf`, `eot`, `svg`, and `otf`.

#### foundries

Want to enable specific foundries?

```js
require('postcss-font-magician')({
   foundries: 'bootstrap google'
});
```

By default, all foundries are enabled.
Supported foundries include `custom`, `hosted`, `bootstrap`, and `google`.

#### custom

Need something very specific? I can do that, too.

```js
require('postcss-font-magician')({
   custom: {
      'My Special Font': {
         variants: {
            normal: {
               400: {
                  url: {
                     woff2: 'path/to/my-special-font.woff2'
                  }
               }
            }
         }
      }
   }
});
```

## Future

Look forward to more magic, like:

- Support for the TypeKit foundry.
- Option to warn you when unmatched typefaces are used.

Enjoy!

[ci]: https://travis-ci.org/jonathantneal/postcss-font-magician
[ci-img]: https://travis-ci.org/jonathantneal/postcss-font-magician.svg
[creating an issue]: https://github.com/jonathantneal/postcss-font-magician/issues
[Font Magician]: https://github.com/jonathantneal/postcss-font-magician
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[PostCSS]: https://github.com/postcss/postcss
