var gulp = require('gulp');

//include plugins
var jshint = require('gulp-jshint'),
    jsstylish = require('jshint-stylish'),
    changed = require('gulp-changed'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    cssMinify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    uncss = require('gulp-uncss'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    vendor = require('gulp-concat-vendor'),
    browsersync = require('browser-sync'),
    reload = browsersync.reload;

//custom path url
var SRC = './application/assets/',
    BOWER = './bower_components/'
    DEST = 'production';

// CSS stuff
gulp.task('sass', function(){
    gulp.src([SRC + 'scss/**/*.scss'])
        .pipe(sass({
            includePaths: [BOWER + 'foundation-sites/assets']
        }))
        .on('error', notify.onError(function(error) {
            return "Gulp Error: " + error.message;
        }))
        .pipe(gulp.dest(SRC + 'css/dev-css'))
});

gulp.task('cssMinify', function() {
    return gulp.src(SRC + 'css/dev-css/*')
        .pipe(concat('main.min.css'))
        .pipe(cssMinify({
            keepSepecialComments: 1
        }))
        .pipe(gulp.dest(SRC + 'css'))
});

gulp.task('uncss', function () {
    return gulp.src(SRC + 'css/main.min.css')
        .pipe(concat('main.min.css'))
        .pipe(uncss({
            html: ['./application/**/*.html'],
            ignore: 
                // for bootstrap - uncomment if you wil use
                // [
                //     /\.open/,
                //      /(#|\.)fancybox(\-[a-zA-Z]+)?/,
                //     /(#|\.)active(\-[a-zA-Z]+)?/,
                //     /(#|\.)modal(\-[a-zA-Z]+)?/,
                //     // Bootstrap selectors added via JS
                //     /\w\.in/,
                //     ".fade",
                //     ".collapse",
                //     ".collapsing",
                //     /(#|\.)navbar(\-[a-zA-Z]+)?/,
                //     /(#|\.)dropdown(\-[a-zA-Z]+)?/,
                //     /(#|\.)(open)/,
                //     /^\.scroll(\-)?/,
                //     /^\.scrollbar(\-)?/,
                //    // currently only in a IE conditional, so uncss doesn't see it
                //     ".close",
                //     ".alert-dismissible"
                // ]
                // for foundation
                [
                    new RegExp ('.foundation-mq'),
                    new RegExp('^meta\..*'),
                    new RegExp ('^\.is-.*')
                ]
        }))
        .pipe(cssMinify({
            keepSepecialComments: 1
        }))
        .pipe(gulp.dest(DEST + '/assets/css/'));
});

// JS stuff
gulp.task('jscompress', function() {
  return gulp.src(SRC + 'js/dev-js/*.js')
    .pipe(concat('main.min.js')) //the name of the resulting file
    .pipe(uglify())
    .pipe(gulp.dest(SRC + 'js'))
});

gulp.task('vendorScripts', function() {
  return gulp.src([
    'bower_components/jquery/dist/*.min.js',
    'bower_components/what-input/what-input.js',
    'bower_components/foundation-sites/dist/plugins/foundation.core.js',
    'bower_components/foundation-sites/dist/plugins/foundation.util.*.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.abide.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.accordion.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.accordionMenu.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.drilldown.js',
    'bower_components/foundation-sites/dist/plugins/foundation.dropdown.js',
    'bower_components/foundation-sites/dist/plugins/foundation.dropdownMenu.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.equalizer.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.interchange.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.magellan.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.offcanvas.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.orbit.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.responsiveMenu.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.responsiveToggle.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.reveal.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.slider.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.sticky.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.tabs.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.toggler.js',
    // 'bower_components/foundation-sites/dist/plugins/foundation.tooltip.js'
    ])
  .pipe(vendor('vendor.js'))
  .pipe(gulp.dest('./application/assets/js/vendors-js/'))
  .pipe(concat('vendor.min.js')) //the name of the resulting file
    .pipe(uglify())
    .pipe(gulp.dest(SRC + 'js'));
});

gulp.task('jshint', function() {
    gulp.src(SRC + 'js/dev-js/main.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        // Use gulp-notify as jshint reporter
        .pipe(notify(function (file) {
          if (file.jshint.success) {
            // Don't show something if success
            return false;
          }

          var errors = file.jshint.results.map(function (data) {
            if (data.error) {
              return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
            }
          }).join("\n");
          return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
        }));
});

gulp.task('imagemin', function() {
    return gulp.src(SRC + 'img/**/*')
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 5
        }))
        .pipe(gulp.dest(DEST + '/assets/img/'));
});

gulp.task('watch', ['sass', 'cssMinify', 'jscompress'], function() {
    gulp.watch([SRC + 'img/**/*'], reload);
    gulp.watch(SRC + "js/**/*.js", ['jshint', 'jscompress', reload]);
    gulp.watch(SRC + "scss/**/*.scss", ['sass', 'cssMinify', reload]);
    gulp.watch(SRC + "css/*.*", ['cssMinify', reload]);
    gulp.watch(SRC + "vendors/**/*.js", ['vendorScripts', reload]);
    gulp.watch(['./application/**/*.html'], reload);
    gulp.watch(['./application/**/*.php'], reload);
    gulp.watch(['./application/*'], reload);
});


// gulp  task
gulp.task('serve', ['watch'], function() {
    browsersync.init({
        server: "./application/"
    });
    return gulp.on('error', notify.onError(function(error) {
            return "Gulp Error: " + error.message;
        }))
});

gulp.task('copy', function() {
    return gulp.src([
            'application/**',
            '!application/assets/css/{dev-css,dev-css/**}',
            '!application/assets/js/{dev-js,dev-js/**}',
            '!application/assets/js/{vendors-js,vendors-js/**}',
            '!application/assets/{scss,scss/**}',
            '!application/assets/{img,img/**}',
        ], {
            dot: true
        })
        .on('error', notify.onError(function(error) {
            return "Gulp Error: " + error.message;
        }))
        .pipe(gulp.dest('production'))

});

gulp.task('default', ['serve', 'vendorScripts', 'jscompress', 'jshint']);

gulp.task('prod', ['copy', 'imagemin', 'uncss']);