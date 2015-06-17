/* app/ui/video/common */

define(
	[
		'jquery',
		'pubsub'
	],
	function( $ ) {

		var VideoCommon;

		return {
			init: function( thisVid ) {
				VideoCommon = this;

				VideoCommon._initVideoEvent();
			},

			_initVideoEvent: function() {
				if ( !$( '.js-video' ).data( 'video.loaded' ) ) {
					$( '.js-video' )
						.data( 'video.loaded', 'true' )
						.on( 'click', this._handleClick );
				}
			},

			_handleClick: function( e ) {
				e.preventDefault();
				var $thisVideo = $( this );
				$.publish( '/video/playing', [{ videoid: $thisVideo.attr( 'data-video-id' ) }] );
			}
		};
	}
);