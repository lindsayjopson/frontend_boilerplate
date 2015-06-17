/* app/ui/infinitescroll/infinitescroll */

define(
	[
		'jquery',
		'app/ui/infinitescroll/button',
		'app/ui/infinitescroll/pagination',
		'app/ui/infinitescroll/content'
	],

	function ( $, Button, Pagination, Content ) {

		'use strict';

		return {
			init: function () {
				Pagination.init();
				Content.init();
				Button.init();
			}
		};
	}
);