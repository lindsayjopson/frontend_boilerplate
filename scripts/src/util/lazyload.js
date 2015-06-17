/* app/util/lazyload */

define( 
	[
		'jquery',
		'pubsub',
		'lazyload',
		'lazyscroll',
		'actual'
	],

	function ( $ ) {

		'use strict';

		var LazyLoad;
		var contentClass = '.js-lazy-content';
		var imagesClass = '.js-lazy-auto';
		var $lazyLoadContent;
		var $lazyLoadImages;
		var widthPattern = /width=[0-9]*/;
		var heightPattern = /height=[0-9]*/;
		var roundTo = 100;

		var resizeTimer;

		return {

			init: function () {

				LazyLoad = this;
				$lazyLoadContent = $( contentClass );
				$lazyLoadImages = $( imagesClass );

				if ( $lazyLoadImages.length ) {
					LazyLoad.updateImageWidth( $lazyLoadImages );
					LazyLoad.loadImages( $lazyLoadImages );
				}
				if ( $lazyLoadContent.length ) {
					LazyLoad.loadContent();
				}

				LazyLoad._initSubscriptions();
			},

			initLazyFunction: function ( config ) {
				config.elems.lazyScroll( {
					callback: config.callback
				} );
			},

			_initSubscriptions: function () {
				$.subscribe( '/lazyload/image', this.loadImages );
				$.subscribe( '/lazyload/ajax', this._loadAjaxedImages );
				$(window).on('resize', this._processResize);
			},

			_loadAjaxedImages: function ( data ) {

				if ( data.html ) {
					LazyLoad.loadImagesInHtml( data.html );
				}
				LazyLoad.loadImages( data.images );
			},

			loadContent: function ( $html ) {
				$html = $html instanceof jQuery ? $html : $( $.trim( $html ) );
				if ( $html.length ) {
					var $content = $html.find( contentClass );
					LazyLoad.content( $content );
					return;
				}
				LazyLoad.content( $lazyLoadContent );
			},
			updateImageWidth: function ($images){
				$images.each(function(){
					var $image = $(this);
					var src = $image.data('original');
					if(src === "" || $image.closest('.rotator').length){
						return;
					}
					var container = $image.closest('.figure');
					//fix if .figure is not used. use parent element.
					if( !container.length ){
						container = $image.parent();
					}
					var containerWidth = container.width();
					if(containerWidth === 0){
						containerWidth = container.actual('width');
					}
					if(containerWidth === 0){
						return;
					}
					
					if(container.is('[data-sizes]')){
						containerWidth = LazyLoad.getBestWidth(containerWidth, container.data('sizes'));
					}

					var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
					//need to round width to reduce 1px image generation variations on server
					var widthRounded = Math.ceil(pixelRatio*containerWidth/roundTo) * roundTo;

					var oldWidth = $image.data('newWidth');

					if(!oldWidth || oldWidth < widthRounded){
						src = LazyLoad.changeWidth(src, widthRounded);
						$image.data('original', src);
						$image.data('newWidth', widthRounded);
					}
				});
			},

			changeWidth: function(src, width) {
				var ratio = LazyLoad.getRatio(src);
				if(widthPattern.test(src)) {
					src = src.replace(widthPattern, 'width='+width);
				} else if (src.indexOf('?') !== -1){
					src += '&width=' + width; 
				} else {
					src += '?width=' + width;
				}

				if(ratio){
					//var height = Math.round(width * ratio);
					if(heightPattern.test(src)) {
						src = src.replace(heightPattern, 'heightratio='+ratio);
					} else {
						src += '&heightratio=' + ratio;
					}
				}
				return src;
			},


			getRatio: function(src) {
				var ratio = 0;
				var data = {};
				if(src.indexOf('?') !== -1) {
					var querys = src.split('?')[1].split('&');
					for (var i = 0; i < querys.length; i++) {
						var keyValue = querys[i].split('=');
						data[keyValue[0]] = keyValue[1];
					}
				}

				if(data.height && data.width){
					ratio = parseInt(data.height, 10) / parseInt(data.width, 10);
				}
				
				return ratio;
			},



			getBestWidth: function(containerWidth, sizeData) {
				var sizes = sizeData.match(/[0-9]+/g);
				sizes = $.map(sizes, function(num){return parseInt(num.toString(), 10);});
				sizes.sort(function(a, b){return a-b;});

				if(sizes.length) {
					var bestSize = sizes[sizes.length - 1];
					for (var i = sizes.length - 2; i >= 0; i--) {
						if(sizes[i] >= containerWidth){
							bestSize = sizes[i];
						} else {
							break;
						}
					}
					return bestSize;
				}
				return containerWidth;
			},

			_processResize: function () {
				if(resizeTimer) {
					clearTimeout( resizeTimer );
				}
				resizeTimer = setTimeout(function(){
					if ( $lazyLoadImages.length ) {
						LazyLoad.updateImageWidth( $lazyLoadImages );
						LazyLoad._getImages( $lazyLoadImages, true );
					}
				}, 1500);
			},

			loadImages: function ( $images ) {
				LazyLoad._getImages( $images );
			},

			loadImagesInHtml: function ( $html ) {
				$html = $html instanceof jQuery ? $html : $( $.trim( $html ) );
				if ( $html.length ) {
					var $images = $html.find( imagesClass );
					if ( !$images.length ) {
						return;
					}
					$lazyLoadImages = $lazyLoadImages.add($images);
					LazyLoad.updateImageWidth( $images );
					LazyLoad._getImages( $images );
					return;
				}
				this._getImages( $lazyLoadImages );
			},

			_getImages: function ( $images, noAnimation ) {

				var effect = !noAnimation && !$( '.oldie' ).length ? 'fadeIn' : 'show';
				if ( !$images || !$images.length ) {
					return;
				}

				$images.filter( function () {
					var $thisImg = $( this );
					return this.src.indexOf( $thisImg.data( 'original' ) ) === -1;
				} ).lazyload( {
					effect: effect,
					failure_limit: 99999,
					threshold: 300
				} );
			},

			content: function ( $elms ) {
				$elms.lazyScroll( {
					callback: function () {
						this.$element.ajaxInclude();
					}
				} );
			}

		};

	}
);