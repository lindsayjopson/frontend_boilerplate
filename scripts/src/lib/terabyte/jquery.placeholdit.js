;(function ( $, window, undefined ) {

	var isInputSupported;
	var isTextareaSupported;
	var pluginName = 'placeholdIt';
	var defaults = {
		submitButton: '.js-submit',
		className: 'placeholdit'
	};
	var inputTypes = 'input[type=text][placeholder], input[type=email][placeholder], input[type=number][placeholder], input[type=tel][placeholder], input[type=url][placeholder], input[type=search][placeholder], input[type=phone][placeholder]';
	
	function checkSupport(attribute, element) {
		return attribute in document.createElement(element);
	}
	isInputSupported = checkSupport('placeholder', 'input');
	isTextareaSupported = checkSupport('placeholder', 'textarea');

	function Plugin (element, options ) {
		this.options = $.extend( {}, defaults, options );
		this.element = element;
		this.$element = $( element );
		this.$submit = $( this.options.submitButton);
		this.object = this;
		this._init();
	}

	Plugin.prototype.isInputSupported = isInputSupported;
	Plugin.prototype.isTextareaSupported = isTextareaSupported;

	Plugin.prototype._init = function () {
		if(!isInputSupported || !isTextareaSupported) {
			this._initEvents();
			this._initPlaceholders();
		}
	};
	
	Plugin.prototype._initEvents = function () {
		this.$element.on('focus', inputTypes + ', textarea', { $plugin: this }, this._processFocus);
		this.$element.on('blur', inputTypes + ', textarea', { $plugin: this }, this._processBlur);
		this.$submit.on('click', { $plugin: this }, this._processSubmit);
	};

	Plugin.prototype._initPlaceholders = function() {
		if(!isInputSupported) {
			var $inputs = this.$element.find(inputTypes);
			this._setPlaceholders($inputs);
		}
		if(!isTextareaSupported) {
			var $textareas = this.$element.find('textarea');
			this._setPlaceholders($textareas);
		}
	};

	Plugin.prototype._setPlaceholders = function( $elems ) {
		for (var i = 0, length = $elems.length; i < length; i++) {
			var $current = $($elems[i]);
			$current.addClass(this.options.className);
			this._restoreText($current[0], $current.attr('placeholder'));
		}
	};

	/* Event Handlers */
	Plugin.prototype._processFocus = function ( e ) {
		e.preventDefault();
		e.data.$plugin._removeText(this);
	};
	
	Plugin.prototype._processBlur = function ( e ) {
		e.preventDefault();
		e.data.$plugin._restoreText(this);
		e.data.$plugin._validateInput(this);
	};
	
	Plugin.prototype._processSubmit = function ( e ) {
		e.preventDefault();
		var $placeholders = e.data.$plugin.$element.find(inputTypes + ', textarea');
		var isValid = e.data.$plugin._validateForm($placeholders);

		if( isValid ) {
			e.data.$plugin._clearPlaceholders($placeholders);
			e.data.$plugin.$submit.closest('form').submit();
		}
	};
	
	Plugin.prototype._clearPlaceholders = function( $elems ) {
		for (var i = 0, length = $elems.length; i < length; i++) {
			var current = $elems[i];
			if(!$(current).attr('required')) {
				this._removeText( $elems[i] );
			}
		}

	};

	Plugin.prototype._removeText = function( elem ) {
		var $this = $(elem);
		var placeholder = $this.attr( 'placeholder' );
		if ( elem.value === placeholder ) {
			elem.value = '';
			return;
		}
	};
	
	Plugin.prototype._restoreText = function( elem ) {
		var placeholder;
		if ( !elem.value ) {
			placeholder = $(elem).attr( 'placeholder' );
			elem.value = placeholder;
		}
	};

	/* Validate Input */
	Plugin.prototype._validateForm = function( $elems ) {
		
		var isFormValid = true;
		
		for (var i = 0, length = $elems.length; i < length; i++) {
			var current = $elems[i];
			var isInputValid = this._validateInput(current);
			if(!isInputValid) {
				isFormValid = false;
			}
		}

		if(isFormValid) {
			this.$element.trigger('placeholdit.form.valid');
		} else {
			this.$element.trigger('placeholdit.form.invalid');
		}
		
		return isFormValid;
	};
	Plugin.prototype._validateInput = function( elem ) {
		var $elem = $(elem);
		var isRequired = $elem.attr('required');
		var placeholder = $elem.attr('placeholder');
		var pattern = new RegExp($elem.attr('pattern'));
		var type = $elem.attr('type');
		var value = elem.value;
		
		if (isRequired && (placeholder === value || !elem.value)) {
			$elem.trigger('placeholdit.invalid');
			return false;
		}
		
		//Do a regular expression check
		if ( pattern && !pattern.exec(value) ) {
			$elem.trigger('placeholdit.invalid');
			return false;
		}

		$elem.trigger('placeholdit.valid');
		return true;
	};

	$.fn[pluginName] = function(options) {

		var plugin;
		if (!jQuery.data(this[0], pluginName)) {
			plugin = new Plugin(this, options);
			jQuery.data(this[0],pluginName, plugin);
		}
		return plugin;

	};

} )( jQuery, window );