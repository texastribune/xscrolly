module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    concat:
      options:
        banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      basic:
        src: ['src/xscrolly.js']
        dest: 'dist/<%= pkg.name %>.js'
      jqueryPlugin:
        src: ['src/xscrolly.js', 'src/jquery-wrapper.js']
        dest: 'dist/jquery-<%= pkg.name %>.js'
    uglify:
      options:
        banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      dist:
        files:
          'dist/<%= pkg.name %>.min.js': ['<%= concat.basic.dest %>']
          'dist/jquery-<%= pkg.name %>.min.js': ['<%= concat.jqueryPlugin.dest %>']
    qunit:
      all: ['test/*.html']


  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-qunit'

  grunt.registerTask 'default', ['qunit', 'concat', 'uglify']
