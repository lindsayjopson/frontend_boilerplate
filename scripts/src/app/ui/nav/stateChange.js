/* app/ui/nav/stateChange */

define(
	[
		'jquery'
	],
	function( $ ) {

		var NavStateChange;
		var $nav;
		var $navItems;
		var isFilterable;

		return {
			init: function() {
				NavStateChange = this;
				$nav = $( '.js-header__nav' );
				$navItems = $nav.find( '.js-header__nav-item' );
				isFilterable = $nav.hasClass( 'is-filterable' );

				if ( !isFilterable ) {
					NavStateChange._initEvents();
					NavStateChange._checkForPrefilter();
				} else {
					NavStateChange._loadListingContent();
				}
			},

			_loadListingContent: function() {

				require( ['app/ui/listing/content'], function( ListingContent ) {
					ListingContent.init();
					NavStateChange._initEvents();
					NavStateChange._checkForPrefilter();
				} );
			},

			_initEvents: function() {
				$navItems.on( 'click', NavStateChange._navItemClick );
			},

			_checkForPrefilter: function() {
				var prefilterValue = window.location.hash;

				if ( prefilterValue === '' ) {
					return;
				}

				var $prefilterNavItem = $navItems.filter( '[data-prefilter-url="' + prefilterValue + '"]' );

				if ( $prefilterNavItem.length ) {
					$prefilterNavItem.trigger( 'click' );
				}
			},

			_navItemClick: function( event ) {
				event.preventDefault();
				var $selectedItem = $( this );

				if ( isFilterable ) {
					NavStateChange._updateListing( $selectedItem );
				} else {
					NavStateChange._prefilterHomepage( $selectedItem );
				}
			},

			_updateListing: function( $selectedItem ) {
				var ajaxUrl = $selectedItem.attr( 'data-progressiveenhancement-url' );

				NavStateChange._updateNavigation( $selectedItem );
				$.publish( '/listingContent/hide' );
				$.publish( '/listingContent/add', { url: ajaxUrl } );
			},

			_prefilterHomepage: function( $selectedItem ) {
				var homeUrl = $navItems[0].href;
				var sectionUrl = $selectedItem.attr( 'data-prefilter-url' );
				var prefilterUrl = typeof(sectionUrl) !== 'undefined' ? homeUrl + sectionUrl : homeUrl;

				window.location = prefilterUrl;
			},

			_updateNavigation: function( $selectedItem ) {
				var isHome = $selectedItem.hasClass( 'is-homepage' );
				var navClassAction = isHome ? 'removeClass' : 'addClass';

				$nav[navClassAction]( 'is-filtered' );
				$navItems.removeClass( 'is-selected' );
				$selectedItem.addClass( 'is-selected' );
			}
		};

	}
);