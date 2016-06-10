var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');

var spritesmith = require('gulp.spritesmith');

var path = {
	src: {
		sprite: 'src/img/sprite/*.png',
		img: 'src/img/',
		cssTemplate: 'src/sass/gulp-sprite/scss.sprite.mustache',
		spriteScss: 'src/sass/mixins/'
	},

	dist: {
		img: 'dist/img/'
	}
};

gulp.task('sprite', function () {

	// Generate our spritesheet
	var spriteData = gulp.src(path.src.sprite).pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.scss',
		algorithm: 'binary-tree',
		algorithmOpts: {
		    sort: false
		},
		cssOpts: {
			functions: true
		},
		padding: 4,
		cssTemplate: path.src.cssTemplate
	}));

	// Pipe image stream through image optimizer and onto disk 
    var imgStream = spriteData.img
      // DEV: We must buffer our stream into a Buffer for `imagemin` 
      .pipe(buffer())
      .pipe(imagemin())
      .pipe(gulp.dest(path.dist.img));
   
    // Preturn merge(imgStream, cssStream);ipe CSS stream through CSS optimizer and onto disk 
    var cssStream = spriteData.css
      .pipe(gulp.dest(path.src.spriteScss));
   
    // Return a merged stream to handle both `end` events 
    return merge(imgStream, cssStream);
});