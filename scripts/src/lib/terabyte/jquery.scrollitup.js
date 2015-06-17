/*!
* jQuery lightweight plugin boilerplate
* Original author: @ajpiano
* Further changes, comments: @addyosmani
* Licensed under the MIT license
*/

; (function ($, window, document, undefined) {

	var pluginName = 'scrollItUp';
	var	defaults = {
			vertical: false,
			next: '.scroller-next',
			previous: '.scroller-previous',
			speed: 500,
			step: 200,
			easing: 'easeInOutExpo',
			itemsWrapper: '.scroller-content',
			items: '.scroller-item',
			viewport: '.scroller-viewport',
			setup: 'responsive',
			onhover: false,
			lazyLoad: false,
			responsiveConfig: {
				itemWidth: 210,
				margin: 20,
				itemsPerView: 4
			}
		};
	
	/*======= ImageLoader ======= */
	var ImageLoader = {
		getImages: function ( $items, index, itemCount ) {
			var $itemsToShow = $items.slice(index, index + itemCount);
			var $filteredItems = $itemsToShow.find('img').filter(function() {
				var $thisImg = $(this);
				return !!$thisImg.attr('data-original') && $thisImg[0].src.indexOf($thisImg.attr('data-original')) === -1;
			});
			$filteredItems.lazyload( {
				event: 'scrollitup',
				effect: 'fadeIn',
				skip_invisible : false
			} );
		}
	};

	// The actual plugin constructor
	function Plugin(element, options) {

		var $lastItem;
		var index;
		
		//Instance variables
		this.element = element;
		this.$element = $(this.element);
		this.options = $.extend({}, defaults, options);
		this.$container = $(element).find(this.options.itemsWrapper);
		this.$viewport = $(element).find(this.options.viewport);
		this.$items = this.$container.find(this.options.items);
		this.itemsLength = this.$container.find(this.options.items).length;
		this._defaults = defaults;
		this._name = pluginName;
		this.intervalId = 0;
		this.minScroll = 0;
		this.scrollDirection = !this.options.vertical ? "left" : "top";
		
		if(!this.$items.length) {
			return;
		}

		$lastItem = this.$container.find(this.options.items).eq(this.itemsLength - 1);
		
		this.maxScroll = !this.options.vertical 
			? (($lastItem.position().left + $lastItem.width()) - this.$viewport.width()) 
				: this.$container.height() - this.$viewport.height() ;

		this.setup[this.options.setup](this, this.options.responsiveConfig);
		this.initControls();
		this.initTriggers();

		if(this.options.lazyLoad) {
			index = this.$items.index(this.$items.filter('.is-selected'));
			ImageLoader.getImages(this.$items, index, this.options.responsiveConfig.itemsPerView);
		}
		
	}

	Plugin.prototype.initTriggers = function(){
		var next = this.$element.find(this.options.next)[0];
		var previous = this.$element.find(this.options.previous)[0];
		this.$element.on('scrollitup.update', this.update);
		this.$element.on('scrollitup.next', {proxy: this}, $.proxy(this.move, next));
		this.$element.on('scrollitup.previous', {proxy: this}, $.proxy(this.move, previous));
	};

	Plugin.prototype.removeTriggers = function(){
		this.$element.off('scrollitup.update');
		this.$element.off('scrollitup.next');
		this.$element.off('scrollitup.previous');
	};

	Plugin.prototype.setup = {
		'responsive': function(plugin, responsiveConfig) {

			var width = responsiveConfig.itemWidth;
			var margin = responsiveConfig.margin;
			var itemWidth = width - margin;
			var itemsPerWindow = responsiveConfig.itemsPerView;
			var containerWidth = width * plugin.itemsLength;
			var viewportWidth = (width * itemsPerWindow) - margin;

			var viewportScale = (containerWidth / viewportWidth) * 100;
			var marginPercent = (margin / containerWidth * 100);
			var marginLeftContainerPercent = (margin / viewportWidth * 100) * -1;
			var itemWidthPercent = (itemWidth / containerWidth * 100);

			plugin.$container.css({
				width: viewportScale + '%',
				marginLeft: marginLeftContainerPercent + '%'
			});
			plugin.$container.find(plugin.options.items).css({
				width: itemWidthPercent + '%',
				marginLeft: marginPercent + '%'
			});

		}
	};

	Plugin.prototype.initControls = function () {
		this.$element.find(this.options.next + ', ' + this.options.previous).on('click', {proxy: this}, this.move);
	};
	
	Plugin.prototype.move = function(e) {
		
		e.preventDefault();

		var newIndex;
		var positionOfNewIndex;
		var isAtEnded;
		var percentageToMove;
		
		var proxy = e.data.proxy;
		var $this = $(this);
		var $newThis = false;
		var direction = $this.is(proxy.options.next) ? 'next' : 'previous';
		var responsiveConfig = proxy.options.responsiveConfig;
		

		var viewportWidth = ( responsiveConfig.itemWidth * responsiveConfig.itemsPerView) - responsiveConfig.margin;
		var $selectedItem = proxy.$container.find('.is-selected');
		var selectedIndex = proxy.$items.index($selectedItem) > 0 ? proxy.$items.index($selectedItem) : 0;

		if(direction === "next") {
			if( $this.is('.is-ended') ) {
				newIndex = 0;
				positionOfNewIndex = 0;
				$newThis = $( proxy.options.previous );
				isAtEnded = true;
				
			} else if(selectedIndex + responsiveConfig.itemsPerView > (proxy.itemsLength - 1) - responsiveConfig.itemsPerView) {
				newIndex = proxy.itemsLength - responsiveConfig.itemsPerView;
				positionOfNewIndex = newIndex * responsiveConfig.itemWidth;
				isAtEnded = true;
			} else {
				newIndex = selectedIndex + responsiveConfig.itemsPerView;
				positionOfNewIndex = newIndex * responsiveConfig.itemWidth;
				isAtEnded = false;
			}
			
			if(proxy.options.lazyLoad) {
				ImageLoader.getImages(proxy.$items, newIndex, proxy.options.responsiveConfig.itemsPerView);
			}

		} else {
			if( $this.is('.is-ended') ) {
				newIndex = proxy.itemsLength - responsiveConfig.itemsPerView;
				positionOfNewIndex = newIndex * responsiveConfig.itemWidth;
				$newThis = $( proxy.options.next );
				isAtEnded = true;
				
			} else if(selectedIndex - responsiveConfig.itemsPerView <= 0) {
				newIndex = 0;
				positionOfNewIndex = 0;
				isAtEnded = true;
			} else {
				newIndex = selectedIndex - responsiveConfig.itemsPerView;
				positionOfNewIndex = newIndex * responsiveConfig.itemWidth;
				isAtEnded = false;
			}

		}
		
		if($newThis) {
			proxy.setAtEnd($newThis, isAtEnded);
		} else {
			proxy.setAtEnd($this, isAtEnded);
		}

		percentageToMove = (positionOfNewIndex/viewportWidth * 100) * -1 + '%';

		$.proxy(proxy.animate(percentageToMove), proxy);
		
		proxy.setSelected( newIndex );
	};

	Plugin.prototype.animate = function(percentageToMove) {
		if(Modernizr.csstransitions) {

			this.$container.css({
				left: percentageToMove
			});
			
		} else {
			
			this.$container.animate({
				left: percentageToMove
			}, {
				easing: 'easeInOutExpo',
				duration: 500
			});
			
		}
	};

	Plugin.prototype.update = function( e ) {
		var percentageToMove;
		var proxy = e.proxy;
		var responsiveConfig = e.responsiveConfig;
		var viewportWidth = ( responsiveConfig.itemWidth * responsiveConfig.itemsPerView) - responsiveConfig.margin;
		var $selectedItem = proxy.$container.find('.is-selected');
		var selectedIndex = proxy.$items.index($selectedItem) > 0 ? proxy.$items.index($selectedItem) : 0;
		
		percentageToMove = (selectedIndex/viewportWidth * 100) * -1 + '%';

		proxy.setup['responsive']( proxy, responsiveConfig );
		proxy.animate(percentageToMove);
	};

	Plugin.prototype.setSelected = function(index) {
		this.$container.find('.is-selected').removeClass('is-selected');
		this.$items.eq(index).addClass('is-selected');
	};
	Plugin.prototype.isDisabled = function(elem) {
		return elem.hasClass("is-ended");
	};
	Plugin.prototype.setAtEnd = function(elem, disable) {
		var functionName = disable ? "addClass" : "removeClass";
		this.$element.find(this.options.next + ', ' + this.options.previous).removeClass("is-ended");
		elem[functionName]("is-ended");
	};

	Plugin.prototype.destroy = function() {
		this.resetMeasurements();
		this.resetSelected();
		this.removeEvents();
		this.removeData();
	};

	Plugin.prototype.removeData = function() {
		this.$element.removeData('plugin_' + pluginName);
	};
	
	Plugin.prototype.removeEvents = function () {
		this.$element.find(this.options.next + ', ' + this.options.previous).off('click', this.move);
	};

	Plugin.prototype.resetMeasurements = function() {
		var resetCss = {
			width: '',
			'margin-left': ''
		};
		this.$container.css(resetCss);
		this.$items.each(function(){
			$(this).css(resetCss);
		});
	};

	Plugin.prototype.resetSelected = function() {
		this.$container.find('.is-selected').removeClass('is-selected');
		this.$items.first().addClass('is-selected');
	};

	$.fn[pluginName] = function(options) {
		
		if(options === 'destroy') {
			var plugin = $(this).data('plugin_' + pluginName);
			if(!plugin) {
				return;
			}
			plugin.destroy();
			return;
		}

		return this.each(function() {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName,
					new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);