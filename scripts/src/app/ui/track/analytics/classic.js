/* app/ui/track/analytics/classic */
/*global window, _gaq */
/*
	Google Analytics Classic Reading material
	https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration
	https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
*/

define(
	[
		'jquery',
		'pubsub'
	],
	function ( $ ) {
		'use strict';
		var Classic;

		return {
			init: function () {
				Classic = this;
				Classic._initSubscriptions();
			},

			_initSubscriptions: function () {
				$.subscribe( '/track/analytics/event', Classic.sendEvent );
				$.subscribe( '/track/analytics/pageview', Classic.sendPageView );
			},

			sendEvent: function ( eventObj ) {
				// eventObj.eventCategory	string | REQUIRED
				// eventObj.eventAction		string | REQUIRED
				// eventObj.eventLabel		string | Optional
				// eventObj.eventValue		integer | Optional

				if ( eventObj.eventCategory && eventObj.eventAction ) {
					if ( Classic._isReady() ) {
						//console.log( 'Analytics Event', eventObj );
						_gaq.push( ['_trackEvent', eventObj.eventCategory, eventObj.eventAction, eventObj.eventLabel, eventObj.eventValue] );
					} else {
						window.setTimeout(
							function () {
								Classic.sendEvent( eventObj );
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

				if ( Classic._isReady() ) {
					//console.log( 'Analytics Page View', pageObj );
					_gaq.push( ['_trackPageview', pageObj.location] );
				} else {
					window.setTimeout(
						function () {
							Classic.sendPageView( pageObj );
						},
						500
					);
				}
			},

			_isReady: function () {
				return typeof _gaq !== 'undefined';
			}
		};
	}
);