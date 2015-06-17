/* app/ui/track/analytics/universal */
/*global window, ga */
/*
	Google Analytics Universal Reading material
	https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
	https://developers.google.com/analytics/devguides/collection/analyticsjs/events
	https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference
*/

define(
	[
		'jquery',
		'pubsub'
	],
	function ( $ ) {
		'use strict';
		var Universal;

		return {
			init: function () {
				console.log( 'Track Universal Init');
				Universal = this;
				Universal._initSubscriptions();
			},

			_initSubscriptions: function () {
				$.subscribe( '/track/analytics/event', Universal.sendEvent );
				$.subscribe( '/track/analytics/pageview', Universal.sendPageView );
			},

			sendEvent: function ( eventObj ) {
				// eventObj object to
				// eventObj.eventCategory	string | REQUIRED
				// eventObj.eventAction		string | REQUIRED
				// eventObj.eventLabel		string | Optional
				// eventObj.eventValue		integer | Optional
				eventObj.hitType = 'event';

				if ( eventObj.eventCategory && eventObj.eventAction ) {
					if ( Universal._isReady() ) {
						console.info( 'Track Universal Event Sent', eventObj );
						ga( 'send', eventObj );
					} else {
						window.setTimeout(
							function () {
								Universal._sendEvent( eventObj );
							},
							500
						);
					}
				}
			},

			sendPageView: function ( pageObj ) {
				// pageObj.location		string | Optional
				// pageObj.page			string | Optional
				// pageObj.title		string | Optional

				pageObj.hitType = 'pageview';

				if ( Universal._isReady() ) {
					// console.log( 'Universal Page View', pageObj );
					ga( 'send', pageObj );
				} else {
					window.setTimeout(
						function () {
							Universal._sendPageView( pageObj );
						},
						500
					);
				}
			},

			_isReady: function () {
				return typeof ga !== 'undefined';
			}
		};
	}
);