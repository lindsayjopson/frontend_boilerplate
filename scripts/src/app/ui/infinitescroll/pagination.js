/* app/ui/infinitescroll/pagination */

define(
	[
		'jquery',
		'pubsub'
	],

	function ($) {

		var Pagination;
		var $pagination;
		var $pages;

		return {

			init: function () {
				Pagination = this;

				this._initElements();
				this._initSubscriptions();
			},

			_initElements: function () {
				$pagination = $('.js-listing__container').find('.js-pagination');
				$pages = $pagination.find('.js-pagination__pages');

				this._getPagination();
			},

			_initSubscriptions: function () {
				$.subscribe('/pagination/next', $.proxy(this._processNext, this));
				$.subscribe('/pagination/update', $.proxy(this._processUpdate, this));
				$.subscribe('/listingContent/new', $.proxy(this._initElements, this));
			},

			_processUpdate: function () {
				this._getPagination();
				this._updateSelected();
			},

			_processNext: function () {
				var url = this._getNextPageUrl();
				var hasMore = this._hasMoreResults();
				var data = {
					url: url,
					hasMore: hasMore
				};
				this._publishUrlEvent(data);
			},

			_getPagination: function () {
				if (!$pagination) {
					$pagination = $('.js-pagination');
					return $pagination;
				}
				return $pagination;
			},

			_getPages: function () {
				if (!$pages) {
					$pages = $pagination.find('.js-pagination__pages');
					return $pages;
				}
				return $pages;
			},

			_getNextPageUrl: function () {
				var $firstPages = $('.js-pagination__pages').eq(0);
				var $selected = $firstPages.find('.is-selected');
				var nextPage = $selected.closest('li').next('li').find('.js-pagination__page')[0];

				return nextPage !== undefined ? $(nextPage).attr('data-infinitescroll-url') : -1;
			},

			_hasMoreResults: function () {
				var $firstPages = $('.js-pagination__pages').eq(0);
				var $nextItem = $firstPages.find('.is-selected').closest('li').next().next().filter(function () {

					if ($(this).find('.js-pagination__page').length) {
						return true;
					}

					return false;

				});
				return !!$nextItem.length;
			},

			_updateSelected: function () {
				var $selected;
				var $nextPage;
				var $pagesCopy = this._getPages();

				$pagesCopy.each(function () {
					var $thisPages = $(this);
					$selected = $thisPages.find('.is-selected');
					$nextPage = $selected.closest('li').next('li');
					$selected.removeClass('is-selected');
					$nextPage.find('.js-pagination__page').addClass('is-selected');
				});

				return $nextPage.find('.js-pagination__page');
			},

			_publishUrlEvent: function (data) {
				$.publish('/pagination/url', [data]);
			}

		};

	}
);