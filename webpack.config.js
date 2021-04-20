const path = require('path'); // this module allows relative file-path
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: './src/index.js', //App entry point
    output: { //  configuration webpack output
        path: path.resolve(__dirname, 'dist'), //path.resolve allow it knows what is te path of our app
        filename: '[name].[contenthash].js', //file name storage into path
        assetModuleFilename: 'assets/images/[hash][ext][query]' //folder to images
    },
    resolve: {
        extensions: ['.js'], //what kind extension we'll use into project
        alias: { //allow work with alias into other files, and u won't use all path in the other files
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/'),
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js$/, // regular expression to read extension of kind .mjs or js
                exclude: /node_module/, //When execute the build it's necessary exclude of node_modules folder
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css|.styl$/i, // regular expression to read extension of kind css or styl
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'stylus-loader'
                ]
            },
            {
                test: /\.png/, // regular expression to read extension of kind png
                type: 'asset/resource' //module to export from png to base64
            },
            {
                test: /\.(woff|woff2)$/, // regular expression to read extension of kind woff
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000, //limit weight to fonts
                        mimetype: "application/font-woff", //type of fonts
                        name: "[name].[contenthash].[ext]", //filename to fonts
                        outputPath: "./assets/fonts/",
                        publicPath: "../assets/fonts/",
                        esModule: false,
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/index.html',
            filename: './index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname,"src", "assets/images"), // the plugin will copy the content of this files: __dirname/src/assets, __dirname/src/images
                    to: "assets/images" //it will be the final folder where the images will exist
                }
            ]
        }),
        new Dotenv(), // use environment variables
        new CleanWebpackPlugin(), // use clean plugin to dist folder is ready to upload to production
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(), //Optimization for CSS file
            new TerserPlugin(), //Optimization for JS file
        ]
    }
}