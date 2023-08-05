module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dev: {
        src: ['./src/header.js', './src/downloadHelper.js', './src/storageHelper.js', './src/icons.js', './src/dbHelper.js', './src/main.js'],
        dest: 'dist/<%= pkg.main %>-beta.user.js'
      },
      build: {
        src: ['./src/header.js', './src/downloadHelper.js', './src/storageHelper.js', './src/icons.js', './src/dbHelper.js', './src/main.js'],
        dest: 'dist/<%= pkg.main %>.user.js'
      }
    },
    'string-replace': {
      dev: {
        files: {
          'dist/<%= pkg.main %>-beta.user.js': 'dist/<%= pkg.main %>-beta.user.js'
        },
        options: {
          replacements: [{
            pattern: /{{ VERSION }}/g,
            replacement: '<%= pkg.version %>'
          },
          {
            pattern: /{{ BASE_URI }}/g,
            replacement: 'beta'
          },
          {
            pattern: /{{ RELEASE }}/g,
            replacement: ' Beta'
          }]
        }
      },
      build: {
        files: {
          'dist/<%= pkg.main %>.user.js': 'dist/<%= pkg.main %>.user.js'
        },
        options: {
          replacements: [{
            pattern: /{{ VERSION }}/g,
            replacement: '<%= pkg.version %>'
          },
          {
            pattern: /{{ BASE_URI }}/g,
            replacement: 'www'
          },
          {
            pattern: /{{ RELEASE }}/g,
            replacement: ''
          }]
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-string-replace')

  grunt.registerTask('default', ['concat:build', 'string-replace:build'])
  grunt.registerTask('beta', ['concat:dev', 'string-replace:dev'])
}
