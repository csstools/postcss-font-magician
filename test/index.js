/* global describe, it */
var postcss = require('postcss');
var expect = require('chai').expect;

var plugin = require('../');

var test = function(input, output, opts, done) {
    postcss([plugin(opts)])
        .process(input)
        .then(function(result) {
            result.root.walkAtRules('font-face', function(rule) {
                rule.walkDecls(function(decl) {
                    expect(typeof decl.value).to.eql('string');
                });
            });

            expect(result.css).to.eql(output);

            expect(result.warnings()).to.be.empty;

            done();
        })
        .catch(function(error) {
            done(error);
        });
};

describe('postcss-font-magician', function() {
    it('supports bootstrap fonts', function(done) {
        test(
            'a{font-family:monospace}b{}',

            '@font-face{font-family:monospace;font-style:italic;font-weight:400;src:local("Menlo Italic"),local(Menlo-Italic),local("Consolas Italic"),local(Consolas-Italic),local("Courier New Italic")}' +
                '@font-face{font-family:monospace;font-style:italic;font-weight:700;src:local("Menlo Bold Italic"),local(Menlo-BoldItalic),local(Monaco),local("Consolas Bold Italic"),local(Consolas-BoldItalic),local("Courier New Bold Italic")}' +
                '@font-face{font-family:monospace;font-style:normal;font-weight:400;src:local("Menlo Regular"),local(Menlo-Regular),local(Monaco),local(Consolas),local("Courier New")}' +
                '@font-face{font-family:monospace;font-style:normal;font-weight:700;src:local("Menlo Bold"),local(Menlo-Bold),local(Monaco),local("Consolas Bold"),local(Consolas-Bold),local("Courier New Bold")}' +
                'a{font-family:monospace}b{}',

            {},
            done
        );
    });

    it('adds bootstrap fonts once', function(done) {
        test(
            'a{font-family:monospace}b{font-family:monospace}',

            '@font-face{font-family:monospace;font-style:italic;font-weight:400;src:local("Menlo Italic"),local(Menlo-Italic),local("Consolas Italic"),local(Consolas-Italic),local("Courier New Italic")}' +
                '@font-face{font-family:monospace;font-style:italic;font-weight:700;src:local("Menlo Bold Italic"),local(Menlo-BoldItalic),local(Monaco),local("Consolas Bold Italic"),local(Consolas-BoldItalic),local("Courier New Bold Italic")}' +
                '@font-face{font-family:monospace;font-style:normal;font-weight:400;src:local("Menlo Regular"),local(Menlo-Regular),local(Monaco),local(Consolas),local("Courier New")}' +
                '@font-face{font-family:monospace;font-style:normal;font-weight:700;src:local("Menlo Bold"),local(Menlo-Bold),local(Monaco),local("Consolas Bold"),local(Consolas-Bold),local("Courier New Bold")}' +
                'a{font-family:monospace}b{font-family:monospace}',

            {},
            done
        );
    });

    it('supports google fonts', function(done) {
        test(
            'a{font-family:"Alice"}b{}',

            '@font-face{font-family:Alice;font-style:normal;font-weight:400;src:local("Alice Regular"),local(Alice-Regular),url(//fonts.gstatic.com/s/alice/v12/OpNCnoEEmtHa6GcOrgo.eot?#) format("eot"),url(//fonts.gstatic.com/s/alice/v12/OpNCnoEEmtHa6GcOrg4.woff2) format("woff2"),url(//fonts.gstatic.com/s/alice/v12/OpNCnoEEmtHa6GcOrgg.woff) format("woff")}a{font-family:"Alice"}b{}',
            {},
            done
        );
    });

    it('supports font-display option', function(done) {
        test(
            'a{font-family:"Alice"}b{}',

            '@font-face{font-family:Alice;font-style:normal;font-weight:400;src:local("Alice Regular"),local(Alice-Regular),url(//fonts.gstatic.com/s/alice/v12/OpNCnoEEmtHa6GcOrgo.eot?#) format("eot"),url(//fonts.gstatic.com/s/alice/v12/OpNCnoEEmtHa6GcOrg4.woff2) format("woff2"),url(//fonts.gstatic.com/s/alice/v12/OpNCnoEEmtHa6GcOrgg.woff) format("woff");font-display:swap}a{font-family:"Alice"}b{}',
            { display: 'swap' },
            done
        );
    });

    describe('Custom google fonts options:', function() {
        it('supports custom google fonts', function(done) {
            test(
                'a{font-family:"Open Sans"}b{}',

                '@font-face{font-family:"Open Sans";font-style:normal;font-weight:300;src:url(//fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OXOhv.woff) format("woff")}@font-face{font-family:"Open Sans";font-style:italic;font-weight:400;src:url(//fonts.gstatic.com/s/opensans/v18/mem6YaGs126MiZpBA-UFUK0Xdck.eot?#) format("eot"),url(//fonts.gstatic.com/s/opensans/v18/mem6YaGs126MiZpBA-UFUK0Xdcs.woff) format("woff")}a{font-family:"Open Sans"}b{}',
                {
                    variants: {
                        'Open Sans': {
                            '300': ['woff'],
                            '400 italic': ['eot woff']
                        }
                    }
                },
                done
            );
        });

        it('supports custom google fonts (default formats)', function(done) {
            test(
                'a{font-family:"Open Sans"}b{}',

                '@font-face{font-family:"Open Sans";font-style:normal;font-weight:300;src:local("Open Sans Light"),local(OpenSans-Light),url(//fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OXOht.eot?#) format("eot"),url(//fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhp.woff2) format("woff2"),url(//fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OXOhv.woff) format("woff")}a{font-family:"Open Sans"}b{}',

                {
                    variants: {
                        'Open Sans': {
                            '300': []
                        }
                    }
                },
                done
            );
        });

        it('supports custom unicode-range', function(done) {
            test(
                'a{font-family:"Open Sans"}b{}',

                '@font-face{font-family:"Open Sans";font-style:normal;font-weight:300;src:url(//fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OXOhv.woff) format("woff");unicode-range:U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF}@font-face{font-family:"Open Sans";font-style:italic;font-weight:400;src:url(//fonts.gstatic.com/s/opensans/v18/mem6YaGs126MiZpBA-UFUK0Xdck.eot?#) format("eot"),url(//fonts.gstatic.com/s/opensans/v18/mem6YaGs126MiZpBA-UFUK0Xdcs.woff) format("woff")}a{font-family:"Open Sans"}b{}',
                {
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
                done
            );
        });

        it('supports custom unicode-range (google subsets)', function(done) {
            test(
                'a{font-family:"Open Sans"}b{}',

                '@font-face{font-family:"Open Sans";font-style:normal;font-weight:300;src:url(//fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhp.woff2) format("woff2");unicode-range:U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116}@font-face{font-family:"Open Sans";font-style:normal;font-weight:300;src:url(//fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhp.woff2) format("woff2");unicode-range:U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF}@font-face{font-family:"Open Sans";font-style:italic;font-weight:400;src:url(//fonts.gstatic.com/s/opensans/v18/mem6YaGs126MiZpBA-UFUK0Zdc0.woff2) format("woff2");unicode-range:U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB}a{font-family:"Open Sans"}b{}',
                {
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
                done
            );
        });

        it('supports custom font-stretch: omit "normal" style', function(done) {
            test(
                'a{font-family:"Open Sans"}b{}',

                '@font-face{font-family:"Open Sans";font-style:normal;font-weight:300;src:url(//fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OXOhv.woff) format("woff");font-stretch:condensed}@font-face{font-family:"Open Sans";font-style:italic;font-weight:400;src:url(//fonts.gstatic.com/s/opensans/v18/mem6YaGs126MiZpBA-UFUK0Xdck.eot?#) format("eot"),url(//fonts.gstatic.com/s/opensans/v18/mem6YaGs126MiZpBA-UFUK0Xdcs.woff) format("woff")}a{font-family:"Open Sans"}b{}',
                {
                    variants: {
                        'Open Sans': {
                            '300 condensed': ['woff'],
                            '400 italic': ['eot woff']
                        }
                    }
                },
                done
            );
        });

        it('supports custom font-stretch: with "normal" style', function(done) {
            test(
                'a{font-family:"Open Sans"}b{}',

                '@font-face{font-family:"Open Sans";font-style:normal;font-weight:300;src:url(//fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OXOhv.woff) format("woff");font-stretch:condensed}@font-face{font-family:"Open Sans";font-style:italic;font-weight:400;src:url(//fonts.gstatic.com/s/opensans/v18/mem6YaGs126MiZpBA-UFUK0Xdck.eot?#) format("eot"),url(//fonts.gstatic.com/s/opensans/v18/mem6YaGs126MiZpBA-UFUK0Xdcs.woff) format("woff")}a{font-family:"Open Sans"}b{}',
                {
                    variants: {
                        'Open Sans': {
                            '300 normal condensed': ['woff'],
                            '400 italic': ['eot woff']
                        }
                    }
                },
                done
            );
        });

        it('supports custom font-stretch: with "italic" style', function(done) {
            test(
                'a{font-family:"Open Sans"}b{}',

                '@font-face{font-family:"Open Sans";font-style:normal;font-weight:300;src:url(//fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OXOhv.woff) format("woff")}@font-face{font-family:"Open Sans";font-style:italic;font-weight:400;src:url(//fonts.gstatic.com/s/opensans/v18/mem6YaGs126MiZpBA-UFUK0Xdck.eot?#) format("eot"),url(//fonts.gstatic.com/s/opensans/v18/mem6YaGs126MiZpBA-UFUK0Xdcs.woff) format("woff");font-stretch:ultra-condensed}a{font-family:"Open Sans"}b{}',
                {
                    variants: {
                        'Open Sans': {
                            '300': ['woff'],
                            '400 italic ultra-condensed': ['eot woff']
                        }
                    }
                },
                done
            );
        });
    });

    it('adds google fonts once', function(done) {
        test(
            'a{font-family:"Alice"}b{font-family:"Alice"}',

            '@font-face{font-family:Alice;font-style:normal;font-weight:400;src:local("Alice Regular"),local(Alice-Regular),url(//fonts.gstatic.com/s/alice/v12/OpNCnoEEmtHa6GcOrgo.eot?#) format("eot"),url(//fonts.gstatic.com/s/alice/v12/OpNCnoEEmtHa6GcOrg4.woff2) format("woff2"),url(//fonts.gstatic.com/s/alice/v12/OpNCnoEEmtHa6GcOrgg.woff) format("woff")}a{font-family:"Alice"}b{font-family:"Alice"}',

            {},
            done
        );
    });

    it('supports hosted fonts', function(done) {
        test(
            'a{font-family:"Source Sans Pro"}b{}',

            '@font-face{font-family:"Source Sans Pro";font-style:normal;font-weight:400;src:local(SourceSansPro-Regular),local(SourceSansPro-Regular),url(./test/fonts/pathFont.woff) format("woff")}' +
                'a{font-family:"Source Sans Pro"}b{}',

            {
                hosted: ['./test/fonts']
            },
            done
        );
    });

    it('supports hosted fonts (string fallback)', function(done) {
        test(
            'a{font-family:"Source Sans Pro"}b{}',

            '@font-face{font-family:"Source Sans Pro";font-style:normal;font-weight:400;src:local(SourceSansPro-Regular),local(SourceSansPro-Regular),url(./test/fonts/pathFont.woff) format("woff")}' +
                'a{font-family:"Source Sans Pro"}b{}',

            {
                hosted: './test/fonts'
            },
            done
        );
    });

    it('supports hosted fonts with custom font path', function(done) {
        test(
            'a{font-family:"Source Sans Pro"}b{}',

            '@font-face{font-family:"Source Sans Pro";font-style:normal;font-weight:400;src:local(SourceSansPro-Regular),local(SourceSansPro-Regular),url(/some/custom/path/pathFont.woff) format("woff")}' +
                'a{font-family:"Source Sans Pro"}b{}',

            {
                hosted: ['./test/fonts', '/some/custom/path']
            },
            done
        );
    });

    it('does not overwrite existing @font-face rules', function(done) {
        test(
            '@font-face{font-family:Alice}a{font-family:"Alice"}b{}',

            '@font-face{font-family:Alice}a{font-family:"Alice"}b{}',

            {},
            done
        );
    });

    it('support foundry exclusion', function(done) {
        test(
            'a{font-family:"Alice"}b{}',

            'a{font-family:"Alice"}b{}',

            {
                foundries: 'hosted'
            },
            done
        );
    });

    it('support font aliasing', function(done) {
        test(
            'a{font-family:body}b{}',

            '@font-face{font-family:body;font-style:normal;font-weight:400;src:url(//fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFW50d.woff) format("woff")}a{font-family:body}b{}',

            {
                aliases: {
                    body: 'Open Sans'
                },
                variants: {
                    body: {
                        '400': ['woff']
                    }
                }
            },
            done
        );
    });

    it('support custom fonts', function(done) {
        test(
            'a{font-family:body}b{}',

            '@font-face{font-family:body;font-style:normal;font-weight:400;src:url(path/to/my-body-font.woff2) format("woff2")}' +
                'a{font-family:body}b{}',

            {
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
            done
        );
    });

    it('support async font loading', function(done) {
        test(
            'a{font-family:Alice}b{}',

            'a{font-family:Alice}b{}',

            {
                async: './test/fontface.js.result'
            },
            done
        );
    });

    it('supports custom configuration protocol (http)', function(done) {
        test(
            'a{font-family:"Alice"}b{}',

            '@font-face{font-family:Alice;font-style:normal;font-weight:400;src:local("Alice Regular"),local(Alice-Regular),url(http://fonts.gstatic.com/s/alice/v12/OpNCnoEEmtHa6GcOrgo.eot?#) format("eot"),url(http://fonts.gstatic.com/s/alice/v12/OpNCnoEEmtHa6GcOrg4.woff2) format("woff2"),url(http://fonts.gstatic.com/s/alice/v12/OpNCnoEEmtHa6GcOrgg.woff) format("woff")}a{font-family:"Alice"}b{}',

            {
                protocol: 'http:'
            },
            done
        );
    });

    it('supports custom configuration protocol (https)', function(done) {
        test(
            'a{font-family:"Alice"}b{}',

            '@font-face{font-family:Alice;font-style:normal;font-weight:400;src:local("Alice Regular"),local(Alice-Regular),url(https://fonts.gstatic.com/s/alice/v12/OpNCnoEEmtHa6GcOrgo.eot?#) format("eot"),url(https://fonts.gstatic.com/s/alice/v12/OpNCnoEEmtHa6GcOrg4.woff2) format("woff2"),url(https://fonts.gstatic.com/s/alice/v12/OpNCnoEEmtHa6GcOrgg.woff) format("woff")}a{font-family:"Alice"}b{}',

            {
                protocol: 'https:'
            },
            done
        );
    });

    it('supports Material Icons', function(done) {
        test(
            'a{font-family:"Material Icons"}b{}',

            '@font-face{font-family:"Material Icons";font-style:normal;font-weight:400;src:url(//fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNY.eot?#) format("eot"),url(//fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format("woff2"),url(//fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.woff) format("woff")}a{font-family:"Material Icons"}b{}',

            {},
            done
        );
    });
});
