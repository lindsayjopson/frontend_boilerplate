/* app/page/listing */

define(
	[
		'jquery',
		'app/ui/listing/masonry',
		'app/ui/infinitescroll/infinitescroll'
	],

	function ($, ListingMasonry, InfiniteScroll) {

		ListingMasonry.init();
		InfiniteScroll.init();
	}
);