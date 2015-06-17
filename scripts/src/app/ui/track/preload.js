
/* app/ui/track/preload */
define(
	[
		'jquery',
		'app/ui/track/analytics/util'
	],

	function ( $, Util ) {

		var Track;

		var preloadEvents = window._trackPreloadEvents;

		var selectors = {
			
		};

		return {
			init: function () {
				// console.log( 'Track Preload Init' );

				Track = this;

				var preloadEvents = window._trackPreloadEvents;

				if ( typeof preloadEvents != 'undefined' && preloadEvents.length ) {
					for ( var i = 0; i < preloadEvents.length; i++ ) {
						var data = preloadEvents[i];

						Util.publishEvent( data );
					}
				}
			}
		};
	}
);