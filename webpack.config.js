'use strict';

const webpack = require('webpack');
const path = require('path');

const WebpackShellPlugin = require('webpack-shell-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PathOverridePlugin = require('path-override-webpack-plugin');
const phaserModule = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(phaserModule, 'src/phaser.js');
// const texturePackerString = "TexturePacker --sheet build/assets.png --data build/assets.json --format phaser --multipack --shape-padding 2 --border-padding 2 --trim-mode Trim assets/img"

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
            "typeof CANVAS_RENDERER": JSON.stringify(true),
            "typeof WEBGL_RENDERER": JSON.stringify(true),
            "typeof EXPERIMENTAL": JSON.stringify(false),
            "typeof PLUGIN_CAMERA3D": JSON.stringify(false),
            "typeof PLUGIN_FBINSTANT": JSON.stringify(false)
        }),

        // new CleanWebpackPlugin(['dist']),

        new CopyWebpackPlugin(   
            [ 
                { from: 'assets', to: 'assets' }
            ], {}
    ),

         new WebpackShellPlugin({
            // onBuildExit: [''], //shell commpands on end of each compile.
            // onBuildStart: [texturePackerString], //shell commands on start up
            //  onBuildExit: [texturePackerString, "echo 'Webpack Start'"],// shell commands after each build? trexture packaer sting seems to 

        })

        // // Seems to halt the other webpack functionallity working.
        // new filewatcherPlugin({
        //     watchFileRegex: ['./assets/img'],
        //     onAddDirCallback: function (path, wut, two) {
        //         //a file has changed
        //         exec(texturePackerString);
        //         console.log("rebuilt spritesheets");
        //         return null;
        //     },

        //     onRawCallback: function (event, path, details) {
        //         // console.log(event, path);

        //         if (event === "change") {
        //             //a file has changed
        //             exec(texturePackerString);
        //             console.log("rebuilt spritesheets");
        //         }
        //         return null;
        //     }

        // })

    ]

};