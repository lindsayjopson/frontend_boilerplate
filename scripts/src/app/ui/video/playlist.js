/* app/ui/video/load */

define(
	[
		'jquery',
		'pubsub',
		'templayed'
	],
	function( $ ) {

		var VideoPlaylist;

		return {
			init: function( $playlist ) {
				VideoPlaylist = this;

				if ( $playlist.hasClass( 'js-load-playlist' ) ) {
					$playlist.removeClass( 'js-load-playlist' );
					VideoPlaylist._getPlaylist( $playlist );
				}
			},

			// Retrieves a JSON feed from YouTube Data API. Playlist ID must be added to the target element
			// YouTube API key needs to be configured for each project
			_getPlaylist: function( $playlist ) {
				// Project-specific API key https://console.developers.google.com
				var youTubeApiKey = '';
				var playListId = $playlist.attr( 'data-playlistid' );
				var dataUrl = 'https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Csnippet&maxResults=50&playlistId=' + playListId + '&key=' + youTubeApiKey;

				$.ajax( {
					url: dataUrl,
					dataType: "jsonp"
				} ).done(
					$.proxy( VideoPlaylist._createGallery, $playlist[0] )
				).fail( function() {
					$playlist.addClass( 'js-load-playlist' );
				} );
			},

			// var data = JSON response from YouTube API
			// var videos = array of JS objects with only required data from JSON repsonse
			// Function retrieves HTML from templates to be populated with the 'videos' array
			// Publish event to trigger any JS functions tied to the playlist layout (e.g. thumbnail show/hide all)
			_createGallery: function( data ) {
				var videos;
				var playlistItems = data.items;
				var $thisPlaylist = $( this );
				var thumbnailsTemplate = $( '#js-video-template-thumb' ).html();
				var mainVideoTemplate = $( '#js-video-template-main' ).html();

				var imageMain = $thisPlaylist.attr( 'data-placeholder' );
				var imageMainLazyload = $thisPlaylist.attr( 'data-large-lazyload' );
				var imageThumbLazyload = $thisPlaylist.attr( 'data-thumb-lazyload' );

				videos = VideoPlaylist._generateVideoData( $thisPlaylist, playlistItems );
				VideoPlaylist._renderThumbs( $thisPlaylist, videos, imageThumbLazyload, thumbnailsTemplate );
				VideoPlaylist._renderMain( $thisPlaylist, videos[0], imageMain, imageMainLazyload, mainVideoTemplate );
			},

			// Render playlist thumbnails using videos array and template
			_renderThumbs: function( $thisPlaylist, videos, placeholder, template ) {
				var $thumbnailList = $thisPlaylist.find( '.js-playlist-thumbnails' );

				for ( var i = 0; i < videos.length; i++ ) {
					var currentVideo = videos[i];
					var thumbnailClass = "";
					currentVideo.thumbLazyLoad = placeholder;

					if ( i >= 4 ) {
						thumbnailClass = "visuallyhidden";
					}
					if ( !$thisPlaylist.hasClass( 'figure--half' ) ) {
						thumbnailClass += " s-one-quarter";
					}
					currentVideo.visibilityClass = thumbnailClass;
					VideoPlaylist._compileAndInsertTemplate( $thumbnailList, template, currentVideo, 'append', true );
				}
				$thumbnailList.find( 'li' ).first().addClass( 'is-selected' );

				if ( videos.length > 4 ) {
					VideoPlaylist._insertViewAllButton( $thumbnailList );
				}
			},

			// Render main placeholder image / video player element
			_renderMain: function( $thisPlaylist, video, image, lazyload, template ) {
				var $videoContainer = $thisPlaylist.find( '.js-video-container' );
				video.mainPlaceholder = image !== '' ? image : video.imageLarge;
				video.mainLazyload = lazyload;
				VideoPlaylist._compileAndInsertTemplate( $videoContainer, template, video, 'overwrite', true );
			},

			// utility function to overwrite / append built templates to DOM
			// Publish event to trigger any images within the templates to lazyload
			_compileAndInsertTemplate: function( $container, template, vars, action, lazyload ) {
				template = template.replace( /(\r\n|\n|\r)/gm, '' );
				var insertionType = action === 'append' ? 'append' : 'html';
				var compiledTemplate = templayed( template )( vars );

				$container[insertionType]( compiledTemplate );

				if ( lazyload === true ) {
					$.publish( '/lazyload/image', [$container.find( 'img' )] );
				}
			},

			// Creates an array of JS objects with only required data from JSON repsonse
			_generateVideoData: function( $thisPlaylist, playlistItems ) {
				var videos = [];

				$.each( playlistItems, function() {
					var videoDetails = this.snippet;
					var video = {
						title: videoDetails.title,
						description: videoDetails.description,
						videoId: videoDetails.resourceId.videoId,
						thumb: videoDetails.thumbnails['default'].url,
						imageLarge: videoDetails.thumbnails.high.url
					};
					videos.push( video );
				} );

				return videos;
			},

			// Inserts the 'View All' button to display all the playlist thumbnails
			_insertViewAllButton: function( $thumbnailList ) {
				var $button = $( '<div class="push--ends text--center"><button class="btn btn--brand one-whole m-one-half js-playlist-more">View All</button></div>' );
				$thumbnailList.after( $button );
				$button.on( 'click', '.js-playlist-more', { list: $thumbnailList }, VideoPlaylist._displayAllThumbnails );
			},

			// Removes the 'visuallyhidden' class of all the playlist thumbnails
			_displayAllThumbnails: function( event ) {
				event.preventDefault();
				var $thumbnailList = event.data.list;

				$( this ).fadeOut();
				$thumbnailList.find( '.visuallyhidden' ).removeClass( 'visuallyhidden' );
				$.publish( '/lazyload/image', [$thumbnailList.find( 'img' )] );
			}
		};
	}
);