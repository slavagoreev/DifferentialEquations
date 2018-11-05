const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        index: './src/js/views/index/index.ts',
        report: './src/js/views/report/report.ts',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        // publicPath: './src/assets',
        contentBase: path.resolve(__dirname, 'dist'),
        watchContentBase: true,
        hot: true
    },
    plugins: [
        new ManifestPlugin(),
        // new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Differential equations project',
            filename: 'index.html',
            template: 'src/js/views/index/index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            title: 'Report',
            filename: 'report.html',
            template: 'src/js/views/report/report.html',
            chunks: ['report']
        }),
        new CopyWebpackPlugin([ { from: 'src/assets', to: './' } ]),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }, {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader",  // creates style nodes from JS strings
                }, {
                    loader: "css-loader",    // translates CSS into CommonJS
                    options: {
                        sourceMap: true,
                    },
                }, {
                    loader: "resolve-url-loader",
                }, {
                    loader: "sass-loader",   // compiles Sass to CSS
                    options: {
                        sourceMap: true,
                    }
                }]
            }, {
                test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
                use: [{
                    loader: "file-loader"
                }]
            }, {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                ],
            }]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
};
