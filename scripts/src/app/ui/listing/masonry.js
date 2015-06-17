/* app/ui/listing/content */

define(
	[
		'jquery',
		'masonry/masonry',
		'imagesloaded',
		'pubsub'
	],
	function( $, Masonry, imagesloaded ) {

		var ListingMasonry;
		var $listingContainer;
		var masonry;
		var masonryContainer;
		var count = 0;

		return {
			init: function() {
				ListingMasonry = this;
				ListingMasonry._initSubscriptions();

				if ( window.location.hash === '' ) {
					ListingMasonry._initElements();
					return;
				}
			},

			_initSubscriptions: function() {
				$.subscribe( '/listingContent/new', ListingMasonry._initElements );
				$.subscribe( '/masonry/append', ListingMasonry._masonryUpdate );
			},

			_initElements: function() {
				$listingContainer = $( '.js-listing__container' );
				masonryContainer = $listingContainer.find( '.js-listing--infinite' )[0];

				ListingMasonry._initMasonry();
			},

			_initMasonry: function() {

				if ( !$( '.wf-active' ).length && count < 16 ) {
					setTimeout( ListingMasonry._initMasonry, 250 );
					count++;
				} else {
					imagesloaded( masonryContainer, function() {
						masonry = new Masonry( masonryContainer, {
							itemSelector: 'li'
						} );
					} );
				}
			},

			_masonryUpdate: function( data ) {
				var newItems = jQuery.makeArray( data.newItems );

				masonry.appended( newItems );
				imagesloaded( masonryContainer, function() {
					masonry.layout();
				} );
			}
		};
	}
);