/* app/ui/track/video */
define(
	[
		'jquery',
		'app/ui/track/analytics/util',
		'pubsub'
	],

	function ( $, Util ) {

		var Track;

		var $player;
		var $video;

		var selectors = {
			player: '.js-video-player',
			video: '.js-video'
		};

		return {
			init: function () {
				// console.log('Track Video Init');

				Track = this;

				Track._initElements();
				Track._initEvents();
			},

			_initElements: function () {
				$video = $( selectors.player );
			},

			_initEvents: function () {
				$video.on('click', selectors.video, Track._processClick );
			},

			_processClick: function() {
				console.log('Track Video Click');

				var data = {
					eventCategory: 'Video',
					eventAction: 'Click',
					eventLabel: '',
					eventValue: '1'
				};

				Util.publishEvent( data );
			}
		};
	}
);