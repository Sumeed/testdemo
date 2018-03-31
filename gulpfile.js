var gulp  		   = require('gulp'),
    sass  		   = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync').create(),
    useref 		   = require ('gulp-useref'),
    uglify 		   = require ('gulp-uglify'),
    gulpIf 		   = require ('gulp-if'),
    cssnano 	   = require ('gulp-cssnano'),
    imagemin	   = require ('gulp-imagemin'),
    del          = require ('del'),
    runSequence  = require ('run-sequence'),
    jshint       = require ('gulp-jshint'),
    stylish      = require ('jshint-stylish'),
    stylus       = require ('gulp-stylus');


function errorlog(error){
  console.error.bind(error);
  this.emit('end');
}


//SASS 
gulp.task('sass',function(){

	return gulp.src('app/scss/*.scss')
  .pipe(sass())
  .on('error', errorlog)
  .pipe(sourcemaps.write())
  .pipe(autoprefixer())
	.pipe(gulp.dest('app/css/'))
	.pipe(browserSync.reload({
      stream: true
    }))
});

//Stylus
gulp.task('stylus', function(){

  return gulp.src('app/stylus/*.styl')
  .pipe(stylus())
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

//jshint
gulp.task('jshint', function(){
  return gulp.src('app/js/main.js')
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));
});



//useref JS and CSS
gulp.task ('useref', function(){
  return gulp.src('app/*.html')
  .pipe(useref())

  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulpIf('*.css', cssnano()))
  .pipe(gulp.dest('dist'))
});


//IMG min
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(imagemin({
      // Setting interlaced to true
      interlaced: true
    }))
  .pipe(gulp.dest('dist/images'))
});

//Fonts
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

//BrowserSync
gulp.task('watch',['browserSync'],function(){
	gulp.watch('app/scss/**/*.scss', ['sass']);
  //gulp.watch('app/stylus/**/*.styl', ['stylus']); 
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

//Clean:dist
gulp.task('clean:dist', function(){
      return del.sync('dist');
});


//Build


gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'fonts',  'useref', 'images'],
    callback
  )
});