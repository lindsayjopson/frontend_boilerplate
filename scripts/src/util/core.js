/* util/core */

define(
	[
		'jquery'
	],
	function( $ ) {

		'use strict';

		return {

			// Scroll to an element on screen
			// $elm = jQuery element - the element to scroll to
			// pxAbove = int - padding between top of screen and element (defaults to 0)
			scrollToElm: function( $elm, pxAbove ) {
				var topPadding = pxAbove || 0;
				var scrollHeight = $elm.offset().top;
				$( "html, body" ).animate( { scrollTop: scrollHeight - topPadding }, "slow" );
			},

			// Returns a class name with no '.'
			// selector = string - the jQuery selector to remove '.' from
			getClassName: function( selector ) {
				return selector.replace( '.', '' );
			}
		};
	}
);