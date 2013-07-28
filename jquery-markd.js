//  jquery-markd 0.1

//  Copyright (c) 2012-2013 DB Medialab AS <http://www.dbmedialab.no/>
//  jquery-markd may be freely distributed under the MIT license.

(function($) {
	
	//!Public methods
	var pub = {
		/**
		 * Init
		 * @param	{object} options
		 * @return	{array} array containing the content of each editor
		 **/
		init: function(options) {
			return this.each(function(){
				var $this = $(this);
				
				//If the plugin hasn't been initialized yet save all our settings 
				if($this.data('markd') === undefined){
					$this.addClass('markd mousetrap');
					$this.data('markd', 
						$.extend(
							{},
							$.fn.markd.defaults,
							options,
							{
								is_fullscreen: false,
								preview: {}
							}
						)
					);
				}

				//If autosave is on, localstorage is supported, and a autosave-key is present, we can enabled autosave
				if($this.data('markd').autosave && typeof(Storage) !== 'undefined' && $this.attr('data-autosave-key') !== undefined){
					if(pub.getContent.apply($this).length === 0){
						//Try to open any autosaved document
						pub.open.apply($this);				
					}
					//Flag autosave as enabled
					$this.data('markd').autosave = true;
				}
				
				//If we are not using a textarea we need to remove all linebreaks or these will be counted twice.
				if(!$this.is('textarea')){
					var t = $this.html();
					pub.setContent.apply( $this, [t.replace(/(\r\n|\n|\r)/gm, '')] );
				}
								
				//Set options for marked
				$this.data('markd').parser.compiler.setOptions({ 
					pedantic: $this.data('markd').parser.pedantic, 
					sanitize: $this.data('markd').parser.sanitize
				});
				
				var data = $this.data('markd');

				// !Bind keyboard commands when the textfield recives focus.
				$this.bind('focus', function(event){
					priv.focus.apply($this);
				});
				
				// !Unbind keyboard commands and clean-up when textarea looses focus.
				$this.bind('blur', function(event){
					priv.blur.apply($this);
				});
								
			});
			
		},
		/**
		 * Get the content from the editor
		 * @return	{array} array containing the content of each editor
		 **/
		getContent: function(){
			var content = [];
			this.each(function(){
				var $this = $(this);
				content.push( priv.getContent.apply( $this ) );	
			});
			return content;
		},
		/**
		 * Update editors content 
		 * @param	{string} the content 
		 * @return	{array} array containing each element
		 **/
		setContent: function(content) {
			return this.each(function(){
				var $this = $(this),
					data = $this.data('markd');

				if($this.is('textarea')){
					$this.val(content);
				} else {
					content = content.replace(/(\r\n|\n|\r)/gm, '<br>');
					$this.html(content);
				}
			});
		},
		/**
		 * Place the cursor at a certain position
		 * @param	{int} position to place the cursor
		 * @return	{array} array containing each element
		 **/
		setCursor: function(position) {
			return this.each(function(){
				var $this = $(this),
						t = priv.getContent.apply($this);
				
				if(!$this.is('textarea')){
					//If we are not using a textarea remove newlines as these do not count.
					var newlines = t.substr(0, position).match(/(\r\n|\n|\r)/gm);
					if( newlines !== null ){
						position -= newlines.length;
					}
				}
				$this.selection(position, position);
			});
		},
		/**
		 * Get the markdown from the editor
		 * @return	{array} array containing the markdown of each editor
		 **/
		getMarkdown: function(){
			var content = [];
			this.each(function(){
				var $this = $(this),
					data = $this.data('markd');

				content.push( data.parser.compiler( priv.getContent.apply($this) ) );
			});
			return content;
		},
		/**
		 * Create a new iframe at the top of the document to hold the editors preview
		 * @param	{string} url to stylesheet used to style the preview
		 * @return	{array} array containing each element
		 **/
		createPreview: function(theme){
			return this.each(function(){
				var $this = $(this),
						p = {};
				
				//If no theme-param is specified use what is specified for the plug-in.
				if(theme === undefined) theme = $this.data('markd').theme;		
				//Create a new iframe-element
				p.el = $('<iframe class="markd-preview"></iframe>');
				//Add the element to the top of the document
				$('body').prepend(p.el);
				p.innards = priv.getIframeInnards(p.el[0]);
				//Need something for... you guessed it, Firefox
				//I have no idea why the open, write, close statements are needed in Firefox,
				//but for some reason it works once they have been called. 
				p.innards.open();
				p.innards.write('');
				p.innards.close();
				//Create aliases for the head and body inside the iframe for easy access
				p.head = $('head', p.innards);
				p.body = $('body', p.innards);
				//Add the preview-theme to the iframe
				p.head.append('<link rel="stylesheet" href="'+theme+'" />');
				$this.data('markd').preview = p;
			});
		},
		/**
		 * Remove and delete the editors preview
		 * @return	{array} array containing each element
		 **/
		deletePreview: function(){
			return this.each(function(){
				var $this = $(this),
					data = $this.data('markd');

				if(data.preview.el !== undefined) data.preview.el.remove();
				$this.data('markd').preview = {};
			});
		},
		/**
		 * Get last saved data from localstorage and insert into editor
		 * @param	[{string} key for localstorage]
		 * @return	{array} array containing each element
		 **/
		open: function(key){
			return this.each(function(){
				var $this = $(this);
				if(key === undefined) key = $this.attr('data-autosave-key');
				var content = localStorage.getItem(key);
				if( content !== null ){
					pub.setContent.apply($this, [content]);
				}
			});
		},
		/**
		 * Save the contents of the editor to localstorage
		 * @param	[{string} key for localstorage]
		 * @param	[{string} content]
		 * @return	{array} array containing each element
		 **/
		save: function(key, content){
			return this.each(function(){
				var $this = $(this);
				if(key === undefined) key = $this.attr('data-autosave-key');
				if(content === undefined) content = priv.getContent.apply($this);
				localStorage.setItem(key, content);
			});			
		},
		/**
		 * Delete the localstorge associated with the key
		 * @param	[{string} key for localstorage]
		 * @return	{array} array containing each element
		 **/
		clear: function(key){
			return this.each(function(){
				var $this = $(this);
				if(key === undefined) key = $this.attr('data-autosave-key');
				localStorage.removeItem(key);
			});
		}
	};
	
	//!Private methods
	var priv = {
		focus: function(){
			var $this = $(this),
				data = $this.data('markd');

			// !Bind keyup to fire every time – if autosave is enabled.
			if(data.autosave){
				$this.bind('keyup', function(){
					pub.save.apply($this);
				});
			}
			
			// !Bind tab to fake-enable tabbing
			Mousetrap.bind('tab', function(){
				var s = priv.getSelection.apply($this);
				var t = priv.getContent.apply($this);
				t = priv.insert(t, s.end, '\t');
				pub.setContent.apply($this, [t]);
				pub.setCursor.apply($this, [s.end+1]);
				return false;
			});
			
			// !Bind ctrl-l to links
			Mousetrap.bind(data.keyboardShortcuts.link, function(){
				var s = priv.getSelection.apply($this);
				var t = priv.getContent.apply($this);						
				var l = t.substring(s.start, s.end).match(/(http|https|ftp):\/\//);
				if(l !== null){
					t = priv.insert(t, s.end, ')');
					t = priv.insert(t, s.start, '[](');
					pub.setContent.apply($this, [t]);
					pub.setCursor.apply($this, [s.start+1]);
				} else {
					t = priv.insert(t, s.end, ']()');
					t = priv.insert(t, s.start, '[');
					pub.setContent.apply($this, [t]);
					pub.setCursor.apply($this, [s.end+3]);
				}
				return false;
			});
			
			// !Bind ctrl-k to code
			Mousetrap.bind(data.keyboardShortcuts.code, function(){
				var s = priv.getSelection.apply($this);
				var t = priv.getContent.apply($this);
				t = priv.insert(t, s.end, '`');
				t = priv.insert(t, s.start, '`');
				pub.setContent.apply($this, [t]);
				pub.setCursor.apply($this, [s.end+2]);
				return false;
			});
			
			// !Bind ctrl-b to bold
			Mousetrap.bind(data.keyboardShortcuts.bold, function(){
				var s = priv.getSelection.apply($this);
				var t = priv.getContent.apply($this);
				t = priv.insert(t, s.end, '__');
				t = priv.insert(t, s.start, '__');
				pub.setContent.apply($this, [t]);
				pub.setCursor.apply($this, [s.end+4]);
				return false;
			});
			
			// !Bind ctrl-i to emphasis/italic
			Mousetrap.bind(data.keyboardShortcuts.italic, function(){
				var s = priv.getSelection.apply($this);
				var t = priv.getContent.apply($this);
				t = priv.insert(t, s.end, '_');
				t = priv.insert(t, s.start, '_');
				pub.setContent.apply($this, [t]);
				pub.setCursor.apply($this, [s.end+2]);
				return false;
			});
			
			// !Bind ctrl-h as in 'help'. Opens a new window showing the markdown syntax.
			Mousetrap.bind(data.keyboardShortcuts.help, function(){
				window.open('http://daringfireball.net/projects/markdown/syntax', '_blank');
				return false;
			});
			
			// !Bind ctrl-p to toggle preview text
			Mousetrap.bind(data.keyboardShortcuts.preview, function(){
				if(!data.is_fullscreen){
					if($this.data('markd').preview.el === undefined){
						//Get the offset of the editor before we insert the iframe used for the preview.
						var offset = $this.offset();
						//Create a new iframe to preview the text
						pub.createPreview.apply($this);
						//Shortcut for the new preview
						preview = $this.data('markd').preview;
						//Place the iframe directly above the textarea
						preview.el.css({
							position: 'absolute',
							top: offset.top,
							left: offset.left,
							width: $this.outerWidth(),
							height: $this.outerHeight()
						});
						//Render the text into the iframe								
						preview.body.html( data.parser.compiler( priv.getContent.apply($this) ) );
						// Bind esc to close preview
						Mousetrap.bind('esc', function(){
							//Remove and delete the preview
							pub.deletePreview.apply($this);
							//Unbind esc
							Mousetrap.unbind('esc');
						});
					} else {
						//Remove and delete the preview
						pub.deletePreview.apply($this);
						//Unbind esc
						Mousetrap.unbind('esc');
					}
				}
				//Return false to prevent default browser behavior.
				return false;
			});
			
			// !Bind ctrl-f as a toggle for fullscreen-mode.
			Mousetrap.bind(data.keyboardShortcuts.fullscreen, function(){
				//If the preview is open we need to close it first.
				if($this.data('markd').preview.el !== undefined){
					pub.deletePreview.apply($this);
				}
				//Enter fullscreen
				if(!data.is_fullscreen){
					//Flag fullscreen as true
					data.is_fullscreen = true;
					//Give editor fullscreen styles
					$this.addClass('fullscreen');
					//Create a new iframe to preview the text
					pub.createPreview.apply($this);
					//Shortcut for the new preview
					preview = $this.data('markd').preview;
					//Give the preview fullscreen styles
					preview.el.addClass('fullscreen');
					//Update the preview on each keyup
					$this.bind('keyup', function(event){
						preview.body.html( data.parser.compiler( priv.getContent.apply($this) ) );
						//Scroll to the correct place in the preview
						priv.paralellScroll.apply($this);
					});
					//Bind paralell scrolling
					$this.bind('scroll', function(event){
						priv.paralellScroll.apply($this);
					});
					// Bind esc to close fullscreen view
					Mousetrap.bind('esc', function(){
						//Flag fullscreen as false
						data.is_fullscreen = false;
						//Remove fullscreen styles from editor
						$this.removeClass('fullscreen');
						//Unbind preview-update on each keyup 
						$this.unbind('keyup');
						//Unbind paralell scrolling
						$this.unbind('scroll');
						//Unbind esc
						Mousetrap.unbind('esc');
						//Remove and delete the preview
						pub.deletePreview.apply($this);
					});
				//Exit fullscreen
				} else {
					//Flag fullscreen as false
					data.is_fullscreen = false;
					//Remove fullscreen styles from editor
					$this.removeClass('fullscreen');
					//Unbind preview-update on each keyup 
					$this.unbind('keyup');
					//Unbind paralell scrolling
					$this.unbind('scroll');
					//Unbind esc
					Mousetrap.unbind('esc');
					//Remove and delete the preview
					pub.deletePreview.apply($this);
				}
				//Return false to prevent default browser behavior.
				return false;
			});
		},
		/**
		 * Unbind keyboard commands and clean-up when textarea looses focus
		 * @return	{void}
		 **/
		blur: function(){
			var $this = $(this),
				data = $this.data('markd');
			
			// Unbind the keyboard commands
			if(data.autosave){ $this.unbind('keyup'); }
			Mousetrap.unbind('tab');
			Mousetrap.unbind(data.keyboardShortcuts.bold);
			Mousetrap.unbind(data.keyboardShortcuts.italic);
			Mousetrap.unbind(data.keyboardShortcuts.link);
			Mousetrap.unbind(data.keyboardShortcuts.help);
			Mousetrap.unbind(data.keyboardShortcuts.preview);
			Mousetrap.unbind(data.keyboardShortcuts.fullscreen);
			// If we are not in fullscreen-mode and the preview is visible, we need to kill the preview.
			if(!data.is_fullscreen) pub.deletePreview.apply($this);
		},
		/**
		 * Insert a string into a string
		 * @param	{string} original string
		 * @param	{int} where to insert the string
		 * @param	{string} string to insert
		 * @return	{string} the new string
		 **/
		insert: function(string, index, insert){
			if (index > 0){
				return string.substring(0, index) + insert + string.substring(index, string.length);
			} else {
				return insert + string;
			}
		},
		/**
		 * Get user input
		 * @return	{string}
		 **/
		getContent: function() {
			var $this = $(this);

			if($this.is('textarea')){
				return $this.val();
			} else {
				var content;
				// !FIXME: We require the elements id for this to work, this should not be necessary. Someone smarter than me should fix this.
				if(document.getElementById($this.attr('id')).innerText){
					content = document.getElementById($this.attr('id')).innerText;
				} else {
					content = document.getElementById($this.attr('id')).textContent;
				}
				//Get this, 2 spaces in a content editable actually converts to:
				//0020 00a0, meaning, "space no-break space". So, manually convert
				//no-break spaces to spaces again before handing to marked.
				//Thanks to Oscar Godson for that little tidbit.
				content = content.replace(/\u00a0/g, ' ').replace(/&nbsp;/g, ' ');
				return content;
			}
		},
		/**
		 * Return the selection for a element.
		 * @param	{element}
		 * @return	{object} obj.start and obj.end
		 **/
		getSelection: function(){
			var $this = $(this);

			var selection = $this.selection();
			if(!$this.is('textarea')){
				//If we are not using a textarea newlines does not count in the selection-range,
				//so we need to add these manually.
				var t = priv.getContent.apply($this).substr(0, selection.end);
				var newlines = t.match(/(\r\n|\n|\r)/gm);
				if( newlines !== null ){
					var n = priv.getContent.apply($this).substr(0, ( selection.end+newlines.length )).match(/(\r\n|\n|\r)/gm);
					selection.start += n.length;
					selection.end += n.length;
					//This fixes a issue where when selecting the first character in a line
					//where the character before is a newline creates the wrong selection.
					//It's not pretty, but it works.
					if(priv.getContent.apply($this).substring(selection.start, selection.end).match(/(\r\n|\n|\r)/gm)){
						selection.start ++;
						selection.end ++;
					}
				}
			}
			return selection;
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
		 * When in fullscreen mode scroll both editor and preview in paralell
		 * @param	{element}
		 * @return	{void}
		 **/
		paralellScroll: function(){
			var $this = $(this);
			var preview = $this.data('markd').preview;
			var maxScrollOffsetEditor = $this.get(0).scrollHeight - $this.get(0).clientHeight;
			var percentageScrolledEditor = 100 / maxScrollOffsetEditor * $this.get(0).scrollTop;			
			var maxScrollOffsetPreview = preview.body.get(0).scrollHeight - preview.body.get(0).clientHeight;			
			var scrollTo = maxScrollOffsetPreview / 100 * percentageScrolledEditor;			
			preview.body.scrollTop( scrollTo );
		}
	};
	
	// !Method calling logic
	$.fn.markd = function(method){
		if ( pub[method] ) {
			return pub[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return pub.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.markd' );
		}
	};
	
	// !Default options
	$.fn.markd.defaults = {
		autosave: true,
		theme: 'preview.css',
		keyboardShortcuts: {
			bold:		'ctrl+b',
			italic:		'ctrl+i',
			code:		'ctrl+k',
			link:		'ctrl+l',
			help:		'ctrl+h',
			preview:	'ctrl+p',
			fullscreen: 'ctrl+f'
		},
		parser: {
			compiler: window.marked,
			pedantic: false,
			sanitize: false
		}
	};
	
}(jQuery));