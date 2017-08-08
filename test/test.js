var postcss = require('postcss');
var expect  = require('chai').expect;

var plugin = require('../');

var test = function (input, output, opts, done) {
  postcss([ plugin(opts) ]).process(input).then(function (result) {
    expect(result.css).to.eql(output);

    expect(result.warnings()).to.be.empty;

    done();
  }).catch(function (error) {
    done(error);
  });
};

describe('postcss-font-magician', function () {
  it('supports bootstrap fonts', function (done) {
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

  it('adds bootstrap fonts once', function (done) {
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

  it('supports google fonts', function (done) {
    test(
      'a{font-family:"Alice"}b{}',

      '@font-face{font-family:Alice;font-style:normal;font-weight:400;src:local("Alice Regular"),local(Alice-Regular),url(//fonts.gstatic.com/s/alice/v8/sZyKh5NKrCk1xkCk_F1S8A.eot?#) format("eot"),url(//fonts.gstatic.com/s/alice/v8/l5RFQT5MQiajQkFxjDLySg.woff2) format("woff2"),url(//fonts.gstatic.com/s/alice/v8/_H4kMcdhHr0B8RDaQcqpTA.woff) format("woff")}' +
      'a{font-family:"Alice"}b{}',

      {},
      done
    );
  });

  it('supports font-display option', function (done) {
    test(
      'a{font-family:"Alice"}b{}',

      '@font-face{font-family:Alice;font-style:normal;font-weight:400;src:local("Alice Regular"),local(Alice-Regular),url(//fonts.gstatic.com/s/alice/v8/sZyKh5NKrCk1xkCk_F1S8A.eot?#) format("eot"),url(//fonts.gstatic.com/s/alice/v8/l5RFQT5MQiajQkFxjDLySg.woff2) format("woff2"),url(//fonts.gstatic.com/s/alice/v8/_H4kMcdhHr0B8RDaQcqpTA.woff) format("woff");font-display:swap}' +
      'a{font-family:"Alice"}b{}',
      {
        display: 'swap'
      },
      done
    );
  });

  describe('Custom google fonts options:', function () {
    it('supports custom google fonts', function (done) {
      test(
        'a{font-family:"Open Sans"}b{}',

        '@font-face{font-family:"Open Sans";font-style:normal;font-weight:300;src:url(//fonts.gstatic.com/s/opensans/v13/DXI1ORHCpsQm3Vp6mXoaTXhCUOGz7vYGh680lGh-uXM.woff) format("woff")}@font-face{font-family:"Open Sans";font-style:italic;font-weight:400;src:url(//fonts.gstatic.com/s/opensans/v13/xjAJXh38I15wypJXxuGMBmfQcKutQXcIrRfyR5jdjY8.eot?#) format("eot"),url(//fonts.gstatic.com/s/opensans/v13/xjAJXh38I15wypJXxuGMBobN6UDyHWBl620a-IRfuBk.woff) format("woff")}a{font-family:"Open Sans"}b{}',
        {
          variants: {
                  'Open Sans': {
                      '300': ['woff'],
                      '400 italic': ["eot woff"]
                  }
              }
        },
        done
      );
    });

    it('supports custom google fonts (default formats)', function (done) {
      test(
        'a{font-family:"Open Sans"}b{}',

        '@font-face{font-family:"Open Sans";font-style:normal;font-weight:300;src:local("Open Sans Light"),local(OpenSans-Light),url(//fonts.gstatic.com/s/opensans/v13/DXI1ORHCpsQm3Vp6mXoaTXZ2MAKAc2x4R1uOSeegc5U.eot?#) format("eot"),url(//fonts.gstatic.com/s/opensans/v13/DXI1ORHCpsQm3Vp6mXoaTegdm0LZdjqr5-oayXSOefg.woff2) format("woff2"),url(//fonts.gstatic.com/s/opensans/v13/DXI1ORHCpsQm3Vp6mXoaTXhCUOGz7vYGh680lGh-uXM.woff) format("woff")}a{font-family:"Open Sans"}b{}',

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

    it('supports custom unicode-range', function (done) {
      test(
        'a{font-family:"Open Sans"}b{}',

        '@font-face{font-family:"Open Sans";font-style:normal;font-weight:300;src:url(//fonts.gstatic.com/s/opensans/v13/DXI1ORHCpsQm3Vp6mXoaTXhCUOGz7vYGh680lGh-uXM.woff) format("woff");unicode-ranges:U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF}@font-face{font-family:"Open Sans";font-style:italic;font-weight:400;src:url(//fonts.gstatic.com/s/opensans/v13/xjAJXh38I15wypJXxuGMBmfQcKutQXcIrRfyR5jdjY8.eot?#) format("eot"),url(//fonts.gstatic.com/s/opensans/v13/xjAJXh38I15wypJXxuGMBobN6UDyHWBl620a-IRfuBk.woff) format("woff")}a{font-family:"Open Sans"}b{}',
        {
          variants: {
                  'Open Sans': {
                      '300': ['woff', 'U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF'],
                      '400 italic': ["eot woff"]
                  }
              }
        },
        done
      );
    });

    it('supports custom font-stretch: omit "normal" style', function (done) {
      test(
        'a{font-family:"Open Sans"}b{}',

        '@font-face{font-family:"Open Sans";font-style:normal;font-weight:300;src:url(//fonts.gstatic.com/s/opensans/v13/DXI1ORHCpsQm3Vp6mXoaTXhCUOGz7vYGh680lGh-uXM.woff) format("woff");font-stretch:condensed}@font-face{font-family:"Open Sans";font-style:italic;font-weight:400;src:url(//fonts.gstatic.com/s/opensans/v13/xjAJXh38I15wypJXxuGMBmfQcKutQXcIrRfyR5jdjY8.eot?#) format("eot"),url(//fonts.gstatic.com/s/opensans/v13/xjAJXh38I15wypJXxuGMBobN6UDyHWBl620a-IRfuBk.woff) format("woff")}a{font-family:"Open Sans"}b{}',
        {
          variants: {
                  'Open Sans': {
                      '300 condensed': ['woff'],
                      '400 italic': ["eot woff"]
                  }
              }
        },
        done
      );
    });

    it('supports custom font-stretch: with "normal" style', function (done) {
      test(
        'a{font-family:"Open Sans"}b{}',

        '@font-face{font-family:"Open Sans";font-style:normal;font-weight:300;src:url(//fonts.gstatic.com/s/opensans/v13/DXI1ORHCpsQm3Vp6mXoaTXhCUOGz7vYGh680lGh-uXM.woff) format("woff");font-stretch:condensed}@font-face{font-family:"Open Sans";font-style:italic;font-weight:400;src:url(//fonts.gstatic.com/s/opensans/v13/xjAJXh38I15wypJXxuGMBmfQcKutQXcIrRfyR5jdjY8.eot?#) format("eot"),url(//fonts.gstatic.com/s/opensans/v13/xjAJXh38I15wypJXxuGMBobN6UDyHWBl620a-IRfuBk.woff) format("woff")}a{font-family:"Open Sans"}b{}',
        {
          variants: {
                  'Open Sans': {
                      '300 normal condensed': ['woff'],
                      '400 italic': ["eot woff"]
                  }
              }
        },
        done
      );
    });

    it('supports custom font-stretch: with "italic" style', function (done) {
      test(
        'a{font-family:"Open Sans"}b{}',

        '@font-face{font-family:"Open Sans";font-style:normal;font-weight:300;src:url(//fonts.gstatic.com/s/opensans/v13/DXI1ORHCpsQm3Vp6mXoaTXhCUOGz7vYGh680lGh-uXM.woff) format("woff")}@font-face{font-family:"Open Sans";font-style:italic;font-weight:400;src:url(//fonts.gstatic.com/s/opensans/v13/xjAJXh38I15wypJXxuGMBmfQcKutQXcIrRfyR5jdjY8.eot?#) format("eot"),url(//fonts.gstatic.com/s/opensans/v13/xjAJXh38I15wypJXxuGMBobN6UDyHWBl620a-IRfuBk.woff) format("woff");font-stretch:ultra-condensed}a{font-family:"Open Sans"}b{}',
        {
          variants: {
                  'Open Sans': {
                      '300': ['woff'],
                      '400 italic ultra-condensed': ["eot woff"]
                  }
              }
        },
        done
      );
    });
  });

  it('adds google fonts once', function (done) {
    test(
      'a{font-family:"Alice"}b{font-family:"Alice"}',

      '@font-face{font-family:Alice;font-style:normal;font-weight:400;src:local("Alice Regular"),local(Alice-Regular),url(//fonts.gstatic.com/s/alice/v8/sZyKh5NKrCk1xkCk_F1S8A.eot?#) format("eot"),url(//fonts.gstatic.com/s/alice/v8/l5RFQT5MQiajQkFxjDLySg.woff2) format("woff2"),url(//fonts.gstatic.com/s/alice/v8/_H4kMcdhHr0B8RDaQcqpTA.woff) format("woff")}' +
      'a{font-family:"Alice"}b{font-family:"Alice"}',

      {},
      done
    );
  });

  it('supports hosted fonts', function (done) {
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

  it('supports hosted fonts (string fallback)', function (done) {
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

  it('supports hosted fonts with custom font path', function (done) {
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

  it('does not overwrite existing @font-face rules', function (done) {
    test(
      '@font-face{font-family:Alice}a{font-family:"Alice"}b{}',

      '@font-face{font-family:Alice}a{font-family:"Alice"}b{}',

      {},
      done
    );
  });

  it('support foundry exclusion', function (done) {
    test(
      'a{font-family:"Alice"}b{}',

      'a{font-family:"Alice"}b{}',

      {
        foundries: 'hosted'
      },
      done
    );
  });

  it('support font aliasing', function (done) {
    test(
      'a{font-family:body}b{}',

      '@font-face{font-family:body;font-style:italic;font-weight:100;src:local("Montserrat Thin Italic"),local(Montserrat-ThinItalic),url(//fonts.gstatic.com/s/montserrat/v10/1809Y0aW9bpFOPXsQTFwf9P2OS6Bzu7BENq0TH5sayk.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/1809Y0aW9bpFOPXsQTFwf1dBB84BqlWy1BjOnCrU9PY.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/1809Y0aW9bpFOPXsQTFwfy1dfeF-hbOdKKuBDEXxqhQ.woff) format("woff")}@font-face{font-family:body;font-style:italic;font-weight:200;src:local("Montserrat ExtraLight Italic"),local(Montserrat-ExtraLightItalic),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft2hUd5_HpjpfImmlNZG9RF4.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft5dxImagpP7sHxM18iKeP-M.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft_7J9eW2S58LCMPoFblzf2g.woff) format("woff")}@font-face{font-family:body;font-style:italic;font-weight:300;src:local("Montserrat Light Italic"),local(Montserrat-LightItalic),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft4ySLpARcVRs9uFJp0LRZgE.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft04GofcKVZz6wtzX_QUIqsI.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft2Fp2sMiApZm5Dx7NpSTOZk.woff) format("woff")}@font-face{font-family:body;font-style:italic;font-weight:400;src:local("Montserrat Italic"),local(Montserrat-Italic),url(//fonts.gstatic.com/s/montserrat/v10/-iqwlckIhsmvkx0N6rwPmnZ2MAKAc2x4R1uOSeegc5U.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/-iqwlckIhsmvkx0N6rwPmugdm0LZdjqr5-oayXSOefg.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/-iqwlckIhsmvkx0N6rwPmnhCUOGz7vYGh680lGh-uXM.woff) format("woff")}@font-face{font-family:body;font-style:italic;font-weight:500;src:local("Montserrat Medium Italic"),local(Montserrat-MediumItalic),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9FtzHhXAPWOXQc-mHRKx4oalk.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft81Lch-SD8r0CsJ60meulZ8.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9FtxF47VQSRrvbVYTKIrepY7I.woff) format("woff")}@font-face{font-family:body;font-style:italic;font-weight:600;src:local("Montserrat SemiBold Italic"),local(Montserrat-SemiBoldItalic),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9FtzBIQ40lcwWW3vj9tFMKvqw.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft_Bf3Xtc57ojmY2ox2Xv8Go.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft9Od4RnLmtUrdSQkDmC5b8k.woff) format("woff")}@font-face{font-family:body;font-style:italic;font-weight:700;src:local("Montserrat Bold Italic"),local(Montserrat-BoldItalic),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft2msoyWrDyoltQVIP7q_RGg.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft3NuWYKPzoeKl5tYj8yhly0.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft3l4twXkwp3_u9ZoePkT564.woff) format("woff")}@font-face{font-family:body;font-style:italic;font-weight:800;src:local("Montserrat ExtraBold Italic"),local(Montserrat-ExtraBoldItalic),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft9Kd--5SjvBBPdO8SYNBozY.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9FtxqoE9FO9sRveXk8Nnop4Zo.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft2pVmE9oLybi4D_AN-2K110.woff) format("woff")}@font-face{font-family:body;font-style:italic;font-weight:900;src:local("Montserrat Black Italic"),local(Montserrat-BlackItalic),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft19iNfvTt1gMvrhy159_6ck.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ft9DLwwZd-mS_8JqJ_KGXwxs.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/zhwB3-BAdyKDf0geWr9Ftwi3Hume1-TKjJz2lX0jYjo.woff) format("woff")}@font-face{font-family:body;font-style:normal;font-weight:100;src:local("Montserrat Thin"),local(Montserrat-Thin),url(//fonts.gstatic.com/s/montserrat/v10/CdKWaRAal2Bxq9mORLKRRXZ2MAKAc2x4R1uOSeegc5U.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/CdKWaRAal2Bxq9mORLKRRegdm0LZdjqr5-oayXSOefg.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/CdKWaRAal2Bxq9mORLKRRXhCUOGz7vYGh680lGh-uXM.woff) format("woff")}@font-face{font-family:body;font-style:normal;font-weight:200;src:local("Montserrat ExtraLight"),local(Montserrat-ExtraLight),url(//fonts.gstatic.com/s/montserrat/v10/eWRmKHdPNWGn_iFyeEYja26IuzAwjfI5Pbb6jofSqzk.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/eWRmKHdPNWGn_iFyeEYja6EWXqnGSfwnQD3YDlprsb0.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/eWRmKHdPNWGn_iFyeEYjaxp4ivTFcMoDJtPEqAe9hmM.woff) format("woff")}@font-face{font-family:body;font-style:normal;font-weight:300;src:local("Montserrat Light"),local(Montserrat-Light),url(//fonts.gstatic.com/s/montserrat/v10/IVeH6A3MiFyaSEiudUMXE6SxSvC1lIsK_unZDHWqTBg.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/IVeH6A3MiFyaSEiudUMXE8u2Q0OS-KeTAWjgkS85mDg.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/IVeH6A3MiFyaSEiudUMXE9kZXW4sYc4BjuAIFc1SXII.woff) format("woff")}@font-face{font-family:body;font-style:normal;font-weight:400;src:local("Montserrat Regular"),local(Montserrat-Regular),url(//fonts.gstatic.com/s/montserrat/v10/zhcz-_WihjSQC0oHJ9TCYFQlYEbsez9cZjKsNMjLOwM.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/zhcz-_WihjSQC0oHJ9TCYPk_vArhqVIZ0nv9q090hN8.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/zhcz-_WihjSQC0oHJ9TCYBsxEYwM7FgeyaSgU71cLG0.woff) format("woff")}@font-face{font-family:body;font-style:normal;font-weight:500;src:local("Montserrat Medium"),local(Montserrat-Medium),url(//fonts.gstatic.com/s/montserrat/v10/BYPM-GE291ZjIXBWrtCweoJh5taHiwXv-DjBEZUuYXM.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/BYPM-GE291ZjIXBWrtCwejOo-lJoxoMO4vrg2XwIHQk.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/BYPM-GE291ZjIXBWrtCweu46x7QEqGuF-FJIFiH1W2g.woff) format("woff")}@font-face{font-family:body;font-style:normal;font-weight:600;src:local("Montserrat SemiBold"),local(Montserrat-SemiBold),url(//fonts.gstatic.com/s/montserrat/v10/q2OIMsAtXEkOulLQVdSl08G3e9iX24ta7lLMfbqPFME.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/q2OIMsAtXEkOulLQVdSl06VlZKEoJGujTpfWnQT9bUY.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/q2OIMsAtXEkOulLQVdSl024H_cQCpNmkmj7HsMzmiiM.woff) format("woff")}@font-face{font-family:body;font-style:normal;font-weight:700;src:local("Montserrat Bold"),local(Montserrat-Bold),url(//fonts.gstatic.com/s/montserrat/v10/IQHow_FEYlDC4Gzy_m8fcmzklk6MJbhg7BmBP42CjCQ.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/IQHow_FEYlDC4Gzy_m8fcoWiMMZ7xLd792ULpGE4W_Y.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/IQHow_FEYlDC4Gzy_m8fcgFhaRv2pGgT5Kf0An0s4MM.woff) format("woff")}@font-face{font-family:body;font-style:normal;font-weight:800;src:local("Montserrat ExtraBold"),local(Montserrat-ExtraBold),url(//fonts.gstatic.com/s/montserrat/v10/H8_7oktkjVeeX06kbAvc0B8AHhEfjUJjouFVttJjJoo.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/H8_7oktkjVeeX06kbAvc0Ary2jK1Y0oNyoF1xLf3zMQ.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/H8_7oktkjVeeX06kbAvc0CS-0kw_uRLN9JEz12uqVRQ.woff) format("woff")}@font-face{font-family:body;font-style:normal;font-weight:900;src:local("Montserrat Black"),local(Montserrat-Black),url(//fonts.gstatic.com/s/montserrat/v10/aEu-9ATAroJ1iN4zmQ55BsWwaGkf25P-zZOrMBTzpJc.eot?#) format("eot"),url(//fonts.gstatic.com/s/montserrat/v10/aEu-9ATAroJ1iN4zmQ55Bsjsb7Oq0o-uqUFW7Ygu5rM.woff2) format("woff2"),url(//fonts.gstatic.com/s/montserrat/v10/aEu-9ATAroJ1iN4zmQ55BoPAkl-0rCkX4F4zIO7lYWE.woff) format("woff")}' +
      'a{font-family:body}b{}',

      {
        aliases: {
          body: 'Montserrat'
        }
      },
      done
    );
  });

  it('support custom fonts', function (done) {
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

  it('support async font loading', function (done) {
    test(
      'a{font-family:Alice}b{}',

      'a{font-family:Alice}b{}',

      {
        async: './test/fontface.js.result'
      },
      done
    );
  });

  it('supports custom configuration protocol (http)', function (done) {
    test(
      'a{font-family:"Alice"}b{}',

      '@font-face{font-family:Alice;font-style:normal;font-weight:400;src:local("Alice Regular"),local(Alice-Regular),url(http://fonts.gstatic.com/s/alice/v8/sZyKh5NKrCk1xkCk_F1S8A.eot?#) format("eot"),url(http://fonts.gstatic.com/s/alice/v8/l5RFQT5MQiajQkFxjDLySg.woff2) format("woff2"),url(http://fonts.gstatic.com/s/alice/v8/_H4kMcdhHr0B8RDaQcqpTA.woff) format("woff")}' +
      'a{font-family:"Alice"}b{}',

      {
        protocol: 'http:'
      },
      done
    );
  });

  it('supports custom configuration protocol (https)', function (done) {
    test(
      'a{font-family:"Alice"}b{}',

      '@font-face{font-family:Alice;font-style:normal;font-weight:400;src:local("Alice Regular"),local(Alice-Regular),url(https://fonts.gstatic.com/s/alice/v8/sZyKh5NKrCk1xkCk_F1S8A.eot?#) format("eot"),url(https://fonts.gstatic.com/s/alice/v8/l5RFQT5MQiajQkFxjDLySg.woff2) format("woff2"),url(https://fonts.gstatic.com/s/alice/v8/_H4kMcdhHr0B8RDaQcqpTA.woff) format("woff")}' +
      'a{font-family:"Alice"}b{}',

      {
        protocol: 'https:'
      },
      done
    );
  });

});
