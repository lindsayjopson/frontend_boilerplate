/* app/ui/listing/content */

define(
	[
		'jquery',
		'pubsub'
	],
	function( $ ) {

		var ListingContent;
		var $listingContainer;
		var $loading;
		var id;

		return {
			init: function() {
				ListingContent = this;
				$listingContainer = $( '.js-listing__container' );
				$loading = $( '<div class="listing__loader js-listing--loading"><img src="/content/images/interface/ind/ind-loader.gif" alt="Loading" /></div>' );
				id = Math.floor( Math.random() * (1000 - 1) + 1 );

				ListingContent._initSubscriptions();
			},

			_initSubscriptions: function() {
				$.subscribe( '/listingContent/hide', ListingContent._hideContent );
				$.subscribe( '/listingContent/add', ListingContent._processUrl );
				$.subscribe( '/ajax/ready/' + id, $.proxy( this._processHtml, this ) );
			},

			_processUrl: function( data ) {
				var url = data.url;

				$.publish( '/ajax/get', [{
					url: url,
					id: id
				}] );
			},

			_processHtml: function( data ) {
				if ( !data.html.length ) {
					return;
				}
				ListingContent._addContent( data.html );
			},

			_hideContent: function() {
				ListingContent._setContainerHeight();
				$listingContainer.empty();
				$listingContainer.html( $loading );
			},

			_addContent: function( $html ) {
				var falseLoad = window.setTimeout( function() {
					$loading.remove();
					$listingContainer.html( $html );
					ListingContent._resetContainerHeight();
					ListingContent._postProcessContent();
				}, 250 );
			},

			_postProcessContent: function() {
				var $listing = $( '.js-listing--infinite' );
				var $images = $listing.find( 'img' ).filter( function() {
					var $thisImg = $( this );
					return this.src.indexOf( $thisImg.attr( 'data-original' ) ) === -1;
				} );
				$.publish( '/lazyload/image', [$images] );
				$.publish( '/listingContent/new' );
			},

			_setContainerHeight: function() {
				var currentHeight = $listingContainer.height();

				$listingContainer.css( 'height', currentHeight );
			},

			_resetContainerHeight: function() {
				$listingContainer.css( 'height', 'auto' );
			}
		};
	}
);