#Markd README

Super duper experimental lightweight customizable jquery plugin markdown editor. [Try it out](http://dbmedialab.github.com/jquery-markd/).

**Dependecies:**

* [Marked](https://github.com/chjj/marked.git)
* [Mousetrap](https://github.com/ccampbell/mousetrap.git)
* [jQuery.selection from jQuery++](http://jquerypp.com/)

**Usage:**
	
	$('#editor').markd();

**Options *(defaults)*:**
	
	$('#editor').markd({
		autosave: true,				// Toggle autosave using localStorage if possible.
		theme: 'preview.css',		// Stylesheet for preview.
		keyboardShortcuts: {		// Keyboard shortcuts.
			bold: 		'ctrl+b',
			italic: 	'ctrl+i',
			code: 		'ctrl+k',
			link: 		'ctrl+l',
			help:		'ctrl+h',
			preview:	'ctrl+p',
			fullscreen: 'ctrl+f'
		},
		parser: {
			compiler: marked,		// Compiler
			pedantic: false,		// Conform to obscure parts of ↩
									// markdown.pl as much as possible. ↩
									// Don't fix any of the original ↩
									// markdown bugs or poor behavior.
			sanitize: false			// Sanitize the output. ↩
									// Ignore any HTML that has been input.
		}
	});
	
Note:   
For autosave to work you need to add the attribute `data-autosave-key` to the element invoked. The value of `data-autosave-key` is used as the localStorage-key.