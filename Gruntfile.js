module.exports = function(grunt) {
	
	require("load-grunt-tasks")(grunt);
	
	grunt.initConfig({
	    pkg : grunt.file.readJSON('package.json'),
	    eslint : {
	        options : {},
	        files : [ 'src/*/**.js' ]
	    },
	    babel : {
	        options : {
	            sourceMaps : 'inline',
	            loose : [ 'es6.modules' ],
	            auxiliaryCommentBefore : 'istanbul ignore next',
	            blacklist : [ "useStrict" ]
	        },
	        cjs : {
		        files : [ {
		            "expand" : true,
		            "cwd" : "src/",
		            "src" : '**/*.js',
		            "dest" : "dist/cjs",
		            "ext" : ".js"
		        } ]
	        }
	    },
	    mochaTest : {
		    test : {
		        options : {
		            reporter : 'spec',
		            quiet : false,
		            clearRequireCache : false
		        },
		        src : [ 'test/**/*.js' ]
		    }
	    },
	    uglify : {
	        options : {
	            banner : '/*! <%= pkg.name %> - v<%= pkg.version %> <<%= pkg.repository.url %>>\n'
	                + '* Copyright 2016 <%= pkg.author.name %> <http://cunae.com>\n'
	                + '* Released under the MIT License\n'
	                + '*/',
	            mangle : true,
	            preserveComments : 'some',
	            sourceMap : true
	        },
	        my_target : {
		        files : {
			        'dist/<%= pkg.name %>.min.js' : [ 'dist/<%= pkg.name %>.js' ]
		        }
	        }
	    },
	    webpack : {
	        options : {
	            context : __dirname,
	            output : {
	                path : 'dist/',
	                library : '<%= pkg.name %>',
	                libraryTarget : 'umd'
	            }
	        },
	        log4js : {
	            entry : './dist/cjs/logManager.js',
	            output : {
		            filename : '<%= pkg.name %>.js'
	            }
	        }
	    }
	});
	
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-webpack');
	
	grunt.registerTask('build', [ 'eslint', 'babel:cjs', 'webpack', 'uglify', 'mochaTest' ]);
	
};
