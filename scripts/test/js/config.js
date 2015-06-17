// Partial config file
require.config({
    // Base URL relative to the test runner
    // Paths are relative to this
    baseUrl: '../src/lib',
    paths: {
        // Testing libs
		'spec'          : '../../test/spec',
        'chai'          : '../../test/js/chai',
        'sinon-chai'    : '../../test/js/sinon-chai',
        'chai-jquery'   : '../../test/js/chai-jquery',
        'test-common'   : '../../test/js/test-common',
        'fixtures'      : '../../test/fixtures/fixtures',
    },
	shim: {
		mocha: {
			exports: 'mocha'
		}
	},
	urlArgs: "v="+(new Date()).getTime()
});
