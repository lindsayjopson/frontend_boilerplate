/* app/ui/lightbox/gallery */

define(
	[
		'jquery',
		'app/ui/lightbox/common',
		'colorbox'
	],

	function ( $, LightboxCommon ) {

		var LightboxGallery;

		return {

			init: function () {
				LightboxGallery = this;

				var config = {
					transition: 'none',
					current: 'Image {current} of {total}',
					maxWidth: '80%',
					maxHeight: '80%',
					photo: true,
					rel: this.rel,
					title: LightboxCommon.setTitle,
					onLoad: LightboxCommon.onLoadProcessing,
					onComplete: LightboxCommon.onCompleteProcessing
				};

				if ( $( '.no-touch body.mobile' ).length ) {
					$( '.js-lightbox-gallery' ).not( '.js-gallery-flickr' ).find( 'a' ).not( '.figure__figcaption' ).colorbox( config );
					return;
				}
				$( '.no-touch .js-lightbox-gallery' ).find( 'a' ).colorbox( config );
			},

			open: function () {
				$( this ).trigger( 'click' );
			}
		};

	}
);