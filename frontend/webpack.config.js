var webpack = require('webpack');
var path = require('path');

module.exports = {
    // mode: 'production',
    mode: 'development',
    entry: './src/index.jsx',
    module: {
        rules: [
            {
                test: /\.jsx/,
                use: 'babel-loader'
            },
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'file-loader'
            }
        ]
    },
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
        port: 3000,
        historyApiFallback: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        dns: 'empty'
    },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath:  ''
    }
};
