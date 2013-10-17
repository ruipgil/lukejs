module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			options: {
				separator: '\n',
				banner: '(function(){\n',
				footer: '\n})();'
			},
			dist: {
				src: [
					"utils/polyfill",
					"luke",
					"utils/utils",
					"Buffer",
					"Composite",
					"IClass",
					"InstClass",
					"IFunction",
					"AnonymousFunction",
					"Function",
					"IConstructor",
					"Property",
					"ClassProperty",
					"Method",
					"Constructor",
					"OptionalConstructor",
					"Getter",
					"Setter"
				].map(function(file){
					return "src/"+file+".js";
				}),
				dest: "build/luke.js"
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['concat']);
};