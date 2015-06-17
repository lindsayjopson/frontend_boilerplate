/* app/ui/track/global */

define(
	[
		'jquery',
		'pubsub'
	],

	function ( $ ) {
		var Page;

		var downloadFiles = new RegExp( /\.(zip|pdf|doc?x|xls?x|ppt?x|txt)$/gi );

		return {
			init: function () {
				Page = this;
				Page._trackPreloadEvents();
				Page._trackExternalLinks();
			},

			_trackExternalLinks: function () {
				var category = "External";
				var action;
				var label;

				$( 'body' ).on( 'click', 'a', function ( event ) {
					var href = this.href;
					var trackIt = false;

					if ( Page._isDownloadLink( href ) ) {
						var type = Page._getDownloadFileType( href );
						trackIt = true;
						action = 'File';
						label = type + ' Link:' + this.getAttribute( 'href' ); // Only record what the attribute contains. this.href adds the hostname to relative paths
					}

					if ( Page._isExternalLink( href ) ) {
						trackIt = true;
						action = 'Site';
						label = 'Link:' + href;
					}

					if ( Page._isMailtoLink( href ) ) {
						trackIt = true;
						action = 'Email';
						label = 'Email:' + Page._getEmailAddress( href );
					}

					if ( trackIt ) {
						var data = {};
						data.eventCategory = category;
						data.eventAction = action;
						data.eventLabel = label;

						Page._publishEvent( data );

						if ( this.target !== '_blank' ) {
							event.preventDefault();
							window.setTimeout(
								function () {
									window.location = href;
								},
								100
							);
						}
					}
				} );
			},

			_trackPreloadEvents: function () {
				var preloadEvents = window._trackPreloadEvents;

				if ( typeof preloadEvents != 'undefined' && preloadEvents.length ) {
					for ( var i = 0; i < preloadEvents.length; i++ ) {
						var data = preloadEvents[i];

						Page._publishEvent( data );
					}
				}
			},

			_getDownloadFileType: function ( url ) {
				var extension = url.slice( url.search( downloadFiles ) );
				extension = extension.split( '.' )[1];
				extension = extension.split( '?' )[0];
				extension = extension.toUpperCase();

				return extension;
			},

			_getEmailAddress: function ( url ) {
				return url.split( 'mailto:' )[1];
			},

			_isExternalLink: function ( url ) {
				var link = document.createElement( 'a' );
				link.href = url;
				return link.hostname !== window.location.hostname;
			},

			_isMailtoLink: function ( url ) {
				return url.search( 'mailto' ) === 0;
			},

			_isDownloadLink: function ( url ) {
				return url.search( downloadFiles ) !== -1;
			},

			_publishEvent: function ( data ) {
				$.publish( '/track/analytics/event', data );
			}
		};
	}
);