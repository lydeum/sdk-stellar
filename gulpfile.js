const execSync = require('child_process').execSync
const gulp = require('gulp')
const mocha = require('gulp-mocha')

function exec(cmd) {

  execSync(cmd, {stdio:[0,1,2]})

}

function processMocha(patterns) {

  gulp
    .src(patterns, {read: false})
    .pipe(mocha({reporter: 'spec'}))
    .on('end', function () {
      process.exit()
    })
    .on('error', function (e) {
      console.error(e)
      process.exit(1)
    })

}

gulp.task('mocha', function(done) {

  processMocha([
    './test/setup.js',
    './test/integration/**/*.js',
  ])

})
