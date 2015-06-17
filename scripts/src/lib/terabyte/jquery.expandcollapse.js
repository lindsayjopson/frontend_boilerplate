/*!
* jQuery lightweight plugin boilerplate
* Original author: @ajpiano
* Further changes, comments: @addyosmani
* Licensed under the MIT license
*/

; ( function ( $, window, document, undefined ) {


	// Create the defaults once
	var pluginName = 'expandCollapse',
		defaults = {
			header: '.js-expander-banner',
			content: '.js-expander-body',
			expandedClass: 'is-expanded',
			collapsedClass: 'is-collapsed'
		};

	// The actual plugin constructor
	function ExpandCollapse( element, options ) {
		this.element = element;
		this.$element = $( element );

		this.options = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	ExpandCollapse.prototype.init = function () {
		this.$element.children('li').addClass( this.options.collapsedClass );
		this.initEvents();
	};

	ExpandCollapse.prototype.initEvents = function () {
		this.$element.on( 'click', this.options.header, { $plugin: this }, this.processClick );
		this.$element.on('expandcollapse.open', { $plugin: this, action: 'open' }, $.proxy(this.processClick, this.$element.find(this.options.header)));
		this.$element.on('expandcollapse.close', { $plugin: this, action: 'close' }, $.proxy(this.processClick, this.$element.find(this.options.header)));
	};

	ExpandCollapse.prototype.processClick = function ( e ) {
		e.preventDefault();
		var $thisExpander = $(this).parent();
		var $thisPlugin = e.data.$plugin;
		var action = e.data.action;
		if( action === 'open' && $thisExpander.is($thisPlugin.options.expandedClass) || action === 'close' && $thisExpander.is($thisPlugin.options.collapsedClass) ) {
			return;
		}
		$thisExpander.trigger('expandcollapse.clicked');
		$thisPlugin.processMain( $thisExpander );
	};
	
	ExpandCollapse.prototype.processMain = function ( $thisExpander ) {
		$thisExpander.toggleClass( this.options.expandedClass + ' ' + this.options.collapsedClass );
	};
	
	ExpandCollapse.prototype.destroy = function() {
		this.$element
			.off('click', this.options.header, this.processClick)
			.off('expandcollapse.open')
			.off('expandcollapse.close')
			.data("plugin_" + pluginName, '')
			.find('li').removeClass(this.options.collapsedClass + ' ' + this.options.expandedClass);
	};

	$.fn[pluginName] = function ( options ) {
		
		if(typeof options === 'string' && options === 'destroy') {
			$(this).data("plugin_" + pluginName).init();
			$(this).data("plugin_" + pluginName).destroy();
			return false;
		}
		
		return this.each( function () {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName,
					new ExpandCollapse( this, options ) );
			}
		} );
		
	};

} )( jQuery, window, document );