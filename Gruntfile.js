var which;
module.exports = function(grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    manifest: grunt.file.readJSON('Mobile/manifest.webapp'),
    uglify: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'Shared/js/',
            src: '**',
            dest: 'build/mobile/js/',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'Shared/js',
            src: '**',
            dest: 'build/web/js',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'Shared/js',
            src: '**',
            dest: 'build/android/js',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'Mobile/js/',
            src: '*',
            dest: 'build/mobile/js',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'Android/js/',
            src: '*',
            dest: 'build/android/js',
            filter: 'isFile'
          },
          {
            expand: true,
            cwd: 'Web/js/',
            src: '*',
            dest: 'build/web/js',
            filter: 'isFile'
          }
        ]
      }
    },
    less: {
      production: {
        files: {
          'build/mobile/css/main.css': 'Shared/css/main.less',
          'build/android/css/main.css': 'Shared/css/main.less',
          'build/web/css/main.css': 'Shared/css/main.less'
        },
        compress: true
      }
    },
    copy: {
      'main files': {
        files: [
          {
            expand: true,
            cwd: 'Shared',
            src: 'img/**',
            dest: 'build/mobile'
          },
          {
            expand: true,
            cwd: 'Shared',
            src: 'img/**',
            dest: 'build/web'
          },
          {
            expand: true,
            cwd: 'Mobile',
            src: ['index.html', 'manifest.webapp'],
            dest: 'build/mobile'
          },
          {
            expand: true,
            cwd: 'Android',
            src: ['index.html', 'config.xml', 'AndroidManifest.xml', 'res/**', 'icon.png'],
            dest: 'build/android'
          },
          {
            expand: true,
            cwd: 'Web',
            src: ['index.html', 'manifest.webapp', 'cache.appcache'],
            dest: 'build/web'
          }
        ]
      },
      'css assets': {
        files: [
          {
            expand: true,
            cwd: 'Shared/css',
            src: '*/**',
            dest: 'build/mobile/css'
          },
          {
            expand: true,
            cwd: 'Shared/css',
            src: '*/**',
            dest: 'build/android/css'
          },
          {
            expand: true,
            cwd: 'Shared/css',
            src: '*/**',
            dest: 'build/web/css'
          }
        ]
      }
    },

    zip: {
      mobile: {
        router: function(path) {
          return /build\/mobile\/(.*)/.exec(path)[1];
        },
        src: 'build/mobile/**',
        dest: 'sketchy-mobile-<%= manifest.version %>.zip'
      },
      web: {
        router: function(path) {
          return /build\/web\/(.*)/.exec(path)[1];
        },
        src: 'build/web/**',
        dest: 'sketchy-web-<%= manifest.version %>.zip'
      }
    },

    watch: {
      js: {
        files: ['Shared/js/**', 'Mobile/js/**', 'Web/js/**'],
        tasks: 'uglify',
        options: {
          spawn: false
        }
      },
      less: {
        files: 'Shared/css/**',
        tasks: 'less',
        options: {
          spawn: false
        }
      },
      copy: {
        files: ['Shared/img/**', 'Mobile/index.html', 'Mobile/manifest.webapp', 'Web/index.html', 'Web/manifest.webapp', 'Web/cache.appcache'],
        tasks: 'copy',
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-zip');
  grunt.registerTask('default', ['uglify','copy', 'less', 'zip'])

}
