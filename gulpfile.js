var gulp = require('gulp'),
	scss = require('gulp-sass'),
	autoprefix = require('gulp-autoprefixer');

// sass -> concat -> autoprefix
gulp.task('styles', function() {
	gulp.src('app/scss/app.scss')
		.pipe(scss({
			outputStyle: 'compressed'
			}))
		.pipe(autoprefix('last 2 versions'))
		.pipe(gulp.dest('app/css'));
})

// task: watch
gulp.task('watch', function() {
	gulp.watch('app/scss/**/*.scss');
});

gulp.task('default', ['styles', 'watch']);
