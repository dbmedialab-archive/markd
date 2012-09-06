/*

	jquery-markd
	--------

	@file	   	jquery-markd.js
	@version	0.1.0
	@date	   	30.08.12
	@author	 	Tom-Marius Olsen <tmol@dagbladet.no>

	Copyright (c) 2012 DB Medialab AS <http://www.dbmedialab.no/>

*/

(function($) {

	$.fn.markd = function(options){
		
		// Extend our default options with those provided.
		var opts = $.extend({}, $.fn.markd.defaults, options);
		
		return this.each(function(){

			$(this).addClass('markd mousetrap');

			var _element  = $(this);
			var _parser = window.marked;
			var _is_fullscreen = false;
			var preview = {};
			var offset = _element.offset();
			
			//Set options for marked
			_parser.setOptions({ 
				pedantic: opts.parser.pedantic, 
				sanitize: opts.parser.sanitize
			});
			
			/**
			 * Get user input
			 * @param	{element}
			 * @return	{string}
			 **/
			function _getContent(el){
				if(el.is('textarea')){
					return el.val();
				} else {
					if(document.getElementById(el.attr('id')).innerText){
						var content = document.getElementById(el.attr('id')).innerText;
					} else {
						var content = document.getElementById(el.attr('id')).textContent;
					};
					//Get this, 2 spaces in a content editable actually converts to:
					//0020 00a0, meaning, "space no-break space". So, manually convert
					//no-break spaces to spaces again before handing to marked.
					//Thanks to Oscar Godson for that little tidbit.
					content = content.replace(/\u00a0/g, ' ').replace(/&nbsp;/g, ' ');
					return content;
				};
			};
			
			/**
			 * Update user input-field
			 * @param	{element}
			 * @param	{string}
			 * @return	{void}
			 **/
			function _setContent(el, content){
				if(el.is('textarea')){
					el.val(content);
				} else {
					content = content.replace(/\n/g, '<br>');
					el.html(content);
				};
			};
			
			/**
			 * Place the cursor at a certain position
			 * @param	{element}
			 * @param	{int}
			 * @return	{void}
			 **/
			function _setCursor(el, position){
				el.selection(position, position);
			};

			function _getIframeInnards(el) {
				return el.contentDocument || el.contentWindow.document;
			}

			
			/**
			 * Create a new iframe at the top of the document
			 * @param	{none}
			 * @return	{object} reference to the iframe
			 **/
			function createPreview(){
				var p = {};
				//Create a new iframe-element
				p.el = $('<iframe class="markd-preview"></iframe>');
				//Add the element to the top of the document
				$('body').prepend(p.el);
				p.innards = _getIframeInnards(p.el[0]);
				//Need something for... you guessed it, Firefox
				//I have no idea why the open, write, close statements are needed in Firefox,
				//but for some reason it works once thy have been called. 
				p.innards.open();
				p.innards.write('');
				p.innards.close();
				//Create aliases for the head and body inside the iframe for easy access
				p.head = $('head', p.innards);
				p.body = $('body', p.innards);								
				//Add the preview-theme to the iframe
				p.head.append('<link rel="stylesheet" href="'+opts.theme+'" />');
				return p;
			};
			
			/**
			 * Remove and delete a iframe created using createPreview()
			 * @param	{object} object created using createPreview()
			 * @return	{object} empty object
			 **/
			function deletePreview(p){
				if(p.el != undefined) p.el.remove();
				return p = {};
			}
			
			/**
			 * Insert a string into a string
			 * @param	{string} original string
			 * @param	{int} 	 where to insert the string
			 * @param	{string} string to insert
			 * @return	{string} the new string
			 **/
			function insert(string, index, insert){
				if (index > 0){
					return string.substring(0, index) + insert + string.substring(index, string.length);
				} else {
					return insert + string;
				};
			};
			
			/**
			 * Return the selection for a element.
			 * @param	{element}
			 * @return	{object} obj.start and obj.end
			 **/
			function _getSelection(el){
				var selection = el.selection();
				if(!el.is('textarea')){
					//If we are not using a textarea newlines does not count in the selection-range,
					//so we need to add these manually.
					var t = _getContent(el).substr(0, (selection.end));
					var i = 0;
					var newlines = t.match(/\n/g);
					if( newlines != null ){
						i = t.substr(0, (selection.end+1)).match(/\n/g).length;
						selection.start += i;
						selection.end += i;
					};					
					
				};
				return selection;
			};
			
			 //_setContent(_element, _getContent(_element));
			
			// !Bind keyboard commands when the textfield recives focus.
			_element.bind('focus', function(event){
				
				// !Bind tab to fake-enable tabbing
				Mousetrap.bind('tab', function(){
					var s = _getSelection(_element);
					var t = _getContent(_element);
					t = insert(t, s.end, '	');
					_setContent(_element, t);
					return false;
				});
				
				// !Bind ctrl-k to links
				Mousetrap.bind(opts.keyboardShortcuts.link, function(){
					var s = _getSelection(_element);
					var t = _getContent(_element);
					t = insert(t, s.end, ']()');
					t = insert(t, s.start, '[');
					_setContent(_element, t);
					return false;
				});
				
				// !Bind ctrl-b to bold
				Mousetrap.bind(opts.keyboardShortcuts.bold, function(){
					var s = _getSelection(_element);
					var t = _getContent(_element);
					t = insert(t, s.end, '__');
					t = insert(t, s.start, '__');
					_setContent(_element, t);
					return false;
				});
				
				// !Bind ctrl-i to emphasis/italic
				Mousetrap.bind(opts.keyboardShortcuts.italic, function(){
					var s = _getSelection(_element);
					var t = _getContent(_element);
					t = insert(t, s.end, '_');
					t = insert(t, s.start, '_');
					_setContent(_element, t);
					return false;
				});
				
				// !Bind ctrl-h as in 'help'. Opens a new window showing the markdown syntax.
				Mousetrap.bind(opts.keyboardShortcuts.help, function(){
					window.open('http://daringfireball.net/projects/markdown/syntax', '_blank');
					return false;
				});
				
				// !Bind ctrl-p to toggle preview text
				Mousetrap.bind(opts.keyboardShortcuts.preview, function(){					
					if(!_is_fullscreen){
						if(preview.el == undefined){
							//Create a new iframe to preview the text
							preview = createPreview();
							//Place the iframe directly above the textarea
							preview.el.css({
								top: offset.top,
								left: offset.left,
								width: _element.outerWidth(),
								height: _element.outerHeight()
							});
							//Render the text into the iframe
							preview.body.html( _parser(_getContent(_element)) );							
							// Bind esc to close preview
							Mousetrap.bind('esc', function(){
								//Remove and delete the preview
								preview = deletePreview(preview);
								//Unbind esc
								Mousetrap.unbind('esc');
							});
						} else {
							//Remove and delete the preview
							preview = deletePreview(preview);
							//Unbind esc
							Mousetrap.unbind('esc');
						};
					};
					//Return false to prevent default browser behavior.
					return false;
				});
				
				// !Bind ctrl-f as a toggle for fullscreen-mode.
				Mousetrap.bind(opts.keyboardShortcuts.fullscreen, function(){
					//Enter fullscreen
					if(!_is_fullscreen){
						//Flag fullscreen as true
						_is_fullscreen = true;
						//Give editor fullscreen styles
						_element.addClass('fullscreen');
						//Create a new iframe to preview the text
						preview = createPreview();
						//Give the preview fullscreen styles
						preview.el.addClass('fullscreen');
						//Update the preview on each keyup
						_element.bind('keyup', function(event){
							preview.body.html( _parser( _getContent(_element) ) );
						});
						// Bind esc to close fullscreen view
						Mousetrap.bind('esc', function(){
							//Flag fullscreen as false
							_is_fullscreen = false;
							//Remove fullscreen styles from editor
							_element.removeClass('fullscreen');
							//Unbind preview-update on each keyup 
							_element.unbind('keyup');
							//Unbind esc
							Mousetrap.unbind('esc');
							//Remove and delete the preview
							preview = deletePreview(preview);
						});
					//Exit fullscreen
					} else {
						//Flag fullscreen as false
						_is_fullscreen = false;
						//Remove fullscreen styles from editor
						_element.removeClass('fullscreen');
						//Unbind preview-update on each keyup 
						_element.unbind('keyup');
						//Unbind esc
						Mousetrap.unbind('esc');
						//Remove and delete the preview
						preview = deletePreview(preview);
					};
					//Return false to prevent default browser behavior.
					return false;
				});

			});
			
			// !Unbind keyboard commands and clean-up when textarea looses focus.
			_element.bind('blur', function(event){
				// Unbind the keyboard commands
				Mousetrap.unbind('tab');
				Mousetrap.unbind(opts.keyboardShortcuts.bold);
				Mousetrap.unbind(opts.keyboardShortcuts.italic);
				Mousetrap.unbind(opts.keyboardShortcuts.link);
				Mousetrap.unbind(opts.keyboardShortcuts.help);
				Mousetrap.unbind(opts.keyboardShortcuts.preview);
				Mousetrap.unbind(opts.keyboardShortcuts.fullscreen);
				// If we are not in fullscreen-mode and the preview is visible, we need to kill the preview.
				if(!_is_fullscreen) preview = deletePreview(preview);
			});
			
		});
		
	};
	
	// !Default options
	$.fn.markd.defaults = {
		theme: 'preview.css',
		keyboardShortcuts: {
			bold: 		'ctrl+b',
			italic: 	'ctrl+i',
			link: 		'ctrl+k',
			help:		'ctrl+h',
			preview:	'ctrl+p',
			fullscreen: 'ctrl+f'
		},
		parser: {
			pedantic: false,
			sanitize: false
		}
	};
	
}(jQuery));