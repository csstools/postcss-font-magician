# PostCSS Font Magician [![Build Status][ci-img]][ci]

<img align="right" width="135" height="95" src="http://postcss.github.io/postcss/logo-leftp.png" title="Philosopher’s stone, logo of PostCSS">

[PostCSS Font Magician] is a [PostCSS] plugin that magically generates all the @font-face rules. Never write a `@font-face` rule again.

Not only are `@font-face` rules added automatically, but local fonts are always referenced first in order to save bandwidth. System fonts for serif and sans-serif will automatically follow Bootstrap’s typography preferences, and cached Google Fonts are automatically referenced whenever necessary.

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
         url("http://fonts.gstatic.com/s/alice/v7/acf9XsUhgp1k2j79ATk2cw.ttf") format("truetype"),
         url("http://fonts.gstatic.com/l/font?kit=1xLueNrnwaEUg1pDxEf7_A&skey=8a351bda90f672d8#Alice") format("svg")
}

body {
    font-family: "Alice";
}
```

## Coming Soon

This plugin is still in beta, so look forward to more magic, like:

- Automagical support for adjacent fonts.
- <s>Automagical support for the Google Font foundry.</s> 
- Automagical support for the TypeKit foundry.
- Magical option to rename any font family name.
- Magical enabling or disabling of any foundry (Bootstrap, Google, or TypeKit).

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
postcss([ require('postcss-font-magician')({ /* options */ }) ])
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

[ci]: https://travis-ci.org/jonathantneal/postcss-font-magician
[ci-img]: https://travis-ci.org/jonathantneal/postcss-font-magician.svg
[opening an issue]: https://github.com/jonathantneal/postcss-font-magician/issues
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Font Magician]: https://github.com/jonathantneal/postcss-font-magician
