const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: './src/main.ts',
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        watchContentBase: true,
        hot: true,
        onCompile(compiler, server) {
            const watchFiles = ['.html', '.hbs'];
            const changedFiles = Object.keys(compiler.watchFileSystem.watcher.mtimes);

            if (
                this.hot &&
                changedFiles.some(filePath => watchFiles.includes(path.parse(filePath).ext))
            ) {
                server.sockWrite(server.sockets, "content-changed");
            }
        }
    },
    plugins: [
        new ManifestPlugin(),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Differential equations project',
            filename: 'index.html',
            template: 'src/index.html',
        }),
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
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
