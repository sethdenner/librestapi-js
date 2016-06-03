var webpack = require('webpack'),
    path = require('path'),
    srcPath = path.join(__dirname, 'src'),
    fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: {
        app: [
            './index.js'
        ],
    },
    output: {
        path: path.join(__dirname, 'build', 'dist'),
        filename: 'librestapi.js',
        libraryTarget: 'umd',
        library: 'librestapi-js',
        pathInfo: true
    },
    target: 'node',
    externals: nodeModules,
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
        ]
    },
    resolve: {
        root: srcPath,
        extensions: [
            '',
            '.js',
        ],
        modulesDirectories: [
            'node_modules',
        ],
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ],
    debug: false
};
