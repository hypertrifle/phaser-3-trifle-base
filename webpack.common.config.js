'use strict';
  
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const phaserModule = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(phaserModule, 'src/phaser.js');
const strip = require('strip-json-comments');
const pkg = require("./package.json");
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')


//used to replace certain strings within out supporting files. (Title in html files, ID in imsmanafest.)
const replacements = [
    {from: "$title$", to:pkg.name},
    {from: "$author$", to:pkg.author}
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
    return strip(content.toString('utf8'));
}

module.exports = {
    // mode: 'production',
    entry: ['@babel/polyfill','./src/typescript/client/index.ts'],
    devtool: "source-map",

    optimization:(true) ? {
        minimizer: [new TerserPlugin({
            extractComments: true,
            sourceMap:true,
            terserOptions: {
            compress: {
                booleans_as_integers:true
            }
        }
        })],
    } : {},

    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
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
            test: /\.(glsl|vs|fs|vert|frag)$/,
            exclude: /node_modules/,
            use: [
              'raw-loader',
              'glslify-loader'
            ]
            },
            {
                test: /\.ts?$/,
                use: ["babel-loader" , 'ts-loader' ],
                exclude: /node_modules/
            },
        
        {
            test: /\.s[ac]ss$/i,
            use: [
              // Creates `style` nodes from JS strings
              'style-loader',
              // Translates CSS into CommonJS
              'css-loader',
              // Compiles Sass to CSS
              'sass-loader',
            ],
          },

          {
            test: /\.(gif|png|jpe?g|svg|xml)$/i,
            use: "file-loader"
          }
        ],
    }, 

    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            "typeof CANVAS_RENDERER": JSON.stringify(true),
            "typeof WEBGL_RENDERER": JSON.stringify(true),
            "typeof EXPERIMENTAL": JSON.stringify(false),
            "typeof PLUGIN_CAMERA3D": JSON.stringify(false),
            "typeof PLUGIN_FBINSTANT": JSON.stringify(false),
            "typeof DEBUG": JSON.stringify(true),
        }),
        new HtmlWebpackPlugin({
          template: 'src/html/index.ejs',
          filename: "./index.html",
        }),
],

};
