/* app/ui/form/validate */

define(
	[
		'jquery',
		'util/core',
		'pubsub',
		'templayed'
	],
	function ($, UtilCore) {

		'use strict';

		var Validate;

		var selectors = {
			form: '.js-validate-form', // Add to form wrapping element
			field: '.js-validate-field', // Add to field holder/wrapper e.g. holds label, input and error message
			input: '[required]', // Add to input that needs validation
			optionList: '.js-validate-optionlist', // Add to <ul> containing required checkbox/radiobutton list
			submit: '.js-validate-submit', // Add to submit button
			errorMessage: '.js-validate-field-validation', // Add to any displayed error (hidden or shown)
			fieldError: '.has-error' // For styling field holder
		};

		var $formsToValidate;
		var defaultErrorMessage = 'This field is required';

		return {
			init: function() {
				console.log( 'Validate Init');
				Validate = this;

				$formsToValidate = $( selectors.form );

				if ( $formsToValidate.length ) {
					for ( var i = 0; i < $formsToValidate.length; i++ ) {
						Validate._initForm( $formsToValidate[i] );
					}
				}
			},

			// Initialise each form individually
			// Bind form submission events if there are fields requiring validation
			_initForm: function( form ) {
				var $thisForm = $( form );
				var $requiredInputs = $thisForm.find( selectors.input + ',' + selectors.optionList );

				if ( $requiredInputs.length ) {
					$thisForm.on( 'click', selectors.submit, Validate._processSubmitClick );
					$thisForm.on( 'submit', { form: $thisForm, requiredInputs: $requiredInputs }, Validate._onFormSubmission );
				}
			},

			// Hijack submit button click then submit form
			_processSubmitClick: function( event ) {
				event.preventDefault();
				$( this ).closest( selectors.form ).submit();
			},

			// Run on form submission
			// Enacts validation
			// If errors after validation, scroll to first one
			// Binds listender for keyup on required inputs
			// Returns true if form valid
			_onFormSubmission: function( event ) {
				var formValid = Validate.validateForm( event.data.requiredInputs );
				var $errorFields = event.data.form.find( selectors.fieldError );
				var $requiredInputs = event.data.requiredInputs;

				$requiredInputs.on( 'keyup', Validate.validateInput );
				$requiredInputs.filter( 'select, [type="checkbox"]' ).on( 'change', Validate.validateInput );
				$requiredInputs.on( 'change', '[type="checkbox"], [type="radio"]', Validate.validateInput );

				if ($errorFields.length) {
					UtilCore.scrollToElm( $( $errorFields[0] ), 100 );
					$.publish('/form/validate/clientside/failed', { form: event.data.form, errorFields: $errorFields } );
				} else {
					$.publish('/form/validate/clientside/passed', { form: event.data.form } );
				}
				return formValid;
			},

			// Validates all required inputs of a form
			// Returns true if number of valid inputs equals number required
			// $requiredInputs = jQuery object - the inputs to validate
			validateForm: function( $requiredInputs ) {
				var validCount = 0;
				var requiredLength = $requiredInputs.length;

				for ( var i = 0; i < requiredLength; i++ ) {
					var isValid = Validate.validateInput.call( $requiredInputs[i] );

					if ( isValid.valid ) {
						validCount++;
					}
				}
				return validCount === requiredLength;
			},

			// Validates a single field
			// Sets error display dependant on validation result
			validateInput: function() {
				var $thisInput = $( this );
				var $thisField = $thisInput.closest( selectors.field );
				var data;

				// validate checklist or radiolist
				if ( $thisField.hasClass( UtilCore.getClassName( selectors.optionList ) ) ) {
					data = Validate._validateOptionList( $thisField );
				} else {
					// validate required
					data = Validate._validateRequired( $thisInput );
				}
				Validate._setErrorDisplay( $thisField, data );

				return data;
			},

			// Check a checkbox list or radiobutton list for at least one checked input
			_validateOptionList: function( $thisField ) {
				var data = {
					valid: true
				};

				if ( !$thisField.find( 'input:checked' ).length ) {
					data.valid = false;
					data.message = $thisField.data( 'val-required' );
				}
				return data;
			},

			// Check a required field for a non-empty string
			// If it has a regex pattern, test against this too
			_validateRequired: function( $thisInput ) {
				var data = {
					valid: true
				};

				if ( $thisInput.is( '[type="checkbox"]' ) ) {
					data.valid = $thisInput.is( ':checked' );
					data.message = $thisInput.data( 'val-required' );
				} else {
					var value = $.trim( $thisInput.val() );

					if ( $thisInput.is( '[required]' ) && value === "" ) {
						data.valid = false;
						data.message = $thisInput.data( 'val-required' );
					}

					if ( data.valid && $thisInput.is( '[data-val-regex-pattern]' ) ) {

						if ( !new RegExp( $thisInput.data( 'val-regex-pattern' ) ).test( value ) ) {
							data.valid = false;
							data.message = $thisInput.data( 'val-regex' );
						}
					}
				}
				return data;
			},

			// Displays or removes error field data.valid value
			_setErrorDisplay: function( $thisField, data ) {
				var $thisError = $thisField.find( selectors.errorMessage );
				var fieldErrorClass = UtilCore.getClassName( selectors.fieldError );

				if ( !data.valid ) {
					$thisError.text( data.message || defaultErrorMessage );
					$thisField.addClass( fieldErrorClass );
				} else {
					$thisError.text( '' );
					$thisField.removeClass( fieldErrorClass );
				}
			}
		};
	}
);