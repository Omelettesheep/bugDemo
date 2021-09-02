const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const paths = require('./paths');
module.exports = function (env, args) {
    const mode = args.mode;
    const isPro = mode !== 'development';
    return {
        mode,
        target: 'web',
        entry: {
            index: paths.appIndexJs
        },
        output: {
            path: paths.appBuild,
            filename: isPro ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].js',
            chunkFilename: isPro ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js',
            crossOriginLoading: 'anonymous',
            assetModuleFilename: 'static/media/[name].[hash:8][ext]',
        },
        optimization: {
            minimize: isPro,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    extractComments: false,
                }),
                new CssMinimizerPlugin(),
            ],
        },
        resolve: {
            modules: ['node_modules', paths.appNodeModules],
            extensions: ['.web.js', '.js', '.web.jsx', '.jsx', '.json'],
            alias: {
                '@': path.resolve(paths.appSrc),
                '@css': path.resolve(paths.appSrc, 'static/css'),
            }
        },
        module: {
            rules: [
                {
                    oneOf: [
                        {
                            test: /\.(jsx|js)?$/,
                            use: ['babel-loader'],
                            include: paths.appSrc
                        },
                        {
                            test: /\.less$/,
                            exclude: [/node_modules/],
                            use: [
                                isPro ? MiniCssExtractPlugin.loader : 'style-loader',
                                {
                                    loader: 'thread-loader',
                                    options: {
                                        workers: 3,
                                    },
                                },
                                {
                                    loader: 'css-loader',
                                    options: {
                                        esModule: false,
                                        importLoaders: 1,
                                    }
                                },
                                {
                                    loader: 'less-loader',
                                    options: {
                                        lessOptions: {
                                            javascriptEnabled: true
                                        }
                                    }
                                }
                            ].filter(Boolean)
                        },
                        {
                            test: /\.css$/,
                            use: [
                                isPro ? MiniCssExtractPlugin.loader : 'style-loader',
                                {
                                    loader: 'css-loader',
                                    options: {
                                        esModule: false,
                                        importLoaders: 1,
                                    }
                                },
                                {
                                    loader: 'less-loader',
                                    options: {
                                        lessOptions: {
                                            javascriptEnabled: true
                                        }
                                    }
                                }
                            ].filter(Boolean)
                        },
                        {
                            exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                            type: 'asset/resource',
                        },
                    ]
                }
            ]
        },
        plugins: [
            isPro && new CleanWebpackPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new ReactRefreshWebpackPlugin(),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: paths.appHtml
            }),
            isPro &&
            new MiniCssExtractPlugin({
                filename: 'static/css/[name].[contenthash:8].css',
                chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
            }),
        ].filter(Boolean),
        devServer: {
            host: '127.0.0.1',
            port: 3007,
            hot: true
        }
    }
}
