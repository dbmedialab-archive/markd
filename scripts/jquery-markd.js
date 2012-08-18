/*

	jquery-markd
	--------

	@file       jquery-markd.js
	@version    
	@date       18.08.12
	@author     Tom-Marius Olsen <tmol@dagbladet.no>

	Copyright (c) 2012 DB Medialab AS <http://www.dbmedialab.no/>

*/

(function($) {

	$.fn.markd = function(options){
		
		// Extend our default options with those provided.
		var opts = $.extend({}, $.fn.markd.defaults, options);
		
		return this.each(function(){

			$(this).addClass('reword mousetrap');

			var _element  = $(this);
			var _state = '';
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
			 * Create a new iframe at the top of the document
			 * @param	{none}
			 * @return	{object} reference to the iframe
			 **/
			function createPreview(){
				var p = {};
				//Create a new iframe-element
				p.el = $('<iframe class="reword-preview"></iframe>');
				//Add the element to the top of the document
				$('body').prepend(p.el);
				//Create aliases for the head and body inside the iframe for easy access
				p.head = $('head', p.el[0].contentWindow.document);
				p.body = $('body', p.el[0].contentWindow.document);				
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
			
			function insert(string, index, insert){
				if (index > 0){
					return string.substring(0, index) + insert + string.substring(index, string.length);
				} else {
					return insert + string;
				};
			};
			
			// !Bind keyboard commands when the textfield recives focus.
			_element.bind('focus', function(event){

				Mousetrap.bind('ctrl+k', function(){
					var selection = _element.selection();
					var t = _element.val();
					t = insert(t, selection.end, '](http://example.net/)');
					t = insert(t, selection.start, '[');
					_element.val(t);
					return false;
				});				
				
				Mousetrap.bind('ctrl+b', function(){
					var selection = _element.selection();
					var t = _element.val();
					t = insert(t, selection.end, '__');
					t = insert(t, selection.start, '__');
					_element.val(t);
					return false;
				});

				Mousetrap.bind('ctrl+i', function(){
					var selection = _element.selection();
					var t = _element.val();
					t = insert(t, selection.end, '_');
					t = insert(t, selection.start, '_');
					_element.val(t);
					return false;
				});
				
				// !Bind ctrl-h as in 'help'. Opens a new window showing the markdown syntax.
				Mousetrap.bind('ctrl+h', function(){
					window.open('http://daringfireball.net/projects/markdown/syntax', '_blank');
					return false;
				});
				
				// !Bind ctrl-p as to toggle preview text
				Mousetrap.bind('ctrl+p', function(){
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
							preview.body.html( _parser( _element.val() ) );
						} else {
							//Remove and delete the preview
							preview = deletePreview(preview);
						};
					};					
					//Return false to prevent default browser behavior.
					return false;
				});
				
				// !Bind ctrl-f as a toggle for fullscreen-mode.
				Mousetrap.bind('ctrl+f', function(){
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
				    		preview.body.html( _parser( _element.val() ) );
				    	});
				    //Exit fullscreen
				    } else {
				    	//Flag fullscreen as false
				    	_is_fullscreen = false;
				    	//Remove fullscreen styles from editor
				    	_element.removeClass('fullscreen');
				    	//Unbind preview-update on each keyup 
				    	_element.unbind('keyup');
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
				Mousetrap.unbind('ctrl+h');
				Mousetrap.unbind('ctrl+p');
				Mousetrap.unbind('ctrl+f');
				// If we are not in fullscreen-mode and the preview is visible, we need to kill the preview.
				if(!_is_fullscreen) preview = deletePreview(preview);
			});
			
		});
		
	};
	
	$.fn.markd.defaults = {
		theme: 'preview.css',
		parser: {
			pedantic: false,
			sanitize: false
		}
	};
	
}(jQuery));