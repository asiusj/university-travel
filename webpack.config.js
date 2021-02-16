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
    entry: { app: path.join(srcPath, "app.js") },
    output: {
        filename: "[name].js",
        path: distPath,
        publicPath: "/",
    },
    devServer: {
        port: 4200,
        hot: true,
        contentBase: distPath,
    },
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
                collapseWhitespace: true,
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
                exclude: /node_modules/,
            },
        ],
    },
};
