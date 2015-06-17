/* app/ui/video/youtube */
//YouTube iframe player API docs https://developers.google.com/youtube/iframe_api_reference

define(
	[
		'jquery',
		'pubsub'
	],

	function ($) {

		var YouTube;

		//Global YouTube API function. Called after the API has downloaded
		window.onYouTubeIframeAPIReady = function () {
			var $pane = $('.js-video-pane-ready');
			var $video = $('.js-video-youtube-play');
			YouTube._loadVideo($pane, $video);
		};

		return {

			init: function (elem) {
				YouTube = this;
				var $pane;
				var $video;
				var $triggerElem = $(elem);

				YouTube._prepVideo($triggerElem);

				// Check for existence of YT object (YouTube API already loaded)
				if (typeof YT != 'undefined' && typeof YT.Player != 'undefined') {
					$pane = $('.js-video-pane-ready');
					$video = $('.js-video-youtube-play');
					YouTube._loadVideo($pane, $video);
				} else {
					YouTube._loadAPI();
					YouTube._initSubscriptions();
				}
			},

			_prepVideo: function ($triggerElem) {
				var $pane = YouTube._findPane($triggerElem);

				if ($pane.is('iframe')) {
					YouTube._resetVideo($pane, $triggerElem);
					$pane = YouTube._findPane($triggerElem);
				}
				$triggerElem.addClass('js-video-youtube-play');
				$pane.addClass('js-video-pane-ready');
			},

			_loadAPI: function () {
				// This code loads the IFrame Player API code asynchronously.
				var tag = document.createElement('script');
				var firstScriptTag = document.getElementsByTagName('script')[0];
				tag.src = "//www.youtube.com/iframe_api";
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			},

			_initSubscriptions: function () {
				$.subscribe('/video/playing', this._handlePlayingEvent);
			},

			// Creates a new instance of a YouTube player
			// Video Id taken from element that triggered the video to load
			// Will play once loaded if 'data-autoplay' attribute value === true
			_loadVideo: function ($pane, $video) {

				var player = null;
				var playerId = $pane.attr('id');
				var videoId = $video.attr('data-video-id');
				var height = $pane.attr('data-video-height') ? $pane.attr('data-video-height') : $pane.height();
				var width = $pane.attr('data-video-width') ? $pane.attr('data-video-width') : $pane.width();
				var playOnLoad = $video.attr('data-autoplay') === 'true' ? 1 : 0;
				var description = $video.attr('data-video-description');
				$pane.closest('.js-video-container').find('.js-video-figcaption').html(description);

				player = new YT.Player(playerId, {
					height: height,
					width: width,
					videoId: videoId,
					events: {
						"onReady": YouTube._readyToPlay
					},
					playerVars: {
						autoplay: playOnLoad,
						rel: 0,
						autohide: 1
					}
				});

				$pane.data('video.youtube', player);
				$.publish('/video/pauseRotator', [{ playerId: playerId }]);

				YouTube._cleanupVideo();
				YouTube._unsetPlayerToLoad($('.js-youtube-player-load'));
			},

			_resetVideo: function ($currentPane /* jQuery object */, $newVideo /* jQuery object */, isRotator /* Boolean */) {

				var $newPane;
				var description;
				if (!isRotator) {
					var elem = $currentPane[0];
					var newElem = $newVideo[0];
					$newPane = $('<a>', {
						'class': elem.className,
						'id': elem.id,
						'href': newElem.href,
						'data-video-id': $newVideo.attr('data-video-id'),
						'data-video-playonload': $newVideo.attr('data-video-playonload'),
						'data-video-height': elem.height,
						'data-video-width': elem.width
					});
					description = $newVideo.attr('data-video-description');
				} else {
					$newPane = $currentPane.closest('li').data('video.clone');
				}

				$newPane.insertAfter($currentPane);
				if (!isRotator) {
					$newPane.closest('.js-video-container').find('.js-video-figcaption').html(description);
				}
				$currentPane.remove();
			},

			_cleanupVideo: function () {
				$('.js-video-youtube-play').removeClass('js-video-youtube-play');
				$('.js-video-pane-ready').removeClass('js-video-pane-ready');
			},

			_handlePlayingEvent: function (data /*Publish Event object*/) {
				var videoid = data.videoid;
				$('.js-video-pane').each(function () {
					var player;
					var $thisVideo = $(this);
					if ($thisVideo !== videoid) {
						player = $thisVideo.data('video.youtube');
						if (player) {
							YouTube._stopVideo(player);
						}
					}
				});
			},

			_findPane: function ($elem /* jQuery object */) {

				if ($elem.is('.js-video-pane')) {
					return $elem;
				}

				return $elem.closest('.js-video-player').find('.js-video-pane');
			},

			_setPlayerToLoad: function ($target /* jQuery object */) {
				$target.addClass('js-youtube-player-load');
			},

			_unsetPlayerToLoad: function ($target /* jQuery object */) {
				$target.removeClass('js-youtube-player-load');
			},

			_readyToPlay: function (event) {

			},

			_stopVideo: function (player /* YouTube player object */) {
				player.stopVideo();
			}
		};

	}
);