import {Gulpclass, MergedTask, SequenceTask, Task} from "gulpclass";

const gulp = require("gulp");
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const gulpTsLint = require("gulp-tslint");
const jest = require('gulp-jest').default;
const packageJSON = require('./package.json');

@Gulpclass()
export class GulpFile {

    @Task()
    public clean(callback: () => void) {
        return del(["./dist/**"], callback);
    }

    @Task()
    public test() {
        return gulp.src("./src/log4js.ts")
            .pipe(jest({
                ...packageJSON.jest
            }));
    }

    @Task()
    public lint() {

        return gulp.src("./src/**/*.ts")
            .pipe(gulpTsLint({
                formatter: "verbose",
                configuration: "tslint.json"
            }))
            .pipe(gulpTsLint.report());

    }

    /**
     * Copies all sources to the package directory.
     */
    @MergedTask()
    public packageCompile() {

        const tsProject = ts.createProject("tsconfig.json", {
            typescript: require("typescript")
        });

        const tsResult = gulp.src([
            "./src/log4js.ts",
            "!./src/**/__tests__/*",
            "!./src/**/__mocks__/*",
            "./node_modules/@types/**/*.ts"
        ])
            .pipe(sourcemaps.init())
            .pipe(tsProject());

        return [
            tsResult.dts.pipe(gulp.dest("./dist")),
            tsResult.js
                .pipe(sourcemaps.write(".", {
                    sourceRoot: "",
                    includeContent: true
                }))
                .pipe(gulp.dest("./dist"))
        ];
    }

    @SequenceTask()
    public package() {
        return [
            "clean",
            "lint",
            "test",
            ["packageCompile"]
        ];
    }

}
