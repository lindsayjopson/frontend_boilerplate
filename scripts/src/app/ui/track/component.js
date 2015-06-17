/* app/ui/track/advanced */
define(
	[
		'app/ui/track/form',
		'app/ui/track/link',
		'app/ui/track/scroll',
		'app/ui/track/share',
		'app/ui/track/video'
	],

	function ( Form, Link, Scroll, Share, Video ) {

		var Track;

		var linkSettings = {
			components: {
				// [name]:[selector]
				// e.g. 'menu': '.js-menu'
				'header': '.js-header',
				'footer': '.js-footer',
				'menu': '.js-menu',
				'test': '.js-test'
			}
		};

		return {
			init: function () {
				Track = this;
				
				Form.init();
				Link.init( linkSettings );
				Scroll.init();
				Share.init();
				Video.init();
			}
		};
	}
);