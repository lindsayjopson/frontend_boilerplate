/* app/ui/lightbox/video */

define( 
	[
		'jquery',
		'app/ui/lightbox/common',
		'colorbox'
	],

	function ( $, LightoxCommon ) {

		var LightboxVideo;

		return {
			init: function () {
				LightboxVideo = this;
				var config = {
					transition: 'none',
					iframe: true,
					innerHeight: '70%',
					innerWidth: '90%',
					maxWidth: '90%',
					title: LightoxCommon.setTitle,
					onLoad: LightoxCommon.onLoadProcessing,
					onComplete: LightoxCommon.onCompleteProcessing
				};

				LightoxCommon.init();
				$( '.js-lightbox-video' ).find( 'a' ).not( '.figure-caption' ).colorbox( config );
			},
			
			open: function () {
				$( this ).trigger( 'click' );
			}

		};

	}
);