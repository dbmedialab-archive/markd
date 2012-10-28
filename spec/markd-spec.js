describe('Markd', function () {

	it('should be defined', function () {
		expect($.fn.markd).toBeDefined();
	});
	
	describe('Dependencies', function () {
		
		it('Marked sould be included', function () {
			expect(marked).toBeDefined();
		});

		it('Mousetrap sould be included', function () {
			expect(Mousetrap).toBeDefined();
		});

		it('$.fn.selection sould be included', function () {
			expect($.fn.selection).toBeDefined();
		});
		
	});
	
	describe('Initialization', function() {
		
		beforeEach(function () {
			$('<textarea id="spectest" data-autosave-key="spectest"></textarea>').appendTo('body');
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
			expect( $("#spectest").data('markd').is_fullscreen ).toBeDefined();
		});
		
	});

	describe('Manipulate the content', function() {
		
		beforeEach(function () {
			$('<textarea id="spectest" data-autosave-key="spectest">test</textarea>').appendTo('body');
			$("#spectest").markd();

			$('<div id="spectest2" contenteditable data-autosave-key="spectest">test</div>').appendTo('body');
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
		
		it('$.fn.markd.getMarkdown should return markdown', function() {
			$("#spectest").markd('setContent', '#title');
			expect( $("#spectest").markd('getMarkdown')[0] ).toEqual('<h1>title</h1>');
			$("#spectest2").markd('setContent', '#title');
			expect( $("#spectest2").markd('getMarkdown')[0] ).toEqual('<h1>title</h1>');
		});
			
	});
    
});