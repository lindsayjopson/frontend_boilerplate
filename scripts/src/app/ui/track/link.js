/* app/ui/track/link */
define(
	[
		'jquery',
		'app/ui/track/analytics/universal'
	],

	function ( $, Universal ) {

		var Track;

		var config = {
			dataTrackCateogry: 'TrackLinkCategory',
			components: {
				// [name]:[selector]
				// e.g. 'menu': '.js-menu'
			},
			actionLinkClick: 'Link Click',
			actionButtonClick: 'Button Click',
			actionDefaultClick: 'Click',
			actionLinkRightClick:  'Link Click (Right)'
		};
		var $linkList;
		var componentObj;

		return {
			init: function ( settings ) {
				// console.log('Track Link Init');

				Track = this;

				config = $.extend( config, settings );

				Track._initElements();
				Track._initEvents();
			},

			_initElements: function () {
				$linkList = Track._getComponents();
			},

			_initEvents: function () {
				$linkList.on( 'click contextmenu', Track._processLinkClick );
				$linkList.on( 'click contextmenu', 'a,button,input[type=submit]', Track._processComponentClick );
			},

			_processLinkClick: function( event ) {
				if( event.delegateTarget === event.target ) {
					var tag = event.target.tagName.toLowerCase();
					if( tag === 'a' || tag === 'input' || tag === 'button' ) {
						Track._processClick( event );
					}
				}
			},

			_processComponentClick: function( event ) {
				Track._processClick( event );
			},

			_processClick: function( event ) {
				var type = event.type;
				var tag = event.target.tagName.toLowerCase();
				var trackIt = true;

				var category =  Track._getCategoryName( event );
				var action = Track._getActionType( event.target );
				var label = Track._getLabelValue( event.target );

				if( type === 'contextmenu' && tag === "a") {
					action = config.actionLinkRightClick;
					trackIt = true;

				} else if ( type === 'contextmenu') {
					trackIt = false;
				}

				if( trackIt ) {
					var data = {
						eventCategory: category,
						eventAction: action,
						eventLabel: label
					};

					Universal.sendEvent( data );
				}
			},

			_getComponents: function() {
				var $componentList = $();
				var componentKeyList = Track._getComponentKeys();

				for (var i = 0; i < componentKeyList.length; i++) {
					var componentKey = componentKeyList[i];
					var componentClass = config.components[componentKey];
					var $component = $( componentClass);

					Track._setCategoryName($component, componentKey);

					if( $component.length > 0 ) {
						if( $componentList.length === 0 ) {
							$componentList = $( componentClass);
						} else {
							$componentList = $componentList.add( componentClass );
						}
					}	
				}
				return $componentList;
			},

			_getComponentKeys: function() {
				return Object.keys( config.components );
			},

			_getCategoryName: function( event ) {
				return $( event.delegateTarget ).data( config.dataTrackCateogry );
			},

			_setCategoryName: function( $elem, name ) {
				$elem.data( config.dataTrackCateogry, Track._capitalizeString( name ));
			},

			_getActionType: function( element ) {
				var tag = element.tagName.toLowerCase();
				var eventAction = '';
				switch(tag) {
					case 'a':
						eventAction = config.actionLinkClick;
						break;

					case 'button':
						eventAction = config.actionButtonClick;
						break;

					case 'input':
						if( element.getAttribute('type').toLowerCase() === 'submit') {
							eventAction = config.actionButtonClick;
						} else {
							eventAction = config.actionDefaultClick;
						}
						break;

					default:
						eventAction = config.actionDefaultClick;

				}

				return eventAction;
			},

			_getLabelValue: function( element ) {
				var $element = $( element );
				var tag = element.tagName.toLowerCase();
				var label = 'Label:';
				var link = 'Url:';
				var value;
				var eventLabel;

				switch(tag) {
					case 'a':
						label = label + $.trim( $element.text() );
						link = link + $element.attr('href');
						eventLabel = label + ', ' + link;
						break;

					case 'button':
						label = label + $.trim( $element.text() );
						eventLabel = label;
						break;

					case 'input':
						if( element.getAttribute('type').toLowerCase() === 'submit') {
							value = $element.attr('value');
							label = label + ( value !== undefined && value !== 'Submit Query' ? value : 'Submit' );
							eventLabel = label;
						} else {
							eventLabel = 'n/a';
						}
						break;

					default:
						eventLabel = 'n/a';

				}
				
				return eventLabel;
			},

			_capitalizeString: function( txt ) {
				return txt.replace(/\w\S*/g, function(word) {
					return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
				});
			}
		};
	}
);