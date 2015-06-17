/* app/ui/track/external */
define(
	[
		'jquery',
		'app/ui/track/analytics/util',
		'pubsub'
	],

	function ( $, Util ) {

		var Track;

		var $link;
		var downloadFiles = new RegExp( /\.(zip|pdf|doc?x|xls?x|ppt?x|txt)$/gi );

		var selectors = {
			anchor: 'a'
		};

		return {
			init: function () {
				// console.log( 'Track External Init' );
				
				Track = this;

				Track._initElements();
				Track._initEvents();
			},

			_initElements: function () {
				$link = $( selectors.anchor );
			},

			_initEvents: function () {
				$link.on( 'click', Track._processLinkClick );
			},

			_processLinkClick: function() {
				var href = this.href;
				var trackIt = false;
				var category = "External";
				var action;
				var label;

				if ( Track._isDownloadLink( href ) ) {
					var type = Track._getDownloadFileType( href );
					trackIt = true;
					action = 'File';
					label = type + ' Link:' + this.getAttribute( 'href' ); // Only record what the attribute contains. this.href adds the hostname to relative paths
				}

				if ( Track._isExternalLink( href ) ) {
					trackIt = true;
					action = 'Site';
					label = 'Link:' + href;
				}

				if ( Track._isMailtoLink( href ) ) {
					trackIt = true;
					action = 'Email';
					label = 'Email:' + Track._getEmailAddress( href );
				}

				if ( Track._isTelephoneLink( href ) ) {
					trackIt = true;
					action = 'Telephone';
					label = 'Telephone:' + Track._getEmailAddress( href );
				}

				if ( trackIt ) {
					var data = {};
					data.eventCategory = category;
					data.eventAction = action;
					data.eventLabel = label;

					Util.publishEvent( data );

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

			_isTelephoneLink: function ( url ) {
				return url.search( 'tel' ) === 0;
			},

			_isDownloadLink: function ( url ) {
				return url.search( downloadFiles ) !== -1;
			}
		};
	}
);