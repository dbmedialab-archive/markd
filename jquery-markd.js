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
				
				if( $('.markd-toolbar').length === 0 && $this.attr('data-toolbar') == 'true' ){
					var toolbar = [];
					toolbar.push('<ul class="markd-toolbar">');
					toolbar.push('	<li><a class="action bold">B</a></li>');
					toolbar.push('	<li><a class="action italic">I</a></li>');
					toolbar.push('	<li>');
					toolbar.push('		<a class="action quote">');
					toolbar.push('			<svg class="icon" viewBox="0 0 20 20">');
					toolbar.push('				<path fill="#FFFFFF" d="M4.773,1.076C3.779,1.621,2.921,2.308,2.207,3.138C1.489,3.967,0.936,4.928,0.541,6.016 C0.179,7.011,0,8.071,0,9.19c0,0.107,0.001,0.213,0.005,0.322v8.642h8.264V9.228H4.637c0.028-1.232,0.277-2.266,0.742-3.112 c0.48-0.874,1.376-1.549,2.74-2.017l0.15-0.051V0l-0.25,0.033C6.853,0.183,5.77,0.531,4.773,1.076z M19.851,4.099L20,4.047V0 l-0.252,0.033c-1.164,0.15-2.247,0.499-3.244,1.043c-0.995,0.545-1.853,1.232-2.567,2.062c-0.717,0.829-1.272,1.791-1.665,2.878 c-0.362,0.995-0.542,2.055-0.542,3.172c0,0.109,0.002,0.215,0.005,0.324v8.642H20V9.228h-3.633c0.026-1.232,0.277-2.266,0.742-3.112 C17.589,5.242,18.486,4.567,19.851,4.099z"/>');
					toolbar.push('			</svg>');
					toolbar.push('		</a>');
					toolbar.push('	</li>');
					toolbar.push('	<li>');
					toolbar.push('		<a class="action link">');
					toolbar.push('			<svg class="icon" viewBox="0 0 20 20">');
					toolbar.push('				<path fill="#FFFFFF" d="M10.204,13.854c-1.288,0.001-2.579-0.503-3.551-1.477l0,0l-0.154-0.154l2.206-2.206l0.154,0.154 c0.38,0.379,0.859,0.562,1.345,0.563l0,0c0.508-0.001,0.994-0.185,1.373-0.563l0,0l3.615-3.616 c0.379-0.379,0.562-0.863,0.563-1.362l0,0c-0.002-0.494-0.185-0.977-0.562-1.356l0,0L15.04,3.683 c-0.38-0.378-0.863-0.562-1.359-0.563l0,0c-0.498,0.002-0.98,0.185-1.36,0.563l0,0l-1.486,1.487c-0.608,0.609-1.596,0.609-2.206,0 l0,0c-0.609-0.609-0.609-1.597,0-2.206l0,0l1.487-1.486c0.98-0.981,2.28-1.479,3.565-1.477l0,0 c1.284-0.002,2.584,0.496,3.564,1.477l0,0l0.154,0.153c0.979,0.979,1.478,2.277,1.477,3.562l0,0 c0.001,1.285-0.494,2.586-1.477,3.568l0,0l-3.617,3.616c-0.986,0.988-2.29,1.478-3.57,1.478l0,0 C10.209,13.854,10.207,13.854,10.204,13.854L10.204,13.854z"/>');
					toolbar.push('				<path fill="#FFFFFF" d="M5.182,20c-1.288,0.001-2.579-0.503-3.551-1.477l0,0l-0.154-0.154C0.493,17.386-0.002,16.084,0,14.8l0,0 c-0.002-1.285,0.498-2.582,1.477-3.561l0,0l3.616-3.616c0.98-0.981,2.28-1.479,3.565-1.477l0,0 c1.007-0.001,2.023,0.304,2.888,0.909l0,0c0.144,0.073,0.277,0.169,0.396,0.289l0,0l0.279,0.28l0.154,0.153l0,0v0l-2.205,2.206l0,0 l-0.154-0.154c-0.38-0.378-0.862-0.561-1.359-0.563l0,0C8.16,9.268,7.678,9.451,7.299,9.829l0,0l-3.617,3.616 c-0.378,0.38-0.561,0.86-0.563,1.354l0,0c0.002,0.501,0.186,0.984,0.563,1.364l0,0l0.154,0.153c0.38,0.379,0.859,0.562,1.345,0.562 l0,0c0.509-0.002,0.994-0.185,1.373-0.562l0,0l1.558-1.558c0.609-0.609,1.597-0.609,2.206,0l0,0c0.609,0.609,0.609,1.596,0,2.205 l0,0L8.76,18.523C7.774,19.511,6.47,20,5.189,20l0,0C5.187,20,5.185,20,5.182,20L5.182,20z"/>');
					toolbar.push('			</svg>');
					toolbar.push('		</a>');
					toolbar.push('	</li>');
					toolbar.push('</ul>');
					toolbar = toolbar.join('');
					$('body').prepend(toolbar);
				}
				
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
		 * Get the html from the editor
		 * @return	{array} array containing the markdown of each editor
		 **/
		getHtml: function(){
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
		tab: function(){
			var $this = $(this);
			var s = priv.getSelection.apply($this);
			var t = priv.getContent.apply($this);
			t = priv.insert(t, s.end, '\t');
			pub.setContent.apply($this, [t]);
			pub.setCursor.apply($this, [s.end+1]);
		},
		
		link: function(){
			var $this = $(this);
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
		},
		
		code: function(){
			var $this = $(this);
			var s = priv.getSelection.apply($this);
			var t = priv.getContent.apply($this);
			t = priv.insert(t, s.end, '`');
			t = priv.insert(t, s.start, '`');
			pub.setContent.apply($this, [t]);
			pub.setCursor.apply($this, [s.end+2]);
		},
		
		bold: function(){
			var $this = $(this);
			var s = priv.getSelection.apply($this);
			var t = priv.getContent.apply($this);
			t = priv.insert(t, s.end, '__');
			t = priv.insert(t, s.start, '__');
			pub.setContent.apply($this, [t]);
			pub.setCursor.apply($this, [s.end+4]);
		},
		
		italic: function(){
			var $this = $(this);
			var s = priv.getSelection.apply($this);
			var t = priv.getContent.apply($this);
			t = priv.insert(t, s.end, '_');
			t = priv.insert(t, s.start, '_');
			pub.setContent.apply($this, [t]);
			pub.setCursor.apply($this, [s.end+2]);
		},

		quote: function(){
			var $this = $(this);
			var s = priv.getSelection.apply($this);
			var t = priv.getContent.apply($this);
			if(t.substr(s.start-1, 1).search(/\n/g) === 0){
				t = priv.insert(t, s.start, '> ');
			} else {
				t = priv.insert(t, s.start, '\n> ');
			}
			pub.setContent.apply($this, [t]);
			pub.setCursor.apply($this, [s.end+3]);
		},
		
		createPreview: function(){
			var $this = $(this),
				data = $this.data('markd');
			
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
				priv.deletePreview.apply($this);
			});
		},
		
		deletePreview: function(){
			var $this = $(this);
			//Remove and delete the preview
			pub.deletePreview.apply($this);
			//Unbind esc
			Mousetrap.unbind('esc');
		},
		
		togglePreview: function(){
			var $this = $(this),
				data = $this.data('markd');

			if(!data.is_fullscreen){
				if($this.data('markd').preview.el === undefined){
					priv.createPreview.apply($this);
				} else {
					priv.deletePreview.apply($this);
				}
			}
		},
		
		enterFullscreen: function(){
			var $this = $(this),
				data = $this.data('markd');

			//If the preview is open we need to close it first.
			if($this.data('markd').preview.el !== undefined){
				//FIXME
				pub.deletePreview.apply($this);
			}
			
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
				priv.exitFullscreen.apply($this);
			});
		},
		
		exitFullscreen: function(){
			var $this = $(this),
				data = $this.data('markd');
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
		},
		
		toggleFullscreen: function(){
			var $this = $(this),
				data = $this.data('markd');

			if(!data.is_fullscreen){
				priv.enterFullscreen.apply($this);
			} else {
				priv.exitFullscreen.apply($this);
			}
		},
		
		statistics: function(){
			var $this = $(this);
			var $text = $('<div>' + pub.getHtml.apply($this)[0] + '</div>');
			alert("Antall tegn: " + $text.text().length + "\nAntall ord: " + $text.text().split(" ").length + "\nAntall avsnitt: " + $text.find('>p').length );
		},

		pasteHtmlToMarkdown: function(){
			var $this = $(this);
			var clipboard = prompt('Lim inn html', '');
			clipboard = toMarkdown(clipboard);
			var s = priv.getSelection.apply($this);
			var t = priv.getContent.apply($this);
			if(s.start != s.end){
				t = t.slice(0, s.start) + clipboard + t.slice(s.end, t.length);
			} else {
				t = priv.insert(t, s.start, clipboard);
			}
			pub.setContent.apply($this, [t]);
			pub.setCursor.apply($this, [s.start + clipboard.length]);
		},
		
		pasteRemovFormating: function(){
			var $this = $(this);
			var clipboard = prompt('Lim inn', '');
			clipboard = clipboard.replace(/(<([^>]+)>)/ig,'');
			var s = priv.getSelection.apply($this);
			var t = priv.getContent.apply($this);
			if(s.start != s.end){
				t = t.slice(0, s.start) + clipboard + t.slice(s.end, t.length);
			} else {
				t = priv.insert(t, s.start, clipboard);
			}
			pub.setContent.apply($this, [t]);
			pub.setCursor.apply($this, [s.start + clipboard.length]);
		},

		focus: function(){
			var $this = $(this),
				data = $this.data('markd');
			
			if($('.markd-toolbar')){
				$('.markd-toolbar .action.bold').unbind('click').on('click', function(){
					priv.bold.apply($this);
					$('.markd-toolbar').hide();
				});
				$('.markd-toolbar .action.italic').unbind('click').on('click', function(){
					priv.italic.apply($this);
					$('.markd-toolbar').hide();
				});
				$('.markd-toolbar .action.quote').unbind('click').on('click', function(){
					priv.quote.apply($this);
					$('.markd-toolbar').hide();
				});
				$('.markd-toolbar .action.link').unbind('click').on('click', function(){
					priv.link.apply($this);
					$('.markd-toolbar').hide();
				});
			
				$(document).unbind('mouseup').on('mouseup', function(event){
					var selection = priv.getSelection.apply($this);
					if(selection.width){
						var xy = {
							top: ( event.pageY - 45 ),
							left: event.pageX - ( $('.markd-toolbar').width() / 2 )
						};
						$('.markd-toolbar').show().css(xy);
					} else {
						$('.markd-toolbar').hide();
					}
				});
			}
			
			if(data.autosave){
				$this.bind('keyup', function(){
					pub.save.apply($this);
				});
			}

			Mousetrap.bind('mod+shift+v', function(){
				priv.pasteRemovFormating.apply($this);
				return false;
			});
			
			Mousetrap.bind('mod+alt+v', function(){
				priv.pasteHtmlToMarkdown.apply($this);
				return false;
			});
			
			Mousetrap.bind(data.keyboardShortcuts.statistics, function(){
				priv.statistics.apply($this);
				return false;
			});
			
			Mousetrap.bind('tab', function(){
				priv.tab.apply($this);
				return false;
			});
			
			Mousetrap.bind(data.keyboardShortcuts.link, function(){
				priv.link.apply($this);
				return false;
			});
			
			Mousetrap.bind(data.keyboardShortcuts.code, function(){
				priv.code.apply($this);
				return false;
			});
			
			Mousetrap.bind(data.keyboardShortcuts.bold, function(){
				priv.bold.apply($this);
				return false;
			});
			
			Mousetrap.bind(data.keyboardShortcuts.italic, function(){
				priv.italic.apply($this);
				return false;
			});
			
			Mousetrap.bind(data.keyboardShortcuts.help, function(){
				window.open('http://daringfireball.net/projects/markdown/syntax', '_blank');
				return false;
			});
			
			Mousetrap.bind(data.keyboardShortcuts.preview, function(){
				priv.togglePreview.apply($this);
				return false;
			});
			
			Mousetrap.bind(data.keyboardShortcuts.fullscreen, function(){
				priv.toggleFullscreen.apply($this);
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
			Mousetrap.unbind(data.keyboardShortcuts.statistics);
			Mousetrap.unbind('mod+shift+v');
			Mousetrap.unbind('mod+alt+v');
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
			bold:		'mod+b',
			italic:		'mod+i',
			code:		'mod+k',
			link:		'mod+l',
			help:		'mod+h',
			preview:	'mod+p',
			fullscreen: 'mod+f',
			statistics: 'mod+alt+i'
		},
		parser: {
			compiler: window.marked,
			pedantic: false,
			sanitize: false
		}
	};
	
}(jQuery));
