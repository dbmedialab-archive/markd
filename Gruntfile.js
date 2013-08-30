module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: ['Gruntfile.js', 'jquery-markd.js']
		},
		uglify: {
			plugin: {
				options: {
					banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
					mangle: false,
					sourceMap: '<%= pkg.name %>.sourcemap.js'
				},
				files: {
					'<%= pkg.name %>.min.js': [ 
						'jquery-markd.js'
					]
				}
			},
			editor: {
				options: {
					banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				},
				files: {
					'editor.js': [
						'vendors/jquery/jquery.10.2.min.js',
						'vendors/marked/lib/marked.js',
						'vendors/mousetrap/mousetrap.js',
						'vendors/jquerypp/jquerypp.custom.js',
						'vendors/to-markdown/to-markdown.js',
						'jquery-markd.js'
					]
				}
			}
		}
	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', [
		'jshint',
		'uglify'
	]);

};
