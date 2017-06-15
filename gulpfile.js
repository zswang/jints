/*jshint globalstrict: true*/
/*global require*/

'use strict'

const gulp = require('gulp')
const typescript = require('gulp-typescript')
const jdists = require('gulp-jdists')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const examplejs = require('gulp-examplejs')

gulp.task('build', function (done) {
  gulp.src('./src/ts/*.ts')
    .pipe(typescript({
      target: 'ES5'
    }))
    .pipe(gulp.dest('./src/js'))
    .on('end', done)
})

gulp.task('jdists', ['build'], function () {
  gulp.src('./src/jints.jdists.js')
    .pipe(jdists())
    .pipe(rename('jints.js'))
    .pipe(gulp.dest('./'))
})

gulp.task('uglify', function () {
  gulp.src('jints.js')
    .pipe(uglify())
    .pipe(rename('jints.min.js'))
    .pipe(gulp.dest('./'))
})

gulp.task('example', function() {
  return gulp.src([
      'src/ts/*.ts'
    ])
    .pipe(examplejs({
      header: `
global.jints = require('../jints.js');
      `
    }))
    .pipe(rename({
      extname: '.js'
    }))
    .pipe(gulp.dest('test'))
})

gulp.task('dist', ['jdists', 'uglify'])