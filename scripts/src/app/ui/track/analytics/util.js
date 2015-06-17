/* app/ui/track/util */
define(
	[
		'jquery',
		'app/ui/track/analytics/universal',
		'pubsub'
	],

	function ( $, Analytics ) {

		var Track;

		

		var selectors = {
			
		};

		return {
			init: function () {
				Track = this;
			},

			publishEvent: function ( data ) {
				Analytics.sendEvent( data );
			},

			publishPage: function ( data ) {
				Analytics.sendPageView( data );
			}
		};
	}
);