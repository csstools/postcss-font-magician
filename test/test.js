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
	it('adds bootstrap fonts', function (done) {
		test(
			'a{font-family:monospace}',
			'@font-face{font-family:monospace;font-style:italic;font-weight:400;src:local(\'Menlo Italic\'), local(\'Menlo-Italic\'), local(\'Consolas Italic\'), local(\'Consolas-Italic\'), local(\'Courier New Italic\')}\n@font-face{font-family:monospace;font-style:italic;font-weight:700;src:local(\'Menlo Italic\'), local(\'Menlo-Italic\'), local(\'Consolas Italic\'), local(\'Consolas-Italic\'), local(\'Courier New Italic\'), local(\'Menlo Bold Italic\'), local(\'Menlo-BoldItalic\'), local(\'Monaco\'), local(\'Consolas Bold Italic\'), local(\'Consolas-BoldItalic\'), local(\'Courier New Bold Italic\')}\n@font-face{font-family:monospace;font-style:normal;font-weight:400;src:local(\'Menlo Regular\'), local(\'Menlo-Regular\'), local(\'Monaco\'), local(\'Consolas\'), local(\'Courier New\')}\n@font-face{font-family:monospace;font-style:normal;font-weight:700;src:local(\'Menlo Regular\'), local(\'Menlo-Regular\'), local(\'Monaco\'), local(\'Consolas\'), local(\'Courier New\'), local(\'Menlo Bold\'), local(\'Menlo-Bold\'), local(\'Monaco\'), local(\'Consolas Bold\'), local(\'Consolas-Bold\'), local(\'Courier New Bold\')}\na{font-family:monospace}',
			{ },
			done
		);
	});

	it('adds bootstrap fonts once', function (done) {
		test(
			'a{font-family:monospace}b{font-family:monospace}',
			'@font-face{font-family:monospace;font-style:italic;font-weight:400;src:local(\'Menlo Italic\'), local(\'Menlo-Italic\'), local(\'Consolas Italic\'), local(\'Consolas-Italic\'), local(\'Courier New Italic\')}@font-face{font-family:monospace;font-style:italic;font-weight:700;src:local(\'Menlo Italic\'), local(\'Menlo-Italic\'), local(\'Consolas Italic\'), local(\'Consolas-Italic\'), local(\'Courier New Italic\'), local(\'Menlo Bold Italic\'), local(\'Menlo-BoldItalic\'), local(\'Monaco\'), local(\'Consolas Bold Italic\'), local(\'Consolas-BoldItalic\'), local(\'Courier New Bold Italic\')}@font-face{font-family:monospace;font-style:normal;font-weight:400;src:local(\'Menlo Regular\'), local(\'Menlo-Regular\'), local(\'Monaco\'), local(\'Consolas\'), local(\'Courier New\')}@font-face{font-family:monospace;font-style:normal;font-weight:700;src:local(\'Menlo Regular\'), local(\'Menlo-Regular\'), local(\'Monaco\'), local(\'Consolas\'), local(\'Courier New\'), local(\'Menlo Bold\'), local(\'Menlo-Bold\'), local(\'Monaco\'), local(\'Consolas Bold\'), local(\'Consolas-Bold\'), local(\'Courier New Bold\')}a{font-family:monospace}b{font-family:monospace}',
			{ },
			done
		);
	});

	it('adds google fonts', function (done) {
		test(
			'a{font-family:"Alice"}',
			'@font-face{font-family:Alice;font-style:normal;font-weight:400;src:local(\'Alice\'), local(\'Alice-Regular\'), url(//fonts.gstatic.com/s/alice/v7/sZyKh5NKrCk1xkCk_F1S8A.eot?#) format(\'eot\'), url(//fonts.gstatic.com/s/alice/v7/l5RFQT5MQiajQkFxjDLySg.woff2) format(\'woff2\'), url(//fonts.gstatic.com/s/alice/v7/_H4kMcdhHr0B8RDaQcqpTA.woff) format(\'woff\'), url(//fonts.gstatic.com/s/alice/v7/acf9XsUhgp1k2j79ATk2cw.ttf) format(\'truetype\'), url(//fonts.gstatic.com/l/font?kit=1xLueNrnwaEUg1pDxEf7_A&skey=8a351bda90f672d8#Alice) format(\'svg\')}\na{font-family:"Alice"}',
			{ },
			done
		);
	});

	it('adds google fonts once', function (done) {
		test(
			'a{font-family:"Alice"}b{font-family:"Alice"}',
			'@font-face{font-family:Alice;font-style:normal;font-weight:400;src:local(\'Alice\'), local(\'Alice-Regular\'), url(//fonts.gstatic.com/s/alice/v7/sZyKh5NKrCk1xkCk_F1S8A.eot?#) format(\'eot\'), url(//fonts.gstatic.com/s/alice/v7/l5RFQT5MQiajQkFxjDLySg.woff2) format(\'woff2\'), url(//fonts.gstatic.com/s/alice/v7/_H4kMcdhHr0B8RDaQcqpTA.woff) format(\'woff\'), url(//fonts.gstatic.com/s/alice/v7/acf9XsUhgp1k2j79ATk2cw.ttf) format(\'truetype\'), url(//fonts.gstatic.com/l/font?kit=1xLueNrnwaEUg1pDxEf7_A&skey=8a351bda90f672d8#Alice) format(\'svg\')}a{font-family:"Alice"}b{font-family:"Alice"}',
			{ },
			done
		);
	});

	it('does not overwrite @font-face rules', function (done) {
		test(
			'@font-face{font-family:Alice}a{font-family:"Alice"}b{font-family:"Alice"}',
			'@font-face{font-family:Alice}a{font-family:"Alice"}b{font-family:"Alice"}',
			{ },
			done
		);
	});
});
