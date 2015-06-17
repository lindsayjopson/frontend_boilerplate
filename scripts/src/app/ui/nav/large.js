/* app/ui/nav/large */

define( 
	[
		'jquery'
	],

	function ( $ ) {

		var NavLarge;
		var $nav;
		var $navWithMenus;
		var $search;
		var $searchToggle;

		return {
			init: function () {
				NavLarge = this;

				function atomicNav() {
					if ( !$( '#js-megamenu' ).data( 'nav' ) ) {
						NavLarge.initVars();
						NavLarge.bind();
					} else {
						setTimeout( atomicNav, 50 );
					}
				}
				atomicNav();
			},

			initVars: function () {
				$nav = $( '#js-megamenu' );
				$navWithMenus = $nav.find( '.js-megamenu__item--dropdown' );
				//$search = $( '#header-search-container' );
				//$searchToggle = $( '.js-header-search-toggle' );
			},

			bind: function () {

				this._setData();
				//$searchToggle.on( 'click', this._toggleMidSearch );

				//Using hover if "touch" device. Some caveats with this as it is really only WebKit devices. See https://github.com/Modernizr/Modernizr/issues/548 and https://github.com/Modernizr/Modernizr/issues/753
				require( ['hoverIntent'], function ( $ ) {
					if ( $( '.no-touch' ).length ) {
						$navWithMenus.hoverIntent( {
							over: NavLarge._toggleMegaMenuHover,
							out: NavLarge._toggleMegaMenuHover,
							interval: 30
						} );
					}
				} );

				if ( $( '.no-touch' ).length ) {
					return;
				}

				this._bindTouchEvents();

			},

			_toggleMegaMenu: function ( target, click, event ) {
				if ( click === 'click' ) {
					event.preventDefault();
				}
				var $thisTarget = $( target );
				var $thisNav = $thisTarget.is( '.js-megamenu__item--dropdown' ) ? $thisTarget : $thisTarget.closest( '.js-megamenu__item--dropdown' );
				var $expanded = $nav.find( '.is-expanded' );

				if ( click && click === 'click' && $expanded.find( '.js-megamenu__heading' )[0] !== target ) {
					$expanded.removeClass( 'is-expanded' );
				}

				$thisNav.toggleClass( 'is-expanded' );

			},

			unbind: function () {
				//$searchToggle.off( 'click', this._toggleMidSearch );
				$navWithMenus.unbind( "click", this._toggleMegaMenu );
				$navWithMenus.unbind( "mouseenter" ).unbind( "mouseleave" );
				$navWithMenus.removeProp( 'hoverIntent_t' );
				$navWithMenus.removeProp( 'hoverIntent_s' );
				this._removeData();
			},

			_toggleMidSearch: function ( event ) {
				event.preventDefault();

				// show/hide site search dependant on current state
				$search.toggleClass( 'is-expanded' );
				// toggle class on search button (adds padding and swaps bg color)
				$searchToggle.toggleClass( 'is-expanded' );
			},

			_toggleMegaMenuHover: function () {
				NavLarge._toggleMegaMenu( this );
			},

			_toggleMegaMenuClick: function ( event ) {
				NavLarge._toggleMegaMenu( this, 'click', event );
			},

			_bindTouchEvents: function () {
				$navWithMenus.each( function () {
					$( this ).find( '.js-megamenu__heading' ).on( 'click', NavLarge._toggleMegaMenuClick );
				} );
				$( 'body' ).on( 'click', NavLarge._handleBodyClick );
			},

			_handleBodyClick: function ( e ) {
				var $target = $( e.target );
				if ( !$target.closest( '#js-megamenu' ).length && $nav.find( '.is-expanded' ).length ) {
					$nav.find( '.is-expanded' ).removeClass( 'is-expanded' );
				}
			},

			_setData: function () {
				$nav.data( 'nav', 'true' );
			},

			_removeData: function () {
				$nav.removeData( 'nav' );
			}

		};

	}
);