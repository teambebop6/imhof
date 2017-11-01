/**
 * Created by Henry Huang on 10/28/17.
 */
import gulp from 'gulp';
import gutil from 'gulp-util';
import merge from 'merge-stream';
import clean from 'gulp-clean';
import webpack from 'webpack';
import runSequance from 'run-sequence';
import zip from 'gulp-zip';
import webpackConfig from './webpack.config';
import buildSemantic from './assets/vendor/Semantic-UI/tasks/build';
import release from './gulptasks/release';

const semanticDist = './assets/vendor/Semantic-UI/dist';

gulp.task('default', () => {
  gutil.log('This is imhof Gulp!');
});

gulp.task('build', () => {
  runSequance('build:webpack', 'build:others', () => {

    gutil.log('Imhof builded!');
  });
});

gulp.task('dist', () => {
  runSequance('dist:copy', 'dist:archive', () => {
    gutil.log('Imhof dist done!');
  });
});

gulp.task('build:others', () => {
  gutil.log('Imhof others builded!');
});

gulp.task('build:semantic', buildSemantic);

gulp.task('build:webpack', (callback) => {
  const wConfig = Object.create(webpackConfig);
  webpack(wConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('build:webpack', err);
    gutil.log('[build:webpack]', stats.toString({
      colors: true
    }));
    if (callback) {
      callback();
    }
  });
});

gulp.task('dist:copy', () => {

  const helpers = gulp.src(['helpers/**/*'])
    .pipe(gulp.dest('dist/helpers/'));

  const models = gulp.src(['models/**/*'])
    .pipe(gulp.dest('dist/models/'));

  const publicFolder = gulp.src(['public/**/*'])
    .pipe(gulp.dest('dist/public/'));

  const routes = gulp.src(['routes/**/*'])
    .pipe(gulp.dest('dist/routes/'));

  const utils = gulp.src(['utils/**/*'])
    .pipe(gulp.dest('dist/utils/'));

  const views = gulp.src(['views/**/*'])
    .pipe(gulp.dest('dist/views/'));

  const semantic = gulp.src(['assets/vendor/Semantic-UI/dist/**/*'])
    .pipe(gulp.dest('dist/assets/vendor/Semantic-UI/dist/'));

  const dist = gulp.src(['package.json', 'app.js', 'config.js', 'pm2.*.config.js'])
    .pipe(gulp.dest('dist/'));

  return merge(helpers, models, publicFolder, routes, utils, views, semantic, dist);

});

gulp.task('dist:archive', () => {
  const distFolder = __dirname;
  return gulp.src('dist/**/*', {
    dot: true
  }).pipe(zip('imhof-dist.zip'))
    .pipe(gulp.dest(distFolder));
});

gulp.task('test', () => {
  gutil.log('Imhof tested!');
});

gulp.task('clean', () => {
  return gulp.src([semanticDist, 'dist/', 'dist.zip', 'imhof-dist.zip'], {read: false})
    .pipe(clean());
});

gulp.task('release', release);