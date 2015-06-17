/* app/ui/infinitescroll/content */

define(
	[
		'jquery',
		'pubsub'
	],
	function ($) {

		var Content;
		var id;

		return {
			init: function () {
				Content = this;
				id = Math.floor(Math.random() * (1000 - 1) + 1);
				this._$content = $('.js-listing--infinite');
				this._initSubscriptions();
			},

			_initSubscriptions: function () {
				$.subscribe('/listing/more', $.proxy(this._processMore, this));
				$.subscribe('/ajax/ready/' + id, $.proxy(this._processHtml, this));
			},

			_processMore: function (data) {
				$.publish('/ajax/get', [{
					url: data.url,
					id: id
				}]);
			},

			_processHtml: function (data) {

				var listingData;

				if (!data.html.length) {
					return;
				}

				this._appendContent(data.html);
				listingData = this._generateData();
				this._publishUpdateEvent(listingData);
				this._postProcessContent();
				this._publishCompleteEvent(data.html);
			},

			_appendContent: function (html) {
				var $newItems = $( html ).filter( 'li' );
				$('.js-listing--infinite').append($newItems);
				$.publish('/masonry/append', { newItems: $newItems });
			},

			_generateData: function () {
				var end = $('.js-listing--infinite').children().length;

				return {
					end: end
				};
			},

			_publishUpdateEvent: function (data) {
				$.publish('/pagination/update', [data]);
			},

			_publishCompleteEvent: function (html) {
				setTimeout(function () {
					$.publish('/listing/complete', [{
						html: html
					}]);
				}, 200);
			},

			_postProcessContent: function () {
				var $listing = $('.js-listing--infinite');
				var $images = $listing.find('img').filter(function () {
					var $thisImg = $(this);
					return this.src.indexOf($thisImg.attr('data-original')) === -1;
				});
				$.publish('/lazyload/image', [$images]);
			}
		};

	}
);