'use strict';
module.exports = function (grunt) {
    var indexLess = ['resource/css/jks.less'];

	grunt.initConfig({
      pkg : grunt.file.readJSON('package.json'),
      less : {
          compile: {
              options: {
                  paths: ['resource/css/']
              },
              files: {
                  'resource/css/jks.css': indexLess
              }
          }
      },
      concat: {
            options: {
                separator: ' ',
                stripBanners: true
            },
            dist: {
                src: ['release/css/ks.css','resource/css/jks.css','resource/css/font.css'],

                dest: "resource/css/jks.css"
            }
      },
      cssmin : {
          minify: {
              expand: true,
              cwd: 'resource/css/',
              src: ['jks.css', '!*.min.css'],
              dest: 'resource/css/',
              ext: '.min.css'
          }
      },
      watch:{
          dev : {
              files : ['resource/css/*.less',
                        'resource/css/*.css'
                        ],
              tasks : ['less','concat','cssmin']
          }
      }
	});
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //grunt.loadNpmTasks('grunt-contrib-imagemin');
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('jks', ['concat']);
	grunt.registerTask('default', ['less','cancat','cssmin','watch']);
};