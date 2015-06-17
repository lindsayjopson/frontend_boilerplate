/* app/page/detail */

define(
	[
		'jquery',
		'app/ui/video/load',
		'app/ui/social/share',
		'tablescroll',
		'magnificPopup'
	],

	function ($, VideoLoad, SocialShare) {

		// Share Icons
		SocialShare.init();

		// Video Macros
		VideoLoad.init();

		// Check DOM for elements requiring JS
		var $tables = $('.body-text').find('table');

		// Table Scroll
		if ($tables.length) {
			$tables.tableScroll();
		}

		// Single and Multi Image Lightbox
		$( '.js-lightbox-single' ).magnificPopup( {
			delegate: '.js-lightbox-image',
			type: 'image'
		} );

		$('.js-lightbox-gallery').each(function(){
			$(this).magnificPopup({
				delegate: '.js-lightbox-image',
				type: 'image',
				gallery: {
					enabled: true,
					navigateByImgClick: true,
					preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
				}
			});
		});
	}
);