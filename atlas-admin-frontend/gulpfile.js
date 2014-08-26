var gulp = require('gulp'),
	scss = require('gulp-sass'),
	autoprefix = require('gulp-autoprefixer');

// sass -> concat -> autoprefix
gulp.task('styles', function() {
	gulp.src('scss/app.scss')
		.pipe(scss({
			outputStyle: 'compressed'
			}))
		.pipe(autoprefix('last 2 versions'))
		.pipe(gulp.dest('css'));
})

// task: watch
gulp.task('watch', function() {
	gulp.watch('scss/**/*.scss', ['styles']);
});

gulp.task('default', ['styles', 'watch']);
