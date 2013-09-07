module.exports = function(grunt){
  
  //Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsdoc : {
        dist : {
            src: ['js/*.js'], 
            options: {
                destination: 'doc'
            }
        }
    },
    jshint:{
      options: {
        smarttabs: true
      },
      beforeconcat: ['js/canvas.js','js/cookies.js','js/oauth.js','js/xd.js','js/client.js'],
      afterconcat: ['build/canvas-all.js']
    },
    uglify:{
      options:{
        banner: 'my banner'
      },
      build: {
        src: 'js/canvas-all.js',
        dest: 'build/canvas-all-min.js'
      }
    },
    concat: {
      dist: {
        options: {
          // Replace all 'use strict' statements in the code with a single one at the top
         banner: "'use strict';\n",
         process: function(src, filepath) {
          return '// Source: ' + filepath + '\n' +
            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        },
      },
        files: {
         'build/canvas-all.js': ['js/canvas.js','js/cookies.js','js/oauth.js','js/xd.js','js/client.js'],
       },
    },
  },
  });

  //Load the plugin
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');
  //Default task(s)
  grunt.registerTask('default',['uglify']);

};
