// Copyright © 2013 DB Medialab AS http://medialaben.no

(function($) {
	
	//!Public methods
	var pub = {
		//Init the editor. Takes options.
		init: function(options) {
			return this.each(function(){
				var $this = $(this);
				
				//The class 'mousetrap' is added so that we can listen for kbshortcuts inside a textarea
				//The class 'markd' is simply added so that we know that the editor is initialized and 
				//for styling purposes
				$this.addClass('markd mousetrap');
				
				//If the plugin hasn't been initialized yet save all our settings 
				if(!$this.data('markd')){
					$this.data('markd', $.extend({}, $.fn.markd.defaults, options) );
				}
				
				//If we are not using a textarea we need to remove all linebreaks or these will be counted twice.
				if(!$this.is('textarea')){
					var t = $this.html();
					pub.setContent.apply( $this, [t.replace(/(\r\n|\n|\r)/gm, '')] );
				}
				
				// !Bind keyboard commands when the editor recives focus.
				$this.bind('focus', function(event){
					priv.focus.apply($this);
				});
				
				// !Unbind keyboard commands and clean-up when the editor looses focus.
				$this.bind('blur', function(event){
					priv.blur.apply($this);
				});

				//Build the toolbar if needed. Note that for the moment it's 
				//only possible to have one toolbar per page. This is because all the 
				//editors share the same toolbar.
				//The toolbar can be customized using the data-markd-toolbar attribute 
				//like so: data-markd-toolbar="[b,i]"
				if( $('.markd-toolbar').length === 0 && $this.attr('data-markd-toolbar') !== undefined ){
					
					var toolbarStructure = [];
					if($this.attr('data-markd-toolbar').length){
						toolbarStructure = $this.attr('data-markd-toolbar').replace('[','').replace(']','').split(',');
					} else {
						toolbarStructure = $this.data('markd').toolbar;
					}
					
					var toolbarParts = {
						'b': '<li><a data-action="bold" class="action bold">B</a></li>',
						'i': '<li><a data-action="italic" class="action italic">I</a></li>',
						'q': '<li><a data-action="quote" class="action quote"><svg class="icon" viewBox="0 0 20 20"><path d="M4.773,1.076C3.779,1.621,2.921,2.308,2.207,3.138C1.489,3.967,0.936,4.928,0.541,6.016 C0.179,7.011,0,8.071,0,9.19c0,0.107,0.001,0.213,0.005,0.322v8.642h8.264V9.228H4.637c0.028-1.232,0.277-2.266,0.742-3.112 c0.48-0.874,1.376-1.549,2.74-2.017l0.15-0.051V0l-0.25,0.033C6.853,0.183,5.77,0.531,4.773,1.076z M19.851,4.099L20,4.047V0 l-0.252,0.033c-1.164,0.15-2.247,0.499-3.244,1.043c-0.995,0.545-1.853,1.232-2.567,2.062c-0.717,0.829-1.272,1.791-1.665,2.878 c-0.362,0.995-0.542,2.055-0.542,3.172c0,0.109,0.002,0.215,0.005,0.324v8.642H20V9.228h-3.633c0.026-1.232,0.277-2.266,0.742-3.112 C17.589,5.242,18.486,4.567,19.851,4.099z"/></svg></a></li>',
						'l': '<li><a data-action="link" class="action link"><svg class="icon" viewBox="0 0 20 20"><path d="M10.204,13.854c-1.288,0.001-2.579-0.503-3.551-1.477l0,0l-0.154-0.154l2.206-2.206l0.154,0.154 c0.38,0.379,0.859,0.562,1.345,0.563l0,0c0.508-0.001,0.994-0.185,1.373-0.563l0,0l3.615-3.616 c0.379-0.379,0.562-0.863,0.563-1.362l0,0c-0.002-0.494-0.185-0.977-0.562-1.356l0,0L15.04,3.683 c-0.38-0.378-0.863-0.562-1.359-0.563l0,0c-0.498,0.002-0.98,0.185-1.36,0.563l0,0l-1.486,1.487c-0.608,0.609-1.596,0.609-2.206,0 l0,0c-0.609-0.609-0.609-1.597,0-2.206l0,0l1.487-1.486c0.98-0.981,2.28-1.479,3.565-1.477l0,0 c1.284-0.002,2.584,0.496,3.564,1.477l0,0l0.154,0.153c0.979,0.979,1.478,2.277,1.477,3.562l0,0 c0.001,1.285-0.494,2.586-1.477,3.568l0,0l-3.617,3.616c-0.986,0.988-2.29,1.478-3.57,1.478l0,0 C10.209,13.854,10.207,13.854,10.204,13.854L10.204,13.854z"/><path d="M5.182,20c-1.288,0.001-2.579-0.503-3.551-1.477l0,0l-0.154-0.154C0.493,17.386-0.002,16.084,0,14.8l0,0 c-0.002-1.285,0.498-2.582,1.477-3.561l0,0l3.616-3.616c0.98-0.981,2.28-1.479,3.565-1.477l0,0 c1.007-0.001,2.023,0.304,2.888,0.909l0,0c0.144,0.073,0.277,0.169,0.396,0.289l0,0l0.279,0.28l0.154,0.153l0,0v0l-2.205,2.206l0,0 l-0.154-0.154c-0.38-0.378-0.862-0.561-1.359-0.563l0,0C8.16,9.268,7.678,9.451,7.299,9.829l0,0l-3.617,3.616 c-0.378,0.38-0.561,0.86-0.563,1.354l0,0c0.002,0.501,0.186,0.984,0.563,1.364l0,0l0.154,0.153c0.38,0.379,0.859,0.562,1.345,0.562 l0,0c0.509-0.002,0.994-0.185,1.373-0.562l0,0l1.558-1.558c0.609-0.609,1.597-0.609,2.206,0l0,0c0.609,0.609,0.609,1.596,0,2.205 l0,0L8.76,18.523C7.774,19.511,6.47,20,5.189,20l0,0C5.187,20,5.185,20,5.182,20L5.182,20z"/></svg></a></li>'
					};
					
					var toolbar = [];
					toolbar.push('<ul class="markd-toolbar">');
					$.each(toolbarStructure, function(index, value){
						toolbar.push( toolbarParts[value] );
					});
					toolbar.push('</ul>');
					toolbar = toolbar.join('');
					$('body').prepend(toolbar);
				}

			});
			
		},
		
		//Get the content from the editor
		getContent: function(){
			var content = [];
			this.each(function(){
				var $this = $(this);
				content.push( priv.getContent.apply( $this ) );	
			});
			return content;
		},

		//Update editors content 
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
		
		//Place the cursor at a certain position.
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

		//Return statistics about the text input
		stats: function(){
			return this.each(function(){
				priv.stats.apply($this);
			});
		}
	};
	
	//!Private methods
	var priv = {
		//Insert a tab 
		tab: function(){
			var $this = $(this);
			var s = priv.getSelection.apply($this);
			var t = priv.getContent.apply($this);
			t = priv.insert(t, s.end, '\t');
			pub.setContent.apply($this, [t]);
			pub.setCursor.apply($this, [s.end+1]);
		},
		
		//Insert link
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
		
		//Insert code
		code: function(){
			var $this = $(this);
			var s = priv.getSelection.apply($this);
			var t = priv.getContent.apply($this);
			t = priv.insert(t, s.end, '`');
			t = priv.insert(t, s.start, '`');
			pub.setContent.apply($this, [t]);
			pub.setCursor.apply($this, [s.end+2]);
		},
		
		//Insert bold
		bold: function(){
			var $this = $(this);
			var s = priv.getSelection.apply($this);
			var t = priv.getContent.apply($this);
			t = priv.insert(t, s.end, '__');
			t = priv.insert(t, s.start, '__');
			pub.setContent.apply($this, [t]);
			pub.setCursor.apply($this, [s.end+4]);
		},
		
		//Insert italic
		italic: function(){
			var $this = $(this);
			var s = priv.getSelection.apply($this);
			var t = priv.getContent.apply($this);
			t = priv.insert(t, s.end, '_');
			t = priv.insert(t, s.start, '_');
			pub.setContent.apply($this, [t]);
			pub.setCursor.apply($this, [s.end+2]);
		},
		
		//Insert quote
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

		//Return statistics about the text input
		stats: function(){
			var $this = $(this);
			var text = priv.getContent.apply($this);
			alert("Antall tegn: " + text.length + "\nAntall ord: " + text.split(" ").length + "\nAntall avsnitt: " + text.split("\n").length );
		},
		
		//Attach eventlisteners when the editor recives focus
		focus: function(){
			var $this = $(this),
				data = $this.data('markd');
			
			if( $('.markd-toolbar').length !== 0 && $this.attr('data-markd-toolbar') !== undefined ){
				var $toolbar = $('.markd-toolbar');
				
				//Bind methods to each button in the toolbar
				$toolbar.find('.action').each(function(index, element){
					$(element).unbind('click').on('click', function(){
						priv[$(element).attr('data-action')].apply($this);
						$toolbar.hide();
					});
				});
				
				//Bind the mouse-up event so that we can place the toolbar at the correct coordinates
				$(document).unbind('mouseup').on('mouseup', function(event){
					var selection = priv.getSelection.apply($this);
					if(selection.width){
						var xy = {
							top: ( event.pageY - 60 ),
							left: event.pageX - ( $toolbar.width() / 2 )
						};
						$toolbar.show().css(xy);
					} else {
						$toolbar.hide();
					}
				});
			}
			
			//Bind keybord commands
			for(var key in data.kbd){
				if(data.kbd.hasOwnProperty(key)){
					priv.bind.apply($this, [data.kbd[key], key]);
				}
			}
		},
	
		//Bind 'kbd' to method. This is only here because I'm awful at this.
		bind: function(kbd, method){
			var $this = $(this),
				data = $this.data('markd');

			Mousetrap.bind(kbd, function(){
				priv[method].apply($this);
				return false;
			});
		},
		
		//Unbind keyboard commands and clean-up when editor looses focus
		blur: function(){
			var $this = $(this),
				data = $this.data('markd');
			
			//Unbind mouse events used for the toolbar
			$(document).unbind('mouseup');
			
			//Unbind the keyboard commands
			Mousetrap.reset();
			
			//Hide the toolbar if the editor looses focus
			setTimeout(function(){
				$('.markd-toolbar').hide();
			}, 500);
		},
		
		//Returns a copy of 'string' where 'insert' is inserted at 'index'
		insert: function(string, index, insert){
			if (index > 0){
				return string.substring(0, index) + insert + string.substring(index, string.length);
			} else {
				return insert + string;
			}
		},
		
		//Get user input
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
		
		//Return the selection for a element. 
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
		kbd: {
			tab:		'tab',
			bold:		'mod+b',
			italic:		'mod+i',
			code:		'mod+k',
			link:		'mod+l',
			stats:		'mod+alt+i'
		},
		toolbar: ['b','i','q','l']
	};
	
}(jQuery));
