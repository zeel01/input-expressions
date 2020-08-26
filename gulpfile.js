const Gulp = require('gulp');
const zip = require('gulp-zip');

function createRelease(cb) {
	return Gulp.src([
		"module.json",
		"handler.js",
		"main.js",
		"math.min.js"
	]).pipe(zip("module.zip"))
	  .pipe(Gulp.dest("./"));
}

exports.release = createRelease;
exports.default = createRelease;