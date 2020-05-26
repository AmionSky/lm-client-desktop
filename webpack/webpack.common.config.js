const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const node = "12.14.1";
const chrome = "83";

exports.config = {
    node: {
        __dirname: false,
        __filename: false
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
}

exports.mainConfig = {
    entry: './src/main/main.ts',
    output: {
        filename: 'main.js',
        path: path.resolve('dist/main')
    },
    target: 'electron-main',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ["@babel/preset-env", {
                                modules: false,
                                targets: {
                                    node: node
                                }
                            }],
                            "@babel/typescript"
                        ],
                        plugins: [
                            "@babel/plugin-proposal-class-properties"
                        ]
                    }
                }
            }
        ]
    },
}

exports.rendererConfig = {
    entry: './src/renderer/index.ts',
    output: {
        filename: 'renderer.js',
        path: path.resolve('dist/renderer')
    },
    target: 'electron-renderer',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ["@babel/preset-env", {
                                modules: false,
                                targets: {
                                    chrome: chrome,
                                }
                            }],
                            "@babel/typescript"
                        ],
                        plugins: [
                            "@babel/plugin-proposal-class-properties"
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/static/', to: '../static/' },
                { from: 'src/fonts/', to: '../fonts/' }
            ]
        }),
    ],
}