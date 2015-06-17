// Include and setup all the stuff for testing
define(['jquery', 'chai', 'sinon-chai', 'chai-jquery'], function(jQuery, chai, sinonChai, jqueryChai) {

    window.$ = window.jQuery = jQuery;
    window.chai         = chai;
    window.expect       = chai.expect;
    window.assert       = chai.assert;
    window.sinonChai    = sinonChai; // Buggy as hell right now
    window.jqueryChai   = jqueryChai;

    chai.use(sinonChai);
    chai.use(jqueryChai);
});

