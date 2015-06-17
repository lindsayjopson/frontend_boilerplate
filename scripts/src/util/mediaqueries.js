define(
	[
		'jquery',
		'enquire'
	],
/**
* Mediaqueries module. Module which runs on every detail page on the site.
* @module util/mediaqueries 
* @requires module:jquery
*/
	function($) {

		'use strict';

		var shouldDegrade;

		return {
			queries: {
				"megamenu--small": "screen and (max-width: 767px)",
				"megamenu--large": "screen and (min-width: 768px)"
			},

			init: function() {
				//We only want to fire mediaqueries for mediaquery capable browsers. i.e. Not Old IE which gets a fixed view
				shouldDegrade = !$('.oldie').length;
			},

			register: function(config) {
				if (Object.prototype.toString.call(config) === '[object Array]') {
					for (var i = 0; i < config.length; i++) {
						var currentConfig = config[i];
						this._addToHandler(currentConfig);
					}
				} else {
					this._addToHandler(config);
				}

			},

			_addToHandler: function(config) {
				//Init JS mediaquery handlers using Enquire.JS
				enquire.register(config.queries, {
					match: config.match,
					unmatch: config.unmatch,
					deferSetup: true
				}, config.shouldDegrade).listen( 250 );
			}
		};
	}
);