const Gulp = require('gulp');
const zip = require('gulp-zip');
var git = require('gulp-git');

function defaultTask(cb) {
	// place code for your default task here
	cb();
}

function createRelease(cb) {
	return Gulp.src([
		"module.json",
		"handler.js",
		"main.js",
		"math.min.js"
	]).pipe(zip("module.zip"))
	  .pipe(Gulp.dest("./"));
}
async function commitChanges(cb) {
	let manifest = await require("module.json");
	return Gulp.src("./*")
		.pipe(git.commit())
}

exports.release = createRelease;
exports.default = defaultTask;