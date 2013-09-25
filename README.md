#Markd README

Super duper experimental lightweight customizable jquery plugin markdown editor. [Try it out](http://dbmedialab.github.com/jquery-markd/).

##Dependecies

* [jQuery](http://jquery.com)
* [Mousetrap](https://github.com/ccampbell/mousetrap.git)
* [jQuery.selection from jQuery++](http://jquerypp.com/)

##Usage

Html:

	<textarea id="editor" data-markd># Heading</textarea>
	<!-- or -->
	<div id="editor" data-markd contenteditable># Heading</div>

Javascript:
	
	$('#editor').markd();

###Options *(defaults)*
	
	$('#editor').markd({
		kbd: {						// Keyboard command mappings.
			bold: 		'mod+b',	// Passing empty objects disables 
			italic: 	'mod+i',	// all keyboard commands.
			code: 		'mod+k',
			link: 		'mod+l',
			help:		'mod+h',
		},
		toolbar: ['b','i','q','l'] // Sequence of buttons in the toolbar.
	});

###Public methods

	$('#editor').markd('getContent');

* `markd('getContent')` - returns the editors content
* `markd('setContent', 'some text')` - set the editors content
* `markd('setCursor', 10)` - place the cursor somewhere in the editor