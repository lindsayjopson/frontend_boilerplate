/* app/page/kitchen-sink */

define(
	[
		'jquery'
	],
	function( $ ) {

		// JS for Kitchen Sink Menu
		var $kitchenSinkMenu = $( '.kitchensink__menu' );

		$kitchenSinkMenu.on( 'click', 'a', goToByScroll );
		$kitchenSinkMenu.on( 'click', '.js-toolbar-toggle', toggleKitchenSinkToolbar );
		$kitchenSinkMenu.on( 'click', '.js-resizer-btn', openScreenfly );

		function openScreenfly( event ) {
			event.preventDefault();
			var size = $( this ).attr( 'data-resize-value' );
			var url = window.location + '';
			url = url.replace( ':', '%3a' ).replace( '/', '%2f' );
			window.open( 'http://quirktools.com/screenfly/#u=' + url + '&w=' + size + '&h=900&a=1&s=1', '_blank' );
		}

		function goToByScroll( event ) {
			event.preventDefault();
			var id = $( this ).attr( 'href' );
			if(id.indexOf('#') !== 0){
				window.location.href = id;
				return;
			}
			$( 'html, body' ).animate( { scrollTop: $( "" + id ).offset().top - 80 }, 'slow' );
		}

		function toggleKitchenSinkToolbar() {
			$kitchenSinkMenu.toggleClass( 'is-hidden' );
		}

		// Kitchen Sink Component Configuration
		var useRotator = $( '.js-rotator' ).length;
		var useAccordion = $( '.js-expand-collapse' ).length;
		var useMegamenu = false;

		if ( useRotator ) {
			require( ['app/ui/rotator/rotator'], function( Rotator ) {
				Rotator.init();
			} );
		}

		if ( useAccordion ) {
			require( ['app/ui/accordion/accordion'], function( Accordion ) {
				Accordion.init();
			} );
		}
	}
);