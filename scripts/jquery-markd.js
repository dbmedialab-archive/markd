/*

	jquery-markd
	--------

	@file	   	jquery-markd.js
	@version	0.2.0
	@date	   	10.09.12
	@author	 	Tom-Marius Olsen <tmol@dagbladet.no>

	Copyright (c) 2012 DB Medialab AS <http://www.dbmedialab.no/>

*/

(function($) {
	
	var methods = {
		/**
		 * Init
		 * @param	{none}
		 * @return	{void}
		 **/
		init: function(options) {
			return this.each(function(){
				
				$(this).data('options', $.extend({}, $.fn.markd.defaults, options) );
				$(this).addClass('markd mousetrap');
				
			    var _element  = $(this);
			    var _parser = window.marked;
			    var _is_fullscreen = false;
			    var preview = {};
			    var offset = _element.offset();
				var opts = $(this).data('options');
				
				//If we are not using a textarea we need to remove all linebreaks or these will be counted twice.
				if(!_element.is('textarea')){
					var t = _element.html();
					methods.setContent(_element, t.replace(/(\r\n|\n|\r)/gm, ''));
				};
			    			    
			    //Set options for marked
			    _parser.setOptions({ 
			    	pedantic: opts.parser.pedantic, 
			    	sanitize: opts.parser.sanitize
			    });

			    // !Bind keyboard commands when the textfield recives focus.
			    _element.bind('focus', function(event){
			        
			        // !Bind tab to fake-enable tabbing
			        Mousetrap.bind('tab', function(){
			        	var s = methods.getSelection(_element);
			        	var t = methods.getContent(_element);
			        	t = methods.insert(t, s.end, '\t');
			        	methods.setContent(_element, t);
			        	methods.setCursor(_element, s.end+1);
			        	return false;
			        });
			        
			        // !Bind ctrl-k to links
			        Mousetrap.bind(opts.keyboardShortcuts.link, function(){
			        	var s = methods.getSelection(_element);
			        	var t = methods.getContent(_element);			        	
			        	var l = t.substring(s.start, s.end).match(/(http|https|ftp):\/\//);
			        	if(l != null){
				        	t = methods.insert(t, s.end, ')');
				        	t = methods.insert(t, s.start, '[](');
				        	methods.setContent(_element, t);
				        	methods.setCursor(_element, s.start+1);
			        	} else {
				        	t = methods.insert(t, s.end, ']()');
				        	t = methods.insert(t, s.start, '[');
				        	methods.setContent(_element, t);
				        	methods.setCursor(_element, s.end+3);
			        	};
			        	return false;
			        });
			        
			        // !Bind ctrl-b to bold
			        Mousetrap.bind(opts.keyboardShortcuts.bold, function(){
			        	var s = methods.getSelection(_element);
			        	var t = methods.getContent(_element);
			        	t = methods.insert(t, s.end, '__');
			        	t = methods.insert(t, s.start, '__');
			        	methods.setContent(_element, t);
			        	methods.setCursor(_element, s.end+4);
			        	return false;
			        });
			        
			        // !Bind ctrl-i to emphasis/italic
			        Mousetrap.bind(opts.keyboardShortcuts.italic, function(){
			        	var s = methods.getSelection(_element);
			        	var t = methods.getContent(_element);
			        	t = methods.insert(t, s.end, '_');
			        	t = methods.insert(t, s.start, '_');
			        	methods.setContent(_element, t);
			        	methods.setCursor(_element, s.end+2);
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
			        			preview = methods.createPreview(opts.theme);
			        			//Place the iframe directly above the textarea
			        			preview.el.css({
			        				top: offset.top,
			        				left: offset.left,
			        				width: _element.outerWidth(),
			        				height: _element.outerHeight()
			        			});
			        			//Render the text into the iframe
			        			preview.body.html( _parser(methods.getContent(_element)) );							
			        			// Bind esc to close preview
			        			Mousetrap.bind('esc', function(){
			        				//Remove and delete the preview
			        				preview = methods.deletePreview(preview);
			        				//Unbind esc
			        				Mousetrap.unbind('esc');
			        			});
			        		} else {
			        			//Remove and delete the preview
			        			preview = methods.deletePreview(preview);
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
			        		preview = methods.createPreview(opts.theme);
			        		//Give the preview fullscreen styles
			        		preview.el.addClass('fullscreen');
			        		//Update the preview on each keyup
			        		_element.bind('keyup', function(event){
			        			preview.body.html( _parser( methods.getContent(_element) ) );
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
			        			preview = methods.deletePreview(preview);
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
			        		preview = methods.deletePreview(preview);
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
			        if(!_is_fullscreen) preview = methods.deletePreview(preview);
			    });			    
			    
			});
			
		},
		/**
		 * Get user input
		 * @param	{element}
		 * @return	{string}
		 **/
		getContent: function(el) {
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
		},
		/**
		 * Update user input-field
		 * @param	{element}
		 * @param	{string}
		 * @return	{void}
		 **/
		setContent: function(el, content) {
			if(el.is('textarea')){
			    el.val(content);
			} else {
			    content = content.replace(/(\r\n|\n|\r)/gm, '<br>');
			    el.html(content);
			};
		},
		/**
		 * Return the selection for a element.
		 * @param	{element}
		 * @return	{object} obj.start and obj.end
		 **/
		getSelection: function(el){
		    var selection = el.selection();
		    if(!el.is('textarea')){
		    	//If we are not using a textarea newlines does not count in the selection-range,
		    	//so we need to add these manually.
		    	var t = methods.getContent(el).substr(0, selection.end);
		    	var newlines = t.match(/(\r\n|\n|\r)/gm);
		    	if( newlines != null ){
		    		var n = methods.getContent(el).substr(0, ( selection.end+newlines.length )).match(/(\r\n|\n|\r)/gm);
		    		selection.start += n.length;
		    		selection.end += n.length;
		    		//This fixes a issue where when selecting the first character in a line
		    		//where the character before is a newline creates the wrong selection.
		    		//It's not pretty, but it works.
		    		if(methods.getContent(el).substring(selection.start, selection.end).match(/(\r\n|\n|\r)/gm)){
			    		selection.start ++;
			    		selection.end ++;
		    		};
		    	};
		    };
		    return selection;
		},
		/**
		 * Place the cursor at a certain position
		 * @param	{element}
		 * @param	{int}
		 * @return	{void}
		 **/
		setCursor: function(el, position) {
		    if(!el.is('textarea')){
		    	//If we are not using a textarea remove newlines
		    	//as these do not count.
		    	var t = methods.getContent(el).substr(0, position);
		    	var newlines = t.match(/(\r\n|\n|\r)/gm);
		    	if( newlines != null ){
		    		position -= newlines.length;
		    	};
		    };
		    el.selection(position, position);
		},
		/**
		 * Get content of iframe depending on browser
		 * @param	{element}
		 * @return	{element}
		 **/
		 getIframeInnards: function(el) {
			return el.contentDocument || el.contentWindow.document;
		},

		/**
		 * Create a new iframe at the top of the document
		 * @param	{none}
		 * @return	{object} reference to the iframe
		 **/
		createPreview: function(theme){
		    var p = {};
		    //Create a new iframe-element
		    p.el = $('<iframe class="markd-preview"></iframe>');
		    //Add the element to the top of the document
		    $('body').prepend(p.el);
		    p.innards = methods.getIframeInnards(p.el[0]);
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
		    p.head.append('<link rel="stylesheet" href="'+theme+'" />');
		    return p;
		},
		/**
		 * Remove and delete a iframe created using createPreview()
		 * @param	{object} object created using createPreview()
		 * @return	{object} empty object
		 **/
		deletePreview: function(p){
		    if(p.el != undefined) p.el.remove();
		    return p = {};
		},
		/**
		 * Insert a string into a string
		 * @param	{string} original string
		 * @param	{int} 	 where to insert the string
		 * @param	{string} string to insert
		 * @return	{string} the new string
		 **/
		insert: function(string, index, insert){
		    if (index > 0){
		    	return string.substring(0, index) + insert + string.substring(index, string.length);
		    } else {
		    	return insert + string;
		    };
		}
	};
	
	$.fn.markd = function(method){		
		// Method calling logic
		if ( methods[method] ) {
		    return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		    return methods.init.apply( this, arguments );
		} else {
		    $.error( 'Method ' +  method + ' does not exist on jQuery.markd' );
		};		
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