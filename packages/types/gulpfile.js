const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');

// Config
const tsProject = ts.createProject('tsconfig.json', {
  isolatedModules: false,
  noEmit: false,
  emitDeclarationOnly: true
});

// Tasks
const cjs = () => gulp.src('src/**/*.ts')
  .pipe(babel({ envName: 'cjs' }))
  .pipe(gulp.dest('dist/cjs'));

const esm = () => gulp.src('src/**/*.ts')
  .pipe(babel({ envName: 'esm' }))
  .pipe(gulp.dest('dist/esm'));

const typings = () => gulp.src('src/**/*.ts')
  .pipe(tsProject()).dts
  .pipe(gulp.dest('dist/types'));

gulp.task('build', gulp.parallel(cjs, esm, typings));