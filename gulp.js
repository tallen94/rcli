const gulp = require('gulp');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

const tsProj = ts.createProject('tsconfig.json');

gulp.task('scripts', function() {
    const tsRes = tsProj.src()
        .pipe(tsProj());

    return tsRes.js.pipe(gulp.dest('dist'));
});

gulp.task('watch', ['scripts'], function() {
    gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('assets', function() {
    return gulp.src(JSON_FILES)
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch', 'assets']);