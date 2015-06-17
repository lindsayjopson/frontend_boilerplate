define( 
	[
		'jquery',
		'expandcollapse'
	],

	function ( $ ) {

		var Accordion;
		var $accordions;
		var $expandCollapseAll;

		return {

			/** Initialise the accordion functionality. 
			*
			* @method module:app/ui/accordion/accordion.init
			*/
			init: function () {
				Accordion = this;
				$accordions = $( '.js-expand-collapse' );
				$expandCollapseAll = $( '.js-expand-collapse__all' );
				$accordions.expandCollapse({
					header: '.js-expand-collapse__header',
					content: '.js-expand-collapse__body'
				});
				

				this._initEvents();

				
			},

			_initEvents: function () {
				$( '.js-expand-collapse__all' ).on( 'click', { $obj: this }, this._processAllEvent );
				$accordions.on( 'expandcollapse.clicked', { $obj: this }, this._processHeaderClick );
				$accordions.on( 'expandcollapse.clicked', { $obj: this }, this._checkExpandedStatus );
			},

			_processAllEvent: function ( event ) {

				event.preventDefault();
				var eventToTrigger;
				var $thisButton = $( this );
				var $obj = event.data.$obj;

				eventToTrigger = $thisButton.is( '.is-expanded' ) ? 'expandcollapse.close' : 'expandcollapse.open';
				$obj._triggeraccordionEvents( eventToTrigger );
			},

			_processHeaderClick: function () {
				var $thisHeader = $( this );
				if ( typeof Modernizr !== 'undefined' && Modernizr.csstransitions ) {
					return;
				}
				$thisHeader.find( '.js-icon' ).toggleClass( 'icof-arrowdown icof-arrowup' );
			},

			_checkExpandedStatus: function () {
				var $thisAccordion = $( this ).closest( 'li' );
				var $openAccordions = $accordions.filter( '.is-expanded' ).length;

				if ( $thisAccordion.hasClass( 'is-collapsed' ) && ( $accordions.length - $openAccordions ) === 1 ) {
					Accordion._updateButton( $expandCollapseAll );
				}
				if ( $thisAccordion.hasClass( 'is-expanded' ) && ( $accordions.length == $openAccordions ) ) {
					Accordion._updateButton( $expandCollapseAll );
				}
				
				
			},

			_updateButton: function ( $thisButton ) {
				var buttonText;
				$accordionHeader = $('.js-expand-collapse__header');
				$actionAccordionHeader = $('.pod--action').find('.js-expand-collapse__header');
				$thisButton.toggleClass( 'is-expanded is-collapsed' );
				$thisButton.find( '.icof-plus, .icof-minus' ).toggleClass( 'icof-plus icof-minus' );
				buttonText = $thisButton.is( '.is-expanded' ) ? 'Close all' : 'Open all';
				$thisButton.find( '.js-expand-collapse__text' ).text( buttonText );

				
				if ($('.pod--action').find('.js-expand-collapse__header:contains("Click to see more")').length > 0) {
					$actionAccordionHeader.text("Close");
				}else{
					$actionAccordionHeader.text("Click to see more");
				}
			},

			_triggeraccordionEvents: function ( eventToTrigger ) {
				$accordions.each( function () {
					var $thisAccordion = $( this );
					if ( !( $thisAccordion.is( '.is-expanded' ) && eventToTrigger === 'expandcollapse.open' ) && !( $thisAccordion.is( '.is-collapsed' ) && eventToTrigger === 'expandcollapse.close' ) ) {
						$thisAccordion.trigger( eventToTrigger );
					}
				} );
			}

		};

	}
);