/*!
* jQuery lightweight plugin boilerplate
* Original author: @ajpiano
* Further changes, comments: @addyosmani
* Licensed under the MIT license
*/

;
(function($, window, document, undefined) {

	'use strict';

	// Create the defaults once
	var pluginName = 'tabbery';
	var defaults = {
		selectedClass: '.is-selected',
		showClass: '.is-visible',
		tabMenu: '.js-tabbery-menu',
		tabMenuItem: ".js-tabbery-item",
		tabContent: '.js-tabbery-content',
		attribute: 'href',
		complete: null
	};
	
	// The actual plugin constructor

	function Plugin(element, options) {
		this.element = element;
		this.$element = $(this.element);
		this.options = $.extend({ }, defaults, options);
		this.$content = this.$element.find(this.options.tabContent);

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	
	}
		
	Plugin.prototype = {
		init: function() {
			
			this.initClickEvent();
		},
		
		initClickEvent: function () {
			this.$element.find(this.options.tabMenu).on('click', this.options.tabMenuItem, {
				$plugin: this
			}, this.processClick );
		},
		
		processClick: function ( e ) {
			
			e.preventDefault();
				
			var $thisTab = $(this);
			var $plugin = e.data.$plugin;
			var id = $plugin.getTabContentID($thisTab);
			
			$thisTab.trigger('tabbery.click');
			
			$plugin.hideContent();
			$plugin.showContent(id);
			$plugin.updateMenu($thisTab);
			
		},
		
		updateMenu: function ( $el ) {
			if(!$el.is(this.options.selectedClass)) {
				this.$element.find(this.options.tabMenu)
					.find(this.options.selectedClass).removeClass(this.options.selectedClass.substring(1));
				$el.addClass(this.options.selectedClass.substring(1));
			}
		},

		showContent: function( id ) {
			$(id).addClass(this.options.showClass.substring(1));
		},
		
		hideContent: function () {
			this.$content.find(this.options.showClass).removeClass(this.options.showClass.substring(1));
		},
		
		getTabContentID: function ($el) {
			return $el.attr(this.options.attribute);
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

})(jQuery, window, document);