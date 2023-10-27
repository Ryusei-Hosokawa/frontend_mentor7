const { src, dest, watch, series, parallel } = require('gulp');

//sass
const sass = require('gulp-dart-sass');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const mqpacker = require('css-mqpacker');

//js babel
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

//画像圧縮
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const webp = require('gulp-webp');
const changed = require('gulp-changed');

//ファイル監視
const browserSync = require('browser-sync');
const connect = require('gulp-connect-php');

//postcss-cssnext ブラウザ対応条件 prefix 自動付与
const browsers = [
    'last 2 versions',
    '> 5%',
    'ie = 11',
    'not ie <= 10',
    'ios >= 8',
    'and_chr >= 5',
    'Android >= 5',
]

//参照元パス
const srcPath = {
    css: 'src/scss/**/**.scss',
    js: 'src/js/*.js',
    img: 'src/img/**/*',
}

//出力先パス
const destPath = {
    css: 'dist/assets/css/',
    js: 'dist/assets/js/',
    img: 'dist/assets/img/'
}

//sass
const cssSass = () => {
    return src(srcPath.css) //コンパイル元
        .pipe(sourcemaps.init())//gulp-sourcemapsを初期化
        .pipe(
            plumber(              //エラーが出ても処理を止めない
                {
                    errorHandler: notify.onError('Error:<%= error.message %>')
                    //エラー出力設定
                }
            )
        )
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(postcss([mqpacker()])) // メディアクエリを圧縮
        .pipe(postcss([cssnext(browsers)]))//cssnext
        .pipe(cleanCSS()) // CSS圧縮
        .pipe(
            rename({
                extname: '.min.css' //.min.cssの拡張子にする
            })
        )
        .pipe(sourcemaps.write('/maps'))  //ソースマップの出力
        .pipe(dest(destPath.css))         //コンパイル先
}

// babelのトランスパイル、jsの圧縮
const jsBabel = () => {
    return src(srcPath.js)
        .pipe(
            plumber(              //エラーが出ても処理を止めない
                {
                    errorHandler: notify.onError('Error: <%= error.message %>')
                }
            )
        )
        .pipe(babel({
            presets: ['@babel/preset-env']  // gulp-babelでトランスパイル
        }))
        .pipe(uglify()) // js圧縮
        .pipe(
            rename(
                { extname: '.min.js' }
            )
        )
        .pipe(dest(destPath.js))
}

//画像圧縮（デフォルトの設定）
const imgImagemin = () => {
    return src(srcPath.img)
        .pipe(
            imagemin(
                [
                    imageminMozjpeg({
                        quality: 80
                    }),
                    imageminPngquant(),
                    imageminSvgo()
                ],
                {
                    verbose: true
                }
            )
        )
        .pipe(dest(destPath.img))
        .pipe(changed("dest"))
}

//WebP
const gulpWebp = () => {
    return src(srcPath.img)
		.pipe(rename(function (path) {
			path.basename += path.extname;
		}))
		.pipe(webp())
		.pipe(dest(destPath.img))
}

//ローカルサーバー立ち上げ、ファイル監視と自動リロード
const gulpConnect = () => {
    connect.server({
        base: "./dist/",
        livereload: true,
        port: 8000
    });
}
const browserSyncFunc = () => {
    browserSync.init({
        proxy: 'http://localhost/dist/',       //環境によって変更する
        open: true,
        reloadOnRestart: true,
        port: 8000
    });
}

//リロード
const browserSyncReload = (done) => {
    browserSync.reload();
    done();
}

//ファイル監視
const watchFiles = () => {
    watch(srcPath.css, series(cssSass, browserSyncReload))
    watch(srcPath.js, series(jsBabel, browserSyncReload))
    watch(srcPath.img, series(imgImagemin, browserSyncReload))
    watch(srcPath.img, series(gulpWebp, browserSyncReload))
}

exports.default = series(series(cssSass, jsBabel, imgImagemin, gulpWebp), parallel(watchFiles, browserSyncFunc, gulpConnect));