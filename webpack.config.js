const path = require("path");
const srcPath = path.resolve(process.cwd(), "src");
const distPath = path.resolve(process.cwd(), "dist");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//     .BundleAnalyzerPlugin;

module.exports = {
    context: srcPath,
    mode: "production",
    entry: { app: ["@babel/polyfill", path.join(srcPath, "app.js")] },
    output: {
        filename: "[name].js",
        path: distPath,
        publicPath: "",
    },
    devServer: {
        port: 4200,
        hot: true,
        contentBase: distPath,
    },
    devtool: "source-map",
    resolve: {
        extensions: [".js"],
        alias: {
            "@": srcPath,
        },
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.join(srcPath, "public", "index.html"),
            minify: {
                collapseWhitespace: false,
            },
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(srcPath, "public"),
                    to: distPath,
                    globOptions: {
                        ignore: ["**/index.html"],
                    },
                },
            ],
        }),
        // new BundleAnalyzerPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                targets: {
                                    browsers: ["last 1 version", "ie >= 11"],
                                },
                            },
                        ],
                    ],
                },
                exclude: /node_modules/,
            },
        ],
    },
};
