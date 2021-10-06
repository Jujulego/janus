const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');

// Config
const paths = {
  src: 'src/**/*.ts',
  assets: 'src/config.schema.json',
};

const tsProject = ts.createProject('tsconfig.json', {
  isolatedModules: false,
  noEmit: false,
  emitDeclarationOnly: true
});

// Tasks
const cjs = () => gulp.src(paths.src)
  .pipe(babel({ envName: 'cjs' }))
  .pipe(gulp.dest('dist/cjs'));

const esm = () => gulp.src(paths.src)
  .pipe(babel({ envName: 'esm' }))
  .pipe(gulp.dest('dist/esm'));

const typings = () => gulp.src(paths.src)
  .pipe(tsProject()).dts
  .pipe(gulp.dest('dist/types'));

const assets = () => gulp.src(paths.assets)
  .pipe(gulp.dest('dist'));

gulp.task('build', gulp.parallel(cjs, esm, typings, assets));