describe('Markd', function () {

	it('should be defined', function () {
		expect($.fn.markd).toBeDefined();
	});
	
	describe('Dependencies', function () {
		
		it('Mousetrap sould be included', function () {
			expect(Mousetrap).toBeDefined();
		});

		it('$.fn.selection sould be included', function () {
			expect($.fn.selection).toBeDefined();
		});
		
	});
	
	describe('Initialization', function() {
		
		beforeEach(function () {
			$('<textarea id="spectest"></textarea>').appendTo('body');
			$("#spectest").markd();
		});
		
		afterEach(function () {
			$("#spectest").remove();
		});
		
		it('should add the classes .markd and .mousetrap', function() {
			expect( $('#spectest').hasClass('markd') ).toBeTruthy();
			expect( $('#spectest').hasClass('mousetrap') ).toBeTruthy();
		});
		
		it('sould have a few settings', function() {
			expect( $("#spectest").data('markd').toolbar ).toBeDefined();
			expect( $("#spectest").data('markd').kbd ).toBeDefined();
		});
		
	});

	describe('Manipulate the content', function() {
		
		beforeEach(function () {
			$('<textarea id="spectest">test</textarea>').appendTo('body');
			$("#spectest").markd();

			$('<div id="spectest2" contenteditable>test</div>').appendTo('body');
			$("#spectest2").markd();
		});
		
		afterEach(function () {
			$("#spectest").remove();
			$("#spectest2").remove();
		});
		
		it('$.fn.markd.getContent sould read content from the editor', function() {
			expect( $("#spectest").markd('getContent')[0] ).toEqual('test');
			expect( $("#spectest2").markd('getContent')[0] ).toEqual('test');
		});

		it('$.fn.markd.setContent sould set the content of the editor', function() {
			$("#spectest").markd('setContent', 'help');
			expect( $("#spectest").markd('getContent')[0] ).toEqual('help')
			$("#spectest2").markd('setContent', 'help');
			expect( $("#spectest2").markd('getContent')[0] ).toEqual('help')
		});
		
	});
    
});