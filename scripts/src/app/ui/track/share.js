/* app/ui/track/share */
define(
	[
		'jquery',
		'app/ui/track/analytics/util',
		'pubsub'
	],

	function ( $, Util ) {

		var Track;

		var $sharePopup;
		var $shareEmail;

		var selectors = {
			sharePopup: '.js-social-popup',
			shareEmail: '.js-social-email',
			dataValue: 'trackValue'
		};

		return {
			init: function () {
				// console.log('Track Share Init');

				Track = this;

				Track._initElements();
				Track._initSubscriptions();
				Track._initEvents();
			},

			_initElements: function () {
				$sharePopup = $( selectors.sharePopup );
				$shareEmail = $( selectors.shareEmail );
			},

			_initSubscriptions: function () {

			},

			_initEvents: function () {
				$sharePopup.on( 'click', Track._processShareClick );
				$shareEmail.on( 'click', Track._processShareClick );
			},

			_processShareClick: function() {
				// console.log('Track Share Click');

				var $link = $( this );
				var value = Track._setValue( $link );
				var data = {
					eventCategory: 'Share',
					eventAction: $.trim( $link.text() ),
					eventLabel: '',
					eventValue: value
				};

				Util.publishEvent( data );
			},

			_setValue: function( $link ) {
				var value;

				if( typeof $link.data( selectors.dataValue ) != 'undefined' ) {
					value = $link.data( selectors.dataValue ) + 1;
				} else {
					value = 1;
				}
				$link.data( selectors.dataValue, value );

				return value;
			}
		};
	}
);