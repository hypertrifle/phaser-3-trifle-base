'use strict';

const webpack = require('webpack');
const path = require('path');
var phaserModule = path.join(__dirname, '/node_modules/phaser/')
var phaser = path.join(phaserModule, 'src/phaser.js');

module.exports = {

    entry: './src/index.ts',

    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        filename: 'project.bundle.js'
    },

    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            'phaser': phaser,
        }
    },

    module: {
        rules: [
          {
            test: [ /\.vert$/, /\.frag$/ ],
            use: 'raw-loader'
          },
          {
            test: /\.ts?$/,
            use: 'ts-loader',
            exclude: /node_modules/
          }
        ],
        loaders: [
            {
                test: /\.es6$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true)
        })
    ]

};
