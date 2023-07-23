module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['./src/header.js', './src/downloadHelper.js', './src/storageHelper.js', './src/icons.js', './src/dbHelper.js', './src/main.js'],
        dest: 'dist/<%= pkg.main %>'
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-concat')

  grunt.registerTask('default', ['concat'])
}
