;
(function($, window, document, undefined) {

	'use strict';

	// Create the defaults once
	var pluginName = 'tableScroll';
	var wrapper = '<div class="tablescroll"><div class="tablescroll-inner"></div></div>';

	// The actual plugin constructor
	function Plugin(element) {
		this.pluginName = pluginName;
		this.element = element;
		this.$element = $(element);
		this.init();
	}

	Plugin.prototype.init = function () {
		var wrappingDiv;
		var isScrolling;
		this._wrapTable();
		this._initEvents();
		
		wrappingDiv = this.$element.closest('.tablescroll-inner')[0];
		isScrolling = this._checkWidth( wrappingDiv );
		if(isScrolling) {
			this._checkPosition( wrappingDiv );	
		}
	};

	Plugin.prototype._initEvents = function() {
		this.$element.closest('.tablescroll-inner').on('scroll', { plugin: this }, $.throttle(250, this._scrollEvent));
		$(window).on('resize', { plugin: this }, $.throttle(250, this._tableResizeEvent));
	};

	Plugin.prototype._wrapTable = function() {
		this.$element.wrap(wrapper);
	};
	
	Plugin.prototype._checkWidth = function( element ) {
		
		var $wrapper = $(element);
		var $table = $wrapper.find('table');
		var isScrolling = $table.width() > $wrapper.width(); 
		//console.log('table-width', $table.width(), 'wrapper-width', $wrapper.width(), 'is scrolling', isScrolling);
		if( isScrolling ) {
			$wrapper.closest('.tablescroll').addClass( 'is-scrolling');
			return true;
		}

		$wrapper.closest('.tablescroll').removeClass('is-scrolling');
		return false;
		
	};

	Plugin.prototype._scrollEvent = function(e) {
		var plugin = e.data.plugin;
		var isScrolling = plugin._checkWidth(this);
		if(isScrolling) {
			plugin._checkPosition( this );	
		}
	};
	
	Plugin.prototype._tableResizeEvent = function( e ) {
		if(!e || !e.data || !e.data.plugin || e.data.plugin.pluginName === 'evenSteven') {
			return;
		}
		var plugin = e.data.plugin;
		var $items = $('.tablescroll-inner');
		for( var i = 0, length =  $items.length; i < length; i++) {
			var current = $items[i];
			var isScrolling = plugin._checkWidth(current);
			if(isScrolling) {
				plugin._checkPosition( current );
			}
		}
	};
	
	Plugin.prototype._checkPosition = function( elem ) {
		var $this = $(elem);
		var tableWidth = $this.find('table').width();
		var scrollLeft = $this.scrollLeft();
		var containerWidth = $this.width();
		var isStart = scrollLeft === 0;
		var isEnd = tableWidth <= ( scrollLeft + containerWidth );
		this._setClasses( isStart, isEnd, $this.closest('.tablescroll') );
	};

	Plugin.prototype._setClasses = function( isStart, isEnd, $container ) {
		if(isStart || isEnd ) {
			if(isStart) {
				$container.addClass('is-start');
			}
			if(isEnd) {
				$container.addClass('is-end');
			}
			return;
		}
		$container.removeClass('is-start').removeClass('is-end');
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this,  pluginName)) {
				$.data(this, pluginName,
					new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);