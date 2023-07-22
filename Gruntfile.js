module.exports = function (grunt) {
  grunt.initConfig({
    concat: {
      dist: {
        src: ['./header.js', './downloadHelper.js', './storageHelper.js', './dbHelper.js', './main.js'],
        dest: 'WME-URMP.user.js'
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-concat')

  grunt.registerTask('default', ['concat'])
}
