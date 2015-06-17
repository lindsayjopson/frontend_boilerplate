/* app/ui/track/form */
define(
	[
		'jquery',
		'app/ui/track/analytics/util'

	],

	function ( $, Util ) {

		var Track;

		var eventData = {
			eventCategory: 'Form',
			eventAction: '',
			eventLabel: '',
			eventValue: ''
		};

		var eventActions = {
			validationPassed: 'Validation Passed (Clientside)',
			validationFailed: 'Validation Failed (Clientside)'
		};

		var selectors = {
			dataFormAttempts: 'FormAttempts'
		};

		return {
			init: function () {
				Track = this;

				Track._initSubscriptions();
			},


			_initSubscriptions: function () {
				$.subscribe('/form/validate/clientside/failed', Track._processValidateFailed);
				$.subscribe('/form/validate/clientside/passed', Track._processValidatePassed);
			},

			_processValidatePassed: function( data ) {
				var $form = data.form;

				eventData.eventAction = eventActions.validationPassed;
				eventData.eventValue = Track._getAttempts( $form );
				Track._resetAttempts( $form );
				Track._processEvent();
			},

			_processValidateFailed: function( data ) {
				var $errorFields = data.errorFields;
				var $form = data.form;

				eventData.eventAction = eventActions.validationFailed;
				eventData.eventLabel = 'Errors:[' + Track._getInputLabels( $errorFields ) + ']';
				eventData.eventValue = Track._getAttempts( $form );
				Track._processEvent();
			},

			_processEvent: function() {
				Util.publishEvent( eventData );
			},

			_getInputLabels: function( $fields ) {
				var labelArray = [];
				for (var i = 0; i < $fields.length; i++) {
					var $field = $fields.eq(i);
					var labelName = $.trim( $field.find('label').eq( 0 ).text() );
					labelArray.push(labelName);
				}
				return labelArray.toString();
			},

			_resetAttempts: function( $form ) {
				$form.data( selectors.dataFormAttempts, 0 );
			},

			_getAttempts: function( $form ) {
				var attempts;
				var eventValue;

				if( $form.data( selectors.dataFormAttempts ) === undefined) {
					Track._resetAttempts( $form );
				}

				attempts = $form.data( selectors.dataFormAttempts );
				eventLabel = attempts + 1;
				$form.data( selectors.dataFormAttempts, eventLabel );

				return eventLabel;
			}
		};
	}
);