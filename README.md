#README

Super duper experimental lightweight customizable jquery plugin markdown editor. Dang. [Try it out](http://dbmedialab.github.com/jquery-markd/).

Dependecies:

* [Marked](https://github.com/chjj/marked.git)
* [Mousetrap](https://github.com/ccampbell/mousetrap.git)

Usage:
	
	$('#message').markd();

Options:
	
	$('#message').markd({
		autosave: true,				// Enabled/disabled autosave.
		theme: 'preview.css',		// Stylesheet for preview.
		keyboardShortcuts: {		// Keyboard shortcuts.
			bold: 		'ctrl+b',
			italic: 	'ctrl+i',
			link: 		'ctrl+k',
			help:		'ctrl+h',
			preview:	'ctrl+p',
			fullscreen: 'ctrl+f'
		},
		parser: {
			pedantic: false,		// Conform to obscure parts of ↩
									// markdown.pl as much as possible. ↩
									// Don't fix any of the original ↩ 
									// markdown bugs or poor behavior.
			sanitize: false			// Sanitize the output. ↩
									// Ignore any HTML that has been input.
		}
	});