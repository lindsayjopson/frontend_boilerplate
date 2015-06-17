define( ['app/page/all'], function () {

	describe( 'All Page Spec', function () {

		var result = 'sample';

		it( "should have the jquery module loaded", function () {
			var answer = 'sample';
			console.log( window );
			expect( window ).to.have.property( '$' );
		} );

	} );

} );

