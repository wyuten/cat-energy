const gulp = require('gulp');

// Styles
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssMinify = require('gulp-csso');

// Scripts
const babel = require('gulp-babel');
const jsUglify = require('gulp-uglify');

// Images
const imagemin = require('gulp-imagemin');
const svgStore = require('gulp-svgstore');

// Server
const server = require('browser-sync').create();

// Other
const plumber = require('gulp-plumber');
const flatten = require('gulp-flatten');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const replace = require('gulp-ext-replace');
const run = require('gulp4-run-sequence');


gulp.task('documents', () => {
	return gulp.src('*.html')
		.pipe(gulp.dest('build/'));
});

gulp.task('immutable-styles-prod', () => {
	return gulp.src('assets/styles/immutable/*.css')
		.pipe(cssMinify())
		.pipe(rename({suffix: ".min"}))
		.pipe(gulp.dest('build/assets/styles/'));
});

gulp.task('immutable-styles-dev', () => {
	return gulp.src('assets/styles/immutable/*.css')
		.pipe(gulp.dest('build/assets/styles/'));
});

gulp.task('styles-prod', () => {
	return gulp.src('assets/styles/pages/*.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(postcss([
			autoprefixer({
				overrideBrowserslist: ["cover 99.5%"]
			})
		]))
		.pipe(cssMinify())
		.pipe(rename({suffix: ".min"}))
		.pipe(flatten({includeParents: 0}))
		.pipe(gulp.dest('build/assets/styles'));
});

gulp.task('styles-dev', () => {
	return gulp.src('assets/styles/pages/*.scss')
		.pipe(sass())
		.pipe(flatten({includeParents: 0}))
		.pipe(gulp.dest('build/assets/styles'));
});

gulp.task('images-prod', () => {
	return gulp.src('assets/blocks/**/images/*.*')
		.pipe(imagemin([
			imagemin.mozjpeg({quality: 80, progressive: true}),
			imagemin.optipng({progressive: true})
		]))
		.pipe(flatten({includeParents: 0}))
		.pipe(gulp.dest('build/assets/images/'));
});

gulp.task('images-dev', () => {
	return gulp.src('assets/blocks/**/images/*.*')
		.pipe(flatten({includeParents: 0}))
		.pipe(gulp.dest('build/assets/images/'));
});

gulp.task('sprite', () => {
	return gulp.src('assets/blocks/**/images/*.svg')
	.pipe(svgStore({
		inline: true
	}))
	.pipe(rename({basename: "sprite"}))
	.pipe(gulp.dest('build/assets/svg'));
});

gulp.task('scripts-prod', () => {
	return gulp.src([
		'assets/blocks/**/*.js', 
		'!assets/blocks/**/*.min.js',
		'assets/scripts/**/*.js',
		'!assets/scripts/**/*.min.js',
	])
		.pipe(babel({
			presets: [[
					"@babel/env",
					{targets: ["cover 99.5%"]}
				]]
		}))
		.pipe(jsUglify())
		.pipe(rename({suffix: ".min"}))
		.pipe(gulp.dest('build/assets/scripts'));
});

gulp.task('scripts-dev', () => {
	return gulp.src([
		'assets/blocks/**/*.js', 
		'!assets/blocks/**/*.min.js',
		'assets/scripts/**/*.js',
		'!assets/scripts/**/*.min.js',
	])
		.pipe(gulp.dest('build/assets/scripts'));
});

gulp.task('completed-scripts', () => {
	return gulp.src(['assets/blocks/**/*.min.js', 'assets/scripts/**/*.min.js'])
		.pipe(gulp.dest('build/assets/scripts'));
});

gulp.task('fonts', () => {
	return gulp.src('assets/fonts/*.*')
		.pipe(gulp.dest('build/assets/fonts/'));
});

gulp.task('build-clean', () => {
	return gulp.src('build/*', {read: false})
		.pipe(clean());
});

gulp.task('reload', (done) => {
	server.reload();
	done();
});

gulp.task('dev-build', (done) => {
	run('build-clean', [
		'documents', 
		'immutable-styles-dev',
		'styles-dev', 
		'images-dev', 
		'sprite', 
		'completed-scripts', 
		'scripts-dev', 
		'fonts'
	], done);
});

gulp.task('dev-serve', () => {
	server.init({
		server: 'build/',
		notify: false,
		open: true,
		cors: true,
		ui: false,
	});

	gulp.watch('*.html')
		.on('change', gulp.series('documents', 'reload'));
	
	gulp.watch('assets/**/*.scss')
		.on('change', gulp.series('styles-dev', 'reload'));
		
	gulp.watch('assets/**/*.js')
		.on('change', gulp.series('completed-scripts', 'scripts-dev', 'reload'));

	gulp.watch('assets/**/images/*.*')
		.on('all', gulp.series('images-dev', 'reload'));
		
	gulp.watch('assets/**/images/*.svg')
		.on('all', gulp.series('sprite', 'reload'));
});

gulp.task('prod-build', (done) => {
	run('build-clean', [
		'documents', 
		'immutable-styles-prod',
		'styles-prod', 
		'images-prod',
		'sprite', 
		'completed-scripts', 
		'scripts-prod',  
		'fonts',
	],done);
});

gulp.task('prod-serve', () => {
	server.init({
		server: 'build/',
		notify: false,
		open: true,
		cors: true,
		ui: false,
	});

	gulp.watch('*.html')
		.on('change', gulp.series('documents', 'reload'));
	
	gulp.watch('assets/**/*.scss')
		.on('change', gulp.series('styles-prod', 'reload'));
		
	gulp.watch('assets/**/*.js')
		.on('change', gulp.series('completed-scripts', 'scripts-prod', 'reload'));

	gulp.watch('assets/**/images/*.*')
		.on('all', gulp.series('images-prod', 'reload'));
		
	gulp.watch('assets/**/images/*.svg')
		.on('all', gulp.series('sprite', 'reload'));
});