(function ( $ ) {
	$.fn.brotator = function ( options ) {

		var defaults = {
			animation: 'fade',
			animationSpeed: 500,
			easing: 'linear',
			autorotate: true,
			timeout: 8000,
			content: '.content',
			menu: '.media-index',
			menuItem: '.media-index-item',
			menuUpdate: 'default',
			next: '.next',
			previous: '.previous',
			hasMenu: false,
			menuClick: true,
			hasButtons: true,
			contentSetup: null,
			wait: true,
			lazyloader: false,
			zIndex: 2,
			complete: null,
			namespace: null
		};

		return this.each( function () {

			if ( options ) {
				$.extend( defaults, options );
			}

			var nameSpace = defaults.namespace + Math.floor( Math.random() * 10001 ) || '/' + this.id;
			var thisRotator = $( this );
			var contentItems = thisRotator.find( defaults.content );
			var maxItems = contentItems.find( 'li' ).size();

			if ( options === 'destroy' ) {
				var $plugin = thisRotator.data( 'brotator' );
				var pluginTimer = thisRotator.data( 'brotator_timer' );
				var pluginMenu = thisRotator.data( 'brotator_menu' );
				var pluginButtons = thisRotator.data( 'brotator_buttons' );
				var pluginContent = thisRotator.data( 'brotator_content' );
				var currentNameSpace = thisRotator.data( 'namespace' );
				if ( pluginTimer ) {
					pluginTimer.clearAutoTimer.apply( $plugin[0], Array.prototype.splice.call( arguments, 1 ) );
				}
				if ( pluginMenu ) {
					pluginMenu.clearEvents();
				}
				if ( pluginButtons ) {
					pluginButtons.clearEvents();
				}
				pluginContent.reset();
				$.unsubscribe( currentNameSpace + '/transition/start' );
				$.unsubscribe( currentNameSpace + '/transition/end' );
				$.unsubscribe( currentNameSpace + '/lazyloader/get' );
				$.unsubscribe( currentNameSpace + '/state/updated' );
				thisRotator.data( 'brotator', '' );
				thisRotator.data( 'brotator_timer', '' );
				thisRotator.data( 'brotator_menu', '' );
				thisRotator.data( 'brotator_buttons', '' );
				thisRotator.data( 'brotator_content', '' );
				thisRotator.data( 'namespace', '' );
				return;
			}

			/*======= Timer ======= */
			var Timer = {
				timeoutID: null,
				initTriggers: function () {
					thisRotator.on( 'start.timer.brotator', function () {
						defaults.autorotate = true;
						Timer.init.call( Timer );
					} );
					thisRotator.on( 'stop.timer.brotator', function () {
						defaults.autorotate = false;
						Timer.clearAutoTimer.call( Timer );
					} );
				},
				clearTriggers: function () {
					thisRotator.off( 'start.timer.brotator' );
					thisRotator.off( 'stop.timer.brotator' );
				},
				init: function () {
					this.setAutoRotate();
					$.subscribe( nameSpace + '/transition/start', function ( index, stopTimer ) {
						stopTimer && Timer.clearAutoTimer();
					} );
					$.subscribe( nameSpace + '/transition/end', function ( index ) {
						if ( defaults.autorotate ) {
							Timer.setAutoRotate();
						}
					} );
				},
				setAutoRotate: function () {
					var timeToStart = defaults.timeout;
					if ( !defaults.wait ) {
						timeToStart = 50;
						defaults.wait = true;
					}
					Timer.timeoutID = setTimeout( function () {
						$.publish( nameSpace + '/transition/start', [State.next] );
					}, timeToStart );
					thisRotator.data( 'timer', Timer.timeoutID );
				},
				clearAutoTimer: function () {
					var timer = thisRotator.data( 'timer' );
					if ( timer ) {
						clearTimeout( timer );
						defaults.autorotate = false;
					}
				}
			};

			/*======= State ======= */
			var State = {
				current: 0,
				next: 1,
				previous: maxItems - 1,
				inTransition: false,
				updateState: function ( index ) {
					this.updateProp( 'current', index );
					var next = index < maxItems - 1 ? index + 1 : 0,
					previous = index === 0 ? maxItems - 1 : index - 1;
					this.updateProp( 'next', next );
					this.updateProp( 'previous', previous );
					this.updateProp( 'inTransition', false );
					$.publish( nameSpace + '/state/updated', [{
						next: next,
						current: State.current
					}] );
				},
				updateProp: function ( prop, index ) {
					this[prop] = index;
				},
				init: function () {
					$.subscribe( nameSpace + '/transition/start', function () {
						State.updateProp( 'inTransition', true );
					} );
					$.subscribe( nameSpace + '/transition/end', function ( index ) {
						State.updateState( index );
					} );
				}
			};

			/*======= Menu ======= */
			var Menu = {
				elem: $( defaults.menu ),
				init: function () {
					$.subscribe( nameSpace + '/transition/start', function ( index ) {
						Menu.updateMenu[defaults.menuUpdate]( index );
					} );
					if ( defaults.menuClick ) {
						this.clickEvent();
					}

				},
				clearEvents: function () {
					Menu.elem.off( 'click', defaults.menuItem );
				},
				clickEvent: function () {
					var $menu = Menu.elem;
					$menu.on( 'click', defaults.menuItem, function ( event ) {
						event.preventDefault();
						if ( this.className.indexOf( 'is-selected' ) === -1 && !State.inTransition ) {
							var selectedIndex = $menu.find( 'li' ).index( $( this ).closest( 'li' ) );
							$.publish( nameSpace + '/transition/start', [selectedIndex, true /* Stop Timer */] );
						}
					} );
				},
				updateMenu: {
					"default": function ( index ) {
						var $currentSelected = Menu.elem.find( '.is-selected' ),
							$nextSelected = Menu.elem.find( 'li' ).eq( index );

						$currentSelected.removeClass( 'is-selected ' );
						$nextSelected.find( 'a' ).addClass( 'is-selected ' );
					}
				}
			};

			/*======= Buttons ======= */
			var Buttons = {
				init: function () {
					this.clickEvent();
				},
				nextButton: thisRotator.find( defaults.next ),
				previousButton: thisRotator.find( defaults.previous ),
				clearEvents: function () {
					$.each( [this.nextButton, this.previousButton], function () {
						$( this ).off( 'click' );
					} );
				},
				clickEvent: function () {
					$.each( [this.nextButton, this.previousButton], function () {
						$( this ).click( function ( event ) {
							event.preventDefault();
							if ( !State.inTransition ) {
								var indexToShow = this.className.indexOf( 'next' ) !== -1 ? State.next : State.previous;
								$.publish( nameSpace + '/transition/start', [indexToShow, true /* Stop timer */] );
							}
						} );
					} );
				}
			};

			/*======= ImageLoader ======= */
			var ImageLoader = {
				imgCache: {},
				init: function () {
					this.initCache();
					this.initSubscriptions();
				},
				initCache: function () {
					contentItems.find( 'li' ).each( function () {
						var $thisItem = $( this );
						if ( $thisItem.find( 'img[data-original]' ).length ) {
							var imgSrc = $thisItem.find( 'img' ).data( 'original' );
							if ( imgSrc ) {
								ImageLoader.imgCache[imgSrc] = $thisItem.find( 'img' )[0];
							}
						}
					} );
				},
				initSubscriptions: function () {
					$.subscribe( nameSpace + '/lazyloader/get', function ( data ) {
						var $nextItem = contentItems.find( 'li' ).eq( data.next );
						if ( $nextItem.find( 'img[data-original]' ).length && !ImageLoader.isImageLoaded( $nextItem ) ) {
							ImageLoader.processImg( $nextItem );
						}
					} );
					$.subscribe( nameSpace + '/state/updated', function ( data ) {
						var $nextItem = contentItems.find( 'li' ).eq( data.next );
						if ( $nextItem.find( 'img[data-original]' ).length && !ImageLoader.isImageLoaded( $nextItem ) ) {
							ImageLoader.processImg( $nextItem );
						}
					} );
				},
				processImg: function ( $nextItem ) {
					var $nextImg = $nextItem.find( 'img' );
					var nextImgSrc = $nextImg.data( 'original' );
					$nextImg[0].src = nextImgSrc;
				},
				isImageLoaded: function ( $nextItem ) {
					var $nextImage = $nextItem.find( 'img' );
					return $nextImage[0].src.indexOf( $nextImage.data( 'original' ) ) !== -1;
				},
				checkCache: function ( nextImgSrc ) {
					return ImageLoader.imgCache[nextImgSrc];
				},
				getImg: function ( imgSrc ) {

					var img;

					if ( ImageLoader.checkCache( imgSrc ) ) {
						img = ImageLoader.imgCache[imgSrc];
					} else {
						img = new Image();
						img.src = imgSrc;
						img.className = 'rotator-header-image';
						ImageLoader.imgCache[imgSrc] = img;
					}

					return img;
				},
				insertImg: function ( $item, img ) {
					$item.prepend( img );
				}
			};

			/*======= Content ======= */
			var Content = {
				count: contentItems.find( 'li' ).length,
				reset: function () {
					var $firstLi = contentItems.find( 'li' ).first();
					contentItems.attr( 'style', '' );
					contentItems.find( 'li' ).each( function () {
						$( this ).attr( 'style', '' );
					} );
					if ( !$firstLi.is( '.is-selected' ) ) {
						contentItems.find( '.is-selected' ).removeClass( 'is-selected' );
						contentItems.find( 'li' ).first().addClass( 'is-selected' );
					}
				},
				init: function () {

					if ( defaults.contentSetup ) {
						Content.contentSetup[defaults.contentSetup]();
					}

					$.subscribe( nameSpace + '/transition/start', function ( index ) {
						if ( defaults.lazyloader ) {
							$.publish( nameSpace + "/lazyloader/get", [{ next: index}] );
						}
						Content.animations[defaults.animation]( index );
					} );
				},
				postTransition: function ( currentItem, newItem ) {
					currentItem.removeClass( 'is-selected' );
					newItem.addClass( 'is-selected' );
					if ( defaults.complete ) {
						defaults.complete.call( newItem[0] );
					}
				},
				contentSetup: {
					'responsive': function () {
						contentItems.css( {
							width: 100 * Content.count + '%'
						} );
						contentItems.find( 'li' ).each( function () {
							$( this ).css( {
								width: 100 / Content.count + '%',
								display: 'block'
							} );
						} );
					}
				},
				animations: {
					"fade": function ( indexToShow ) {

						var items = contentItems.find( 'li' ),
							currentItem = items.eq( State.current ),
							newItem = items.eq( indexToShow );

						currentItem.css({
							"z-index": 1
						}).animate({
							"opacity": "0"
						}, defaults.animationSpeed, defaults.easing);
						
						newItem.css( {
							"display": "block",
							"opacity": "0",
							"z-index": defaults.zIndex
						} ).animate( {
							"opacity": "1"
						}, defaults.animationSpeed, defaults.easing, function () {
							currentItem.css( {
								"display": "",
								"opacity": "",
								"z-index": ""
							} );
							Content.postTransition( currentItem, newItem );
							$.publish( nameSpace + '/transition/end', [indexToShow] );
						} );
					},
					"slide": function ( indexToShow ) {

						var items = contentItems.find( 'li' );
						var currentItem = items.eq( State.current );
						var newItem = items.eq( indexToShow );

						var distance = ( indexToShow * 100 );

						if ( Modernizr.csstransitions ) {
							contentItems.css( {
								left: ( distance * -1 ) + '%'
							} );
							Content.postTransition( currentItem, newItem );
							setTimeout( function () {
								$.publish( nameSpace + '/transition/end', [indexToShow] );
							}, 500 );
						} else {
							contentItems.animate( {
								left: ( distance * -1 ) + '%'
							}, defaults.animationSpeed, defaults.easing, function () {
								Content.postTransition( currentItem, newItem );
								$.publish( nameSpace + '/transition/end', [indexToShow] );
							} );
						}
					}
				}
			};

			if ( options === 'stopAutoRotate' ) {
				return Timer.clearAutoTimer.apply( this, Array.prototype.splice.call( arguments, 1 ) );
			}

			if ( options === 'startAutoRotate' ) {
				return Timer.setAutoRotate.apply( this, Array.prototype.splice.call( arguments, 1 ) );
			}

			if ( !( typeof options === 'string' ) ) {
				defaults.hasMenu && Menu.init();
				defaults.hasButtons && Buttons.init();
				defaults.autorotate && Timer.init();
				Timer.initTriggers();
				defaults.lazyloader && ImageLoader.init();
				State.init();
				Content.init();
			}

			if ( !thisRotator.data( 'brotator' ) ) {
				thisRotator.data( 'brotator', $( this ) );
				thisRotator.data( 'brotator_timer', Timer );
				thisRotator.data( 'brotator_menu', Menu );
				thisRotator.data( 'brotator_buttons', Buttons );
				thisRotator.data( 'brotator_content', Content );
				thisRotator.data( 'namespace', nameSpace );
			}

		} );

	};
} )( jQuery );
