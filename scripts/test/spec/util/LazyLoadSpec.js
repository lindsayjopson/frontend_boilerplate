define([		
	'jquery',
	'util/lazyload'
	], function($, LazyLoad){

	describe('LazyLoad Module Spec', function() {

		var result = 'sample';

		it("should have the LazyLoad module loaded", function() {
			var answer = 'sample';
			expect(answer).to.equal(result);
		});

	});

});
