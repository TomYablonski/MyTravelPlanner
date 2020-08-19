const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin');


module.exports = {
    entry: './src/client/index.js',
    mode: 'production',
	output: {
        libraryTarget: 'var',
        library: 'Client' //Where custom javascript goes
    },
	optimization: {
        minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})]
    },
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ] //style-loader made css styles inline, which is slower
            },
           {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name : '[name].[ext]',
                            outputPath: 'img/',
                            publicPath: 'img/'

                        }
                    }
                ],
            },
            {
                test: /\.(html)$/,
                use: [{
                    loader: 'html-loader',
                }]
            }			
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
	    new MiniCssExtractPlugin({filename: '[name].css'}),
        new WorkboxPlugin.GenerateSW() 
    ]
}
