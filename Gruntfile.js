module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['./src/header.js', './src/downloadHelper.js', './src/storageHelper.js', './src/icons.js', './src/dbHelper.js', './src/main.js'],
        dest: 'dist/<%= pkg.main %>'
      }
    },
    'string-replace': {
      source: {
        files: {
          'dist/<%= pkg.main %>': 'dist/<%= pkg.main %>'
        },
        options: {
          replacements: [{
            pattern: /{{ VERSION }}/g,
            replacement: '<%= pkg.version %>'
          }]
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-string-replace')

  grunt.registerTask('default', ['concat', 'string-replace'])
}
