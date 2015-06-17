/* app/page/all */

define(
	[
		'jquery',
		'util/lazyload',
		'app/ui/nav/load',
		'app/ui/track/load',
		'app/ui/rotator/rotator',
		'app/ui/form/validate',
		'phatfingaz'
	],
	function ($, LazyLoad, NavLoad, TrackLoad, Rotator, FormValidate) {

		'use strict';

		TrackLoad.init();
		NavLoad.init();
		LazyLoad.init();
		Rotator.init();
		FormValidate.init();

		$( '.js-hot' ).phatFingaz();
	}
);