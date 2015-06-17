/* app/ui/video/load */

define(
	[
		'jquery',
		'util/lazyload',
		'pubsub'
	],
	function( $, LazyLoad ) {

		var VideoLoad;

		return {
			init: function() {
				VideoLoad = this;

				// Run callback function after scrolling to playlist element triggers lazyScroll plugin
				// This will ensure the YouTube API and supporting files are only loaded when necessary
				// Will only run once - js hook removed once the playlist has been loaded
				LazyLoad.initLazyFunction({
					elems: $('.js-load-playlist'),
					callback: function () {
						var $thisPlaylist = $(this);

						require(['app/ui/video/playlist'], function (VideoPlaylist) {
							VideoPlaylist.init($thisPlaylist);
						});
					}
				});
				VideoLoad._initVideoEvent();
			},

			_initVideoEvent: function() {
				$( '.js-video-player' ).on( 'click', '.js-video', VideoLoad._loadVideo );
			},

			_loadVideo: function( event ) {
				event.preventDefault();
				var thisVid = this;

				require( ['app/ui/video/common', 'app/ui/video/youtube'], function( VideoCommon, YouTube ) {
					VideoCommon.init( thisVid );
					YouTube.init( thisVid );
				} );
			}
		};
	}
);