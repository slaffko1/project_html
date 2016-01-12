'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    jade = require('gulp-jade'),
    //rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    spritesmith = require('gulp.spritesmith'),
    rimraf = require('rimraf');
    //browserSync = require('browser-sync'),
    //reload = browserSync.reload;
    
    //autoprefixer.Promise = require('bluebird');

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        style: 'build/css/',
        images: 'build/images/',
        img: 'build/img/',
        sprite: 'src/images/'
    },
    src: {
        html: 'src/jade/*.jade',
        js: 'src/js/main.js',
        jsplugins: 'src/js/plugins.js',
        style: 'src/sass/style.sass',
        images: 'src/images/*.*',
        img: 'src/img/**/*.*',
        sprite: 'src/images/sprites/*.*'
    },
    watch: {
        html: 'src/jade/**/*.jade',
        js: 'src/js/**/*.js',
        style: 'src/sass/**/*.sass',
        images: 'src/images/*.*',
        img: 'src/img/**/*.*',
        sprite: 'src/images/sprites/*.*'
    },
    clean: './build'
};

//var config = {
//    server: {
//        baseDir: "./build"
//    },
//    tunnel: true,
//    host: 'localhost',
//    port: 9000,
//    logPrefix: "Frontend_Devil"
//};
//
//gulp.task('webserver', function () {
//    browserSync(config);
//});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html) 
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest(path.build.html))
        //.pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) 
        //.pipe(rigger()) 
        .pipe(sourcemaps.init()) 
        .pipe(uglify()) 
        //.pipe(sourcemaps.write()) 
        .pipe(gulp.dest(path.build.js))
        //.pipe(reload({stream: true}));
});
gulp.task('jsplugins:build', function () {
    gulp.src(path.src.jsplugins) 
        //.pipe(rigger()) 
        .pipe(sourcemaps.init()) 
        .pipe(uglify()) 
        //.pipe(sourcemaps.write()) 
        .pipe(gulp.dest(path.build.js))
        //.pipe(reload({stream: true}));
});

gulp.task('sprite:build', function () {
  gulp.src(path.src.sprite).pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.sass',
    padding: 2
  }))
  .pipe(gulp.dest(path.build.sprite));
});

gulp.task('image:build', function () {
    gulp.src(path.src.images) 
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.images))
        //.pipe(reload({stream: true}));
});

gulp.task('img:build', function() {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        //.pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) 
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['src/sass/'],
            outputStyle: 'compressed',
            sourceMap: false,
            errLogToConsole: true
        }).on('error', function(err) {
          if(err) console.log(''+err);
        }))
        .pipe(prefixer())
        .pipe(cssmin())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.style))
        //.pipe(reload({stream: true}));
});


gulp.task('build', [
    'html:build',
    'js:build',
    'jsplugins:build',
    'style:build',
    'sprite:build',
    'img:build',
    'image:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('jsplugins:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('sprite:build');
    });    
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('img:build');
    });
});


gulp.task('default', ['build', 'watch']);