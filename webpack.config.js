'use strict';

const webpack = require('webpack');
const path = require('path');

const WebpackShellPlugin = require('webpack-shell-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PathOverridePlugin = require('path-override-webpack-plugin');
const phaserModule = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(phaserModule, 'src/phaser.js');
const strip = require('strip-json-comments');


const pkg = require("./package.json");

const {
    exec
} = require('child_process');



//used to replace certain strings within out supporting files. (Title in html files, ID in imsmanafest.)
const replacements = [
    {from: "$title$", to:pkg.name}
]

//this sessentially replaces the above replacements in supporting files such as index.html, imsmanefest etc.
function applyPackageVars(content){
    let string = content.toString('utf8');
    for(let i in replacements){
        string = string.replace(replacements[i].from, replacements[i].to);
    }
   return new Buffer(string);
}

function prepareJSONFiles(content) {
    console.log(content.toString('utf8'));
    console.log(strip(content.toString('utf8')))

    return strip(content.toString('utf8'));
}

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
                //standard assets, - this will be changed to Texture packer eventually
                { from: 'assets/svg', to: 'assets/svg' },

                //our JSON files, we want to strip comments essentially and convert to stadard json files (avoid mime type issues.)
                { from: 'assets/json/content.jsonc', to: 'assets/json/content.json',
                transform (content, path) {
                    return Promise.resolve(prepareJSONFiles(content))
                }
                },

                //settings file
                { from: 'assets/json/settings.jsonc', to: 'assets/json/settings.json',
                transform (content, path) {
                    return Promise.resolve(prepareJSONFiles(content))
                }
                },

                //index, flatten it so its in the root and apply our package.json varibles.
                { from: 'supporting/index.html', to: './index.html', flatten:true, 
                transform (content, path) {
                    return Promise.resolve(applyPackageVars(content));}
                },

                //indexlms - used by some LMSs
                { from: 'supporting/index.html', to: './indexlms.html', flatten:true, 
                transform (content, path) {
                    return Promise.resolve(applyPackageVars(content));}
                },

                //story.html - used by some LMSs
                { from: 'supporting/index.html', to: './story.html', flatten:true, 
                transform (content, path) {
                    return Promise.resolve(applyPackageVars(content));}
                },
                //IMSManifest - required for valid scorm package.
                { from: 'supporting/imsmanifest.xml', to: './imsmanifest.xml', flatten:true, 
                transform (content, path) {
                    return Promise.resolve(applyPackageVars(content));}
                }
                
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