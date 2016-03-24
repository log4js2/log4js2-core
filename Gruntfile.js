module.exports = function(grunt) {
	
	require("load-grunt-tasks")(grunt);
	
	grunt.initConfig({
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
	    uglify : {
	        options : {
	            mangle : true,
	            sourceMap : true,
	            sourceMapName : 'dist/log4js.min.map'
	        },
	        my_target : {
		        files : {
			        'dist/log4js.min.js' : [ 'dist/log4js.js' ]
		        }
	        }
	    },
	    webpack : {
	        options : {
	            context : __dirname,
	            output : {
	                path : 'dist/',
	                library : 'log4js',
	                libraryTarget : 'umd'
	            }
	        },
	        log4js : {
	            entry : './dist/cjs/logManager.js',
	            output : {
		            filename : 'log4js.js'
	            }
	        }
	    }
	});
	
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-webpack');
	
	grunt.registerTask('build', [ 'eslint', 'babel:cjs', 'webpack', 'uglify' ]);
	
};
