﻿/* app/ui/nav/small */

define( 
	[
		'jquery'
	],

	function ( $ ) {

		var NavSmall;
		var $nav;
		var $navItems;
		var $navItemsLink;
		var $navToggle;
		var $search;
		var $searchToggle;

		return {

			init: function () {
				NavSmall = this;

				function atomicNav() {
					if ( !$( '#js-megamenu' ).data( 'nav' ) ) {
						NavSmall.initVars();
						NavSmall.bind();
					} else {
						setTimeout( atomicNav, 50 );
					}
				}
				atomicNav();
			},

			initVars: function () {
				if ( typeof $nav === 'undefined' ) {
					NavSmall = this;
					$nav = $( '#js-megamenu' );
					$navItems = $nav.find( '.js-megamenu__item--dropdown' );
					$navItemsLink = $nav.find( '.js-megamenu__heading' );
					$navToggle = $( '.js-header__toggle--nav' );
					$search = $( '.js-megamenu__search' );
					$searchToggle = $( '.js-header__toggle--search' );
				}
			},

			bind: function () {
				this._setData();
				$navToggle.on( 'click', this._toggleSmallMenu );
				$navItemsLink.on( 'click', this._openSubMenuLink );
				$navItems.on( 'click', this._openSubMenu );
				$searchToggle.on( 'click', this._toggleSmallSearch );
			},

			unbind: function () {
				$navToggle.off( 'click', this._toggleSmallMenu );
				$navItemsLink.off( 'click', this._openSubMenuLink );
				$navItems.off( 'click', this._openSubMenu );
				$searchToggle.off( 'click', this._toggleSmallSearch );
				this._resetMenu();
				this._removeData();
			},

			_toggleSmallMenu: function ( event ) {
				event.preventDefault();

				// close site search if open
				if ( $search.is( '.is-expanded' ) ) {
					$searchToggle.trigger( 'click' );
				}

				// show/hide primary nav menu dependant on current state
				$nav.toggleClass( 'is-expanded is-collapsed' );
				// toggle class on menu button (adds padding and swaps bg color)
				$navToggle.toggleClass( 'is-expanded' );

				if ( $nav.is( '.is-collapsed' ) ) {
					$nav.find( '.is-expanded' ).removeClass( 'is-expanded' );
				}
			},

			_toggleSmallSearch: function ( event ) {
				event.preventDefault();

				// close primary nav menu if open
				if ( $navToggle.is( '.is-expanded' ) ) {
					$navToggle.trigger( 'click' );
				}

				// show/hide site search dependant on current state
				$search.toggleClass( 'is-expanded' );
				// toggle class on search button (adds padding and swaps bg color)
				$searchToggle.toggleClass( 'is-expanded' );
			},

			_openSubMenu: function ( event ) {
				var $item = $( this );
				if ( !$item.is( '.is-expanded' ) ) {
					$nav.children( '.is-expanded' ).removeClass( 'is-expanded' );
				}
				$item.toggleClass( 'is-expanded' );
			},

			_openSubMenuLink: function ( event ) {
				$navItems.off( 'click', this._openSubMenu );
			},
			_setData: function () {
				$nav.data( 'nav', 'true' );
			},

			_removeData: function () {
				$nav.removeData( 'nav' );
			},

			_resetMenu: function () {

				$nav.removeClass( 'is-expanded' );
				$navItems.removeClass( 'is-expanded' );

				if ( $search.is( '.is-expanded' ) ) {
					$search.toggleClass( 'is-expanded' );
					$searchToggle.toggleClass( 'is-expanded' );
				}

			}
		};

	}
);