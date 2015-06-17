;
(function($, window, document, undefined) {

	'use strict';

	// Create the defaults once
	var pluginName = 'lazyScroll';
	var defaults = {
		tolerance: 100,
		callback: function () {
			console.log('scrolled');
		}
	};
	var $window = $(window);

	var _getPosition = function($el) {
		return $el.offset().top;
	};

	var _getCurrentScrollPosition = function() {
		return $window.scrollTop();
	};

	var _lazyCondition = function(position, tolerance) {
	//	console.log(position, _getCurrentScrollPosition() + $(window).height() + tolerance, position <= (_getCurrentScrollPosition() + $(window).height()) + tolerance);
		return position <= (_getCurrentScrollPosition() + $(window).height()) + tolerance;
	};

	var initWindowEvents = function() {
		
		if (!$window .data('/lazyscroll/scroll')) {
			$window .on('scroll', $.throttle(250, function () {
				$.publish('/lazyscroll/scroll');
			}));
			$window.data('/lazyscroll/scroll', true);
		}
		
		if (!$window .data('/lazyscroll/resize')) {
			$window .on('resize', $.throttle(250, function () {
				$.publish('/lazyscroll/resize');
			}));
			$window.data('/lazyscroll/resize', true);
		}
	};

	// The actual plugin constructor
	function Plugin(element, options) {
		this.element = element;
		this.$element = $(element);
		this.options = $.extend({ }, defaults, options);
		this.position = _getPosition(this.$element);

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	Plugin.prototype = {
		init: function () {
			this.initSubscriptions();
			this.processScrollEvent(this);
		},
		initSubscriptions: function () {
			var $this = this;
			$.subscribe('/lazyscroll/scroll', function () {
				$this.processScrollEvent($this);
			});
			$.subscribe('/lazyscroll/resize', function () {
				$this.recalculatePosition($this);
				$this.processScrollEvent($this);
			});
		},
		processScrollEvent: function ( $thisPlugin ) {
			if($thisPlugin.$element) {
				var triggerCondition = _lazyCondition( $thisPlugin.position, $thisPlugin.options.tolerance);
				if(triggerCondition) {
					$thisPlugin.fire.call($thisPlugin);
					this.$element.trigger('lazyscroll.fire');
					$thisPlugin.$element = null;
				}
			}
		},
		recalculatePosition: function ( $thisPlugin ) {
			if($thisPlugin.$element) {
				$thisPlugin.position = _getPosition(this.$element);
			}
		},
		fire: function() {
			this.options.callback.call(this.element);
		}
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName,
					new Plugin(this, options));
			}
		});
	};

	initWindowEvents();

})(jQuery, window, document);