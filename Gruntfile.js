module.exports = function(grunt) {
    /*
    Estructura para que sirva este grunt:
    - root del proyecto
        - assets
            - root
                -> aqui van todos los archivos y carpetas que van en el root de app como images, partials y el index.html
            - styles
                -> todos los estilos como quieras poneros en subcarpetas (como te acomodes mejor)
            - scripts
                -> lo mismo pero con los js
        - app
            -> esta carpeta se autocompila hay que ignorarla en git
        Gruntfile.js
    */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: { // si usas sass aqui pon tus estilos
            required: {
                options: {
                    sourceMap: true
                },
                files: {
                    //'app/css/required.css': ['assets/bower_components/bootstrap-sass-official/vendor/assets/stylesheets/bootstrap.scss'],
                    'app/css/required.css': [
                        'assets/bower_components/angular-material/angular-material.scss'
                    ]
                }
            },
            styles: {
                options: {
                    sourceMap: false
                },
                files: {
                    'app/css/styles.css': ['assets/styles/main.scss'],
                    'app/css/pretty.css': ['assets/styles/pretty.scss']
                }
            }
        },
        concat: {
            required: {
                files: {
                    // Required Dependencies <- aqui pones las que necesites de bower
                    'app/js/required.js': [
                        'assets/bower_components/jquery/dist/jquery.js',
                        'assets/bower_components/firebase/firebase.js',
                        'assets/bower_components/moment/min/moment.min.js',
                        'assets/bower_components/moment/locale/es.js',
                        'assets/bower_components/angular/angular.js',
                        'assets/bower_components/ngmap/build/scripts/ng-map.min.js',
                        'assets/bower_components/angular-moment/angular-moment.js',
                        'assets/bower_components/angular-sanitize/angular-sanitize.js',
                        'assets/bower_components/angular-animate/angular-animate.js',
                        'assets/bower_components/angular-ui-router/release/angular-ui-router.js',
                        'assets/bower_components/angularfire/dist/angularfire.js',
                        'assets/bower_components/angular-aria/angular-aria.js',
                        'assets/bower_components/angular-material/angular-material.js',
                        'assets/bower_components/angular-easyfb/src/angular-easyfb.js',
                        'assets/bower_components/lf-ng-md-file-input/dist/lf-ng-md-file-input.js',
                        'assets/bower_components/angular-slugify/angular-slugify.js',
                        'assets/bower_components/angular-messages/angular-messages.js',
                        'assets/bower_components/angular-material-data-table/dist/md-data-table.js',
                        'assets/bower_components/ngstorage/ngStorage.js',
                        'assets/bower_components/textAngular/dist/textAngular-rangy.min.js',
                        'assets/bower_components/textAngular/dist/textAngular-sanitize.js',
                        'assets/bower_components/textAngular/dist/textAngularSetup.js',
                        'assets/bower_components/textAngular/dist/textAngular.js'
                    ]
                }
            },
            js: {
                files: {
                    // Ensamble Main App <- aqui va toda la carpeta de assets/js
                    'app/js/app.js': [
                        'assets/scripts/**/*.js'
                    ]
                }
            }
        },
        cssmin: { // este se usa para minificar lo que se concateno arriba
            css: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1
                },
                files: [{
                    'app/css/styles.min.css': ['app/css/styles.css'],
                    'app/css/pretty.min.css': ['app/css/pretty.css']
                }]
            },
            required: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1
                },
                files: [{
                    'app/css/required.min.css': [
                        'app/css/required.css',
                        'assets/bower_components/lf-ng-md-file-input/dist/lf-ng-md-file-input.css',
                        'assets/bower_components/angular-material-paging/src/angular-material-paging.css',
                        'assets/bower_components/angular-material-data-table/dist/md-data-table.css',
                        'assets/bower_components/textAngular/dist/textAngular.css'
                    ]
                }]
            }
        },
        uglify: { // no toques esta a menos que necesites
            js: {
                options: {
                    preserveComments: false,
                    mangle: false,
                    compress: { // commonly used to remove debug code blocks for production
                        global_defs: {
                            "DEBUG": false
                        },
                        dead_code: false
                    }
                },
                files: {
                    'app/js/app.min.js': ['app/js/app.js']
                }
            },
            required: {
                options: {
                    preserveComments: false,
                    mangle: false,
                    compress: { // commonly used to remove debug code blocks for production
                        global_defs: {
                            "DEBUG": false
                        },
                        dead_code: false
                    }
                },
                files: {
                    'app/js/required.min.js': ['app/js/required.js']
                }
            }
        },
        copy: { // copia los archivos de assets/root al root de app, asi como las
            build: {
                /*options: {
                    process: function (content, srcpath) {
                        return content.replace(/[sad ]/g, '_');
                    },
                },*/
                files: [{
                        expand: true,
                        cwd: 'assets/root/',
                        src: '**',
                        dest: 'app/'
                    } //isFile: true
                ]
            }
        },
        watch: {
            sass: { // solo activa sass si tienes
                files: ['assets/styles/**/*.scss'],
                tasks: ['sass:styles', 'cssmin:css']
            },
            bower: { // this is only if developer is git active :)
                files: ['assets/bower_components/**/*.js'],
                tasks: ['concat:required', 'uglify:required']
            },
            js: {
                files: ['assets/scripts/**/*.js'],
                tasks: ['concat:js', 'uglify:js']
            },
            html: {
                files: ['assets/root/**/*.*'],
                tasks: ['copy']
            }
        },
        'http-server': {
            build: {
                // the server root directory
                root: 'app/',
                port: 9999,

                // the host ip address
                // If specified to, for example, "127.0.0.1" the server will
                // only be available on that ip.
                // Specify "0.0.0.0" to be available everywhere
                host: "0.0.0.0",
                //host: "0.0.0.1",
                showDir: false,
                autoIndex: true,

                // server default file extension
                ext: "html",

                // run in parallel with other tasks
                runInBackground: false,

                // specify a logger function. By default the requests are
                // sent to stdout.
                logFn: function(req, res, error) {},

                // Proxies all requests which can't be resolved locally to the given url
                // Note this this will disable 'showDir'
                //proxy: "http://afich.dev",

                /// Use 'https: true' for default module SSL configuration
                /// (default state is disabled)
                /*https: {
                    cert: "cert.pem",
                    key : "key.pem"
                },*/

                // Tell grunt task to open the browser
                openBrowser: true,

                // customize url to serve specific pages
                /*customPages: {
                    "/readme": "README.md",
                    "/readme.html": "README.html"
                }*/

            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-http-server');

    grunt.registerTask('serve', ['http-server']);

    // se registra una combinación de funciones
    //grunt.registerTask('both', ['speak','yell'])
    // si la llamas default se corre al llamar grunt
    // aqui es donde se ejecutan la configuracion de arriba
    grunt.registerTask('default', ['sass', 'concat', 'cssmin', 'uglify', 'copy', 'watch']); // 'http-server',
}
