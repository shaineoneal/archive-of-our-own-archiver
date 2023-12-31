const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
      popup: path.join(srcDir, 'pages/popup.tsx'),
      options: path.join(srcDir, 'pages/options.tsx'),
      background: path.join(srcDir, 'background/background.ts'),
      content_script: path.join(srcDir, 'content_script.tsx'),
    },
    output: {
        path: path.join(__dirname, "../dist/js"),
        filename: "[name].js",
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks(chunk) {
                return chunk.name !== 'background';
            }
        },
        runtimeChunk: false,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            name: path.join(__dirname, "../dist/icons/[name].[ext]")
                        },
                    },
                ],
            }
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        fallback: {
            "assert": require.resolve("assert/"),
            "buffer": require.resolve("buffer/"),
            "crypto": require.resolve("crypto-browserify"),
            "fs": false,
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "net": false,
            "os": require.resolve("os-browserify/browser"),
            "path": require.resolve("path-browserify"),
            "process": false,
            "querystring": require.resolve("querystring-es3/"),
            "stream": require.resolve("stream-browserify"),
            "tls": false,
            "url": require.resolve("url/"),
            "util": require.resolve("util/"),
            "zlib": require.resolve("browserify-zlib"),
            "child_process": false,
            "http2": false,
            
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: '[name].html',
        }),
        new CopyPlugin({
            patterns: [{ from: ".", to: "../", context: "public" }],
            options: {},
        }),
        new webpack.ProvidePlugin({
            $: require.resolve('jquery'),
            jQuery: require.resolve('jquery'),
        }),
        new MiniCssExtractPlugin()
    ],
};
