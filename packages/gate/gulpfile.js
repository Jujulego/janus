const del = require('del');
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
gulp.task('clean', () => del('dist'));

gulp.task('build:cjs', () => gulp.src(paths.src)
  .pipe(babel({ envName: 'cjs' }))
  .pipe(gulp.dest('dist/cjs'))
);

gulp.task('build:esm', () => gulp.src(paths.src)
  .pipe(babel({ envName: 'esm' }))
  .pipe(gulp.dest('dist/esm'))
);

gulp.task('build:types', () => gulp.src(paths.src)
  .pipe(tsProject()).dts
  .pipe(gulp.dest('dist/types'))
);

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('build:cjs', 'build:esm', 'build:types'),
));