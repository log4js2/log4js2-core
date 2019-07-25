const Path = require('path');

const sourcePath = Path.resolve(__dirname, './src');

const browserConfig = {
    target: 'web',
    context: sourcePath,
    devtool: 'source-map',
    entry: {
        index: './index.ts',
    },
    output: {
        libraryTarget: 'window',
        filename: '[name].js',
        path: Path.resolve(__dirname, './dist/browser'),
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    module: {
        rules: [{
            test: /\.ts?$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    presets: [['@babel/preset-env', {
                        targets: "> 0.25%, not dead"
                    }]]
                }
            }, 'ts-loader']
        }]
    }
};

module.exports = [browserConfig];
