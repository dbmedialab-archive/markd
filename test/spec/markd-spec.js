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
			expect( $("#spectest").data('markd').is_fullscreen ).toBeDefined();
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
		
		it('$.fn.markd.getMarkdown should return markdown', function() {
			$("#spectest").markd('setContent', '#title');
			expect( $.trim($("#spectest").markd('getMarkdown')[0]) ).toEqual('<h1>title</h1>');
			$("#spectest2").markd('setContent', '#title');
			expect( $.trim($("#spectest2").markd('getMarkdown')[0]) ).toEqual('<h1>title</h1>');
		});
					
	});
	
	describe('Open and save content from localStorage', function() {

		beforeEach(function () {
			$('<textarea id="spectest" data-autosave-key="spectest"></textarea>').appendTo('body');
			$("#spectest").markd();
		});
		
		afterEach(function () {
			$("#spectest").remove();
		});

		it('$.fn.markd.save should save the content in the editor to localstorage', function() {
			$("#spectest").markd('setContent', 'save to localStorage');
			$("#spectest").markd('save');
			expect( localStorage.getItem('spectest') ).toEqual('save to localStorage');
		});
		
		it('$.fn.markd.open should open the editor with content from localStorage.', function() {
			localStorage.setItem('spectest', 'open from localStorage')
			$("#spectest").markd('open');
			expect( $("#spectest").markd('getContent')[0] ).toEqual('open from localStorage');
		});
		
		it('$.fn.markd.clear should clear data from localStorage.', function() {
			$("#spectest").markd('clear');
			expect( localStorage.getItem('spectest') ).toBeNull();
		});
	
	});
    
    describe('Create and delete a preview of the rendered markdown.', function() {
		
		beforeEach(function () {
			$('<textarea id="spectest">test</textarea>').appendTo('body');
			$("#spectest").markd();
		});
		
		afterEach(function () {
			$("#spectest").remove();
			$('.markd-preview').remove();
		});
		
		it('$.fn.markd.createPreview should create a iframe', function() {
			$("#spectest").markd('createPreview');
			expect( $('.markd-preview').length ).toBe(1);
		});

		it('$.fn.markd.deletePreview should remove any open preview', function() {
			$("#spectest").markd('createPreview');
			$("#spectest").markd('deletePreview');
			expect( $('.markd-preview').length ).toBe(0);
		});
		
    });
    
});