module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			options: {
				separator: '\n',
				banner: '(function(){\n',
				footer: '\n})();'
			},
			dist: {
				src: ["src/utils/polyfill.js", "src/utils/utils.js", "src/luke.js", "src/**.js"],
				dest: "build/luke.js"
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['concat']);
};