/* app/ui/infinitescroll/button */

define(
	[
		'jquery',
		'pubsub'
	],

	function ($) {

		var Button;
		var $button;
		var hasMore = true;

		return {

			init: function () {
				Button = this;

				this._initElements();
				this._initSubscriptions();
			},

			_initElements: function () {
				$button = $('.js-listing__infinite-btn');
				this._initEvents();
			},

			_initEvents: function () {
				$button.on('click', { proxy: this }, this._processClick);
			},

			_initSubscriptions: function () {
				$.subscribe('/pagination/url', $.proxy(this._showMore, this));
				$.subscribe('/listing/complete', $.proxy(this._defaultButton, this));
				$.subscribe( '/listingContent/new', $.proxy( this._initElements, this ) );
			},

			_processClick: function (event) {
				event.preventDefault();
				event.data.proxy._publishNextEvent();
				event.data.proxy._loadingButton();
			},

			_publishMoreEvent: function (url) {
				$.publish('/listing/more', [{
					url: url
				}]);
			},

			_publishNextEvent: function () {
				$.publish('/pagination/next');
			},

			_showMore: function (data) {
				if (data.url === -1) {
					return;
				}
				hasMore = data.hasMore;
				this._publishMoreEvent(data.url);
			},

			_loadingButton: function () {
				$button.text('Loading');
			},

			_defaultButton: function () {
				$.publish('/loader/hide');
				if (!hasMore) {
					$button.css('visibility', 'hidden');
				}
				$button.text('Show More');
			}

		};

	}
);