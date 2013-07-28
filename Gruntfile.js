module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: ['Gruntfile.js', 'jquery-markd.js']
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				mangle: false,
				sourceMap: '<%= pkg.name %>.sourcemap.js'
			},
			build: {
				files: {
					'<%= pkg.name %>.min.js': [
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
