#README

Super duper light-weight customizable jquery plug-in markdown-editor.

Usage:
	
	$('#message').markd();

Options:
	
	$('#message').markd({
		theme: 'preview.css',	//Stylesheet for preview
		parser: {
			pedantic: false,	//Conform to obscure parts of markdown.pl as much as ↩								
								//possible. Don't fix any of the original markdown bugs or ↩ 								
								//poor behavior.
			sanitize: false		//Sanitize the output. Ignore any HTML that has been input.
		}
	});