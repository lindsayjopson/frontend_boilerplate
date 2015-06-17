/* app/ui/track/scroll */
define(
	[
		'jquery',
		'app/ui/track/analytics/util'
	],

	function ( $, Util ) {

		var Track;

		var $html;
		var $body;
		var $view;

		var isHalfway = false;
		var isEnd = false;

		var state = {
			verticalHeight: '',
			verticalPlacement: '',
			isHalfway: false,
			isEnd: false
		};
		
		var eventData = {
			eventCategory: 'Scrolled',
			eventAction: '',
			eventLabel: ''
		};

		var eventActions = {
			landedPassedHalfway: 'Landed Passed Halfway',
			landedEnd: 'Landed End',
			scrolledHalfway: 'Passed Halfway',
			scrolledEnd: 'Reached End'
		};

		return {
			init: function () {
				// console.log('Track Scroll Init');

				Track = this;

				Track._initElements();
				Track._initState();
				Track._initEvents();
			},

			_initElements: function () {
				$html = $( 'html' );
				$body = $( 'body' );
				$view = $( window );
			},

			_initEvents: function () {
				$(window).on('scroll', Track._processWindowScroll );
			},

			_initState: function() {
				Track._updateState();

				// Check to see if user landed at an anchor at the end of the page
				if( state.isEnd ) {
					isHalfway = true;
					isEnd = true;
					Track._processPublishEvent( eventActions.landedEnd );

				// Check to see if user landed passed way of the page
				} else if( state.isHalfway ) {
					isHalfway = true;
					Track._processPublishEvent( eventActions.landedPassedHalfway );
				}
			},

			_updateState: function() {
				state.verticalHeight = $html.outerHeight();
				state.verticalPlacement = $body.scrollTop() + $view.height();
				state.isHalfway = state.verticalPlacement >= ( state.verticalHeight / 2 );
				state.isEnd = state.verticalPlacement + 100 /* buffer */ > state.verticalHeight;
			},

			_processWindowScroll: function() {
				if(!isHalfway || !isEnd) {
					Track._updateState();

					// User has passed halfway of the page
					if( !isHalfway && state.isHalfway ) {
						isHalfway = true;
						Track._processPublishEvent( eventActions.scrolledHalfway );
					}

					// User has reached the buffered zone of the page
					if( !isEnd && state.isEnd) {
						isEnd = true;
						Track._processPublishEvent( eventActions.scrolledEnd );
					}
				}
			},

			_processPublishEvent: function( actionLabel ) {
				eventData.eventAction = actionLabel;
				eventData.eventLabel = 'Height:' + state.verticalHeight + 'px, Position:' + state.verticalPlacement + 'px';
				Util.publishEvent( eventData );

			}
		};
	}
);