/* app/ui/track */

define(
	[
		'jquery',
		//'app/ui/track/analytics/classic',
		'app/ui/track/analytics/universal',
		'app/ui/track/component',
		'app/ui/track/external',
		'app/ui/track/preload'
	],

	function ( $,/*AnalyticsClassic,*/ Analytics, Component, External, Preload ) {

		return {
			init: function () {
				// Initiate Analytics
				Analytics.init();
				//AnalyticsClassic.init();

				// Initiate Global Page Tracking
				Preload.init();
				External.init();

				// Initiate Component Tracking
				Component.init();
			}
		};
	}
);