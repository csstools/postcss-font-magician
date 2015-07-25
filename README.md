# PostCSS Font Magician [![Build Status][ci-img]][ci]

<img align="right" width="135" height="95" src="http://postcss.github.io/postcss/logo-leftp.png" title="Philosopher’s stone, logo of PostCSS">

[PostCSS Font Magician] is a [PostCSS] plugin that magically generates all of your `@font-face` rules. Never write a `@font-face` rule again.

Google Fonts are used automatically.

Local fonts are used automatically.

Using fonts in a directory? Just specify the `directory`. That’s it. Really.

Like Bootstrap typography? Families for `serif` and `sans-serif` are already configured.

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
    src: local("Alice"),
         local("Alice-Regular"),
         url("http://fonts.gstatic.com/s/alice/v7/sZyKh5NKrCk1xkCk_F1S8A.eot?") format("eot"),
         url("http://fonts.gstatic.com/s/alice/v7/l5RFQT5MQiajQkFxjDLySg.woff2") format("woff2"),
         url("http://fonts.gstatic.com/s/alice/v7/_H4kMcdhHr0B8RDaQcqpTA.woff") format("woff"),
         url("http://fonts.gstatic.com/s/alice/v7/acf9XsUhgp1k2j79ATk2cw.ttf") format("truetype")
}

body {
    font-family: "Alice";
}
```

Request more features by [opening an issue].

## Usage

You just need to follow these two steps to use [PostCSS Font Magician]:

1. Add [PostCSS] to your build tool.
2. Add [PostCSS Font Magician] as a PostCSS process.

```sh
npm install postcss-font-magician --save-dev
```

### Node

```js
require('postcss-font-magician')({ /* options */ }).process(some_css);
```

### Grunt

Add [Grunt PostCSS] to your build tool:

```sh
npm install postcss-font-magician --save-dev
```

Enable [PostCSS Font Magician] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
    postcss: {
        options: {
            processors: [
                require('postcss-font-magician')({ /* options */ })
            ]
        },
        dist: {
            src: 'css/*.css'
        }
    }
});
```

### Options

#### directory

Tell me the directory of your fonts. I’ve figured out what every font in there is anyway.

```js
require('postcss-font-magician')({
    directory: '../fonts'
});
```

#### aliases

When you say one thing you mean another. I got it.

```js
require('postcss-font-magician')({
    aliases: {
        'sans-serif': 'Source Sans Pro'
    }
});
```

#### formats

Tell me what formats you want to use. I’ll use them.

```js
require('postcss-font-magician')({
    formats: 'woff2 woff'
});
```

#### foundries

Enable or disable any foundry. You’re the boss.

```js
require('postcss-font-magician')({
    foundries: 'bootstrap google'
});
```

#### fonts

Must you be so specific? Very well.

```js
require('postcss-font-magician')({
    fonts: {
        'My Special Font': {
            variants: {
                400: {
                    normal: {
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

- <s>Support for fonts in a path.</s>
- <s>Support for the Google Font foundry.</s> 
- Support for the TypeKit foundry.
- <s>Option to disable any foundry.</s>
- <s>Option to alias any font family.</s>
- Option to put `@font-face` rules into a separate CSS file.
- Option to put `@font-face` rules into an JavaScript file for asynchronous loading.
- Option to warn you when fonts are used that do not have a `@font-face` rule.

Enjoy!

[ci]: https://travis-ci.org/jonathantneal/postcss-font-magician
[ci-img]: https://travis-ci.org/jonathantneal/postcss-font-magician.svg
[opening an issue]: https://github.com/jonathantneal/postcss-font-magician/issues
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Font Magician]: https://github.com/jonathantneal/postcss-font-magician
