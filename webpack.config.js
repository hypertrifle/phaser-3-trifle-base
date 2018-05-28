'use strict';

const webpack = require('webpack');
const path = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');
const filewatcherPlugin = require("filewatcher-webpack-plugin");
var phaserModule = path.join(__dirname, '/node_modules/phaser/')
var phaser = path.join(phaserModule, 'src/phaser.js');
const {
    exec
} = require('child_process');


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
        rules: [{
                test: [/\.vert$/, /\.frag$/],
                use: 'raw-loader'
            },
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ],
        loaders: [{
            test: /\.es6$/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },

    plugins: [
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true)
        }),
        new WebpackShellPlugin({
            onBuildExit: [''] ,//shell commpands on end of each compile.
            onBuildStart: ['TexturePacker --sheet build/assets.png --data build/assets.json --format phaser --multipack --shape-padding 2 --border-padding 2 --trim-mode Trim assets/img'] //shell commands on start up

        }),

        new filewatcherPlugin({
            watchFileRegex: ['./assets/img'],
            onAddCallback: function (path, wut, two) {
                // console.log(path);

            },

            onRawCallback: function (event, path, details) {
                // console.log(event, path);

                if (event === "change") {
                    //a file has changed
                    exec('TexturePacker --sheet build/assets.png --data build/assets.json --format phaser --multipack --shape-padding 2 --border-padding 2 --trim-mode Trim assets/img'), (err, stdout, stderr) => {
                        // console.log(stdout, stderr);
                    };

                }

            }

        })

    ]

};