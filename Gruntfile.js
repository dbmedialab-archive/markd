module.exports = function(grunt) {

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

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
						'vendors/jquery/jquery.min.js',
						'vendors/mousetrap/mousetrap.min.js',
						'vendors/jquerypp/jquerypp.custom.js',
						'jquery-markd.js'
					]
				}
			}
		}
	});
	
	// Default task(s).
	grunt.registerTask('default', [
		'jshint',
		'uglify'
	]);

};
