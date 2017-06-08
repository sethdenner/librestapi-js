var webpack = require('webpack');
var path = require('path');
var libraryName = 'librestapi';
var libraryTarget = 'umd';
var target;
var outputFile = libraryName + '.js';

var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var env = process.env.WEBPACK_ENV;

var plugins = [], entry, outputFile;
var resolve = {
    root: path.resolve('./src'),
    extensions: ['', '.js']
};

if (env === 'web') {
    plugins.push(new UglifyJsPlugin({ minimize: true }));
    outputFile = libraryName + '.min.js';
    entry = {
        'librestapi': __dirname + '/src/index.js'
    }
    target = 'web';

} else {
    outputFile = libraryName + '.js';
    entry = __dirname + '/src/index.js';
    target = 'node';

}


var config = {
    entry: entry,
    devtool: 'source-map',
    output: {
        path: __dirname + '/dist',
        filename: outputFile,
        library: libraryName,
        libraryTarget: libraryTarget,
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.js$/,
                loader: "eslint-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: resolve,
    plugins: plugins,
    target: target
};

module.exports = config;
