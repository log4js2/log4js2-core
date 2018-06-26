const webpack = require('webpack');
const Path = require('path');

const outPath = Path.resolve(__dirname, './dist');
const sourcePath = Path.resolve(__dirname, './src');

module.exports = env => {
    return {
        devtool: 'source-map',
        context: sourcePath,
        entry: {
            main: './index.ts'
        },
        output: {
            path: outPath,
            publicPath: '/',
            filename: 'index.js'
        },
        target: 'web',
        resolve: {
            extensions: ['.js', '.ts']
        },
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            babelrc: true
                        },
                    }, 'ts-loader']
                }
            ]
        }
    }
};