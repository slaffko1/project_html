'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    jade = require('gulp-jade'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    spritesmith = require('gulp.spritesmith');

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
        js: 'src/js/**/*.*',
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



gulp.task('html:build', function () {
    gulp.src(path.src.html) 
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest(path.build.html));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) 
        .pipe(sourcemaps.init())
        .pipe(uglify()) 
        .pipe(gulp.dest(path.build.js));
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
        .pipe(gulp.dest(path.build.images));
});

gulp.task('img:build', function() {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img));
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
        .pipe(gulp.dest(path.build.style));
});


gulp.task('build', [
    'html:build',
    'js:build',
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
    watch([path.watch.img], function(event, cb) {
        gulp.start('sprite:build');
    });
});


gulp.task('default', ['build', 'watch']);