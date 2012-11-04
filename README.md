#Markd README

Super duper experimental lightweight customizable jquery plugin markdown editor. [Try it out](http://dbmedialab.github.com/jquery-markd/).

##Dependecies

* [Marked](https://github.com/chjj/marked.git)
* [Mousetrap](https://github.com/ccampbell/mousetrap.git)
* [jQuery.selection from jQuery++](http://jquerypp.com/)

##Usage

Html:

	<textarea id="editor" data-autosave-key="markdAutosave"># Heading</textarea>
	<!-- or -->
	<div id="editor" data-autosave-key="markdAutosave" contenteditable># Heading</div>

Javascript:
	
	$('#editor').markd();

###Options *(defaults)*
	
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

###Public methods

	$('#editor').markd('getContent');

* `markd('getContent')` - returns the editors content
* `markd('setContent', 'some text')` - set the editors content
* `markd('setCursor', 10)` - place the cursor somewhere in the editor
* `markd('getMarkdown')` - returns the editors markdownrenderd content
* `markd('createPreview'[, 'my-stylesheet.css'])` - create a preview of the current content. You can optionally pass the url to a stylesheet to be used with the preview.
* `markd('deletePreview')` - delete a open preview
* `markd('open'[, 'key'])` - open content from localstorage. By default the value of the elements `data-autosave-key`-attribute is used as the key. 
* `markd('save'[, 'key', 'content'])` - save content to localstorage. By default the value of the elements `data-autosave-key`-attribute is used as the key and the editors content as the content.
* `markd('clear')` - clear content from localstorage

##Example

Sure. [Try it out here](http://dbmedialab.github.com/jquery-markd/) and tell us what you think.