define([		
	'jquery',
	'util/ajax'
	], function($, Ajax){

	describe('Ajax Module Spec', function() {

		var result = 'sample';

		it("should have the Ajax module loaded", function() {
			var answer = 'sample';
			expect(answer).to.equal(result);
		});

	});

});
