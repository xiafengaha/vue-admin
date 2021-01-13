"use strict";
const path = require("path");
const utils = require("./utils");
const config = require("../config");
// const vueLoaderConfig = require("./vue-loader.conf");
const { VueLoaderPlugin, vueLoaderConfig } = require("vue-loader");
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");

function resolve(dir) {
    return path.join(__dirname, "..", dir);
}

module.exports = {
    context: path.resolve(__dirname, "../"),
    entry: {
        app: "./src/main.js"
    },
    externals: {
        vue: "Vue",
        // "vue-router": "Router",
        "element-ui": "ELEMENT"
    },
    output: {
        path: config.build.assetsRoot,
        filename: "[name].js",
        publicPath: process.env.NODE_ENV === "production" ||
            process.env.NODE_ENV === "ppeEnvironment" ?
            config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: [".js", ".vue", ".json", ".ts", ".tsx"],
        alias: {
            vue$: "vue/dist/vue.esm.js",
            "@": resolve("src"),
            src: resolve("src"),
            assets: resolve("src/assets"),
            base: resolve("src/base"),
            common: resolve("src/common"),
            components: resolve("src/components"),
            views: resolve("src/views"),
            styles: resolve("src/styles"),
            api: resolve("src/api"),
            utils: resolve("src/utils"),
            store: resolve("src/store"),
            router: resolve("src/router"),
            vendor: resolve("src/vendor"),
            static: resolve("static"),
            views: resolve("src/views"),
        },
        modules: [resolve("src"), resolve("node_modules")],
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: vueLoaderConfig,
                include: [resolve("src")],
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: [
                    resolve("src"),
                    resolve("test"),
                    resolve("node_modules/webpack-dev-server/client")
                ],
                exclude: /node_modules/
            },
            {
                test: /\.svg$/,
                loader: "svg-sprite-loader",
                include: [resolve("src/icons")],
                options: {
                    symbolId: "icon-[name]"
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "url-loader",
                exclude: [resolve("src/icons")],
                options: {
                    limit: 10000,
                    name: utils.assetsPath("img/[name].[hash:7].[ext]")
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: utils.assetsPath("media/[name].[hash:7].[ext]")
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
                }
            }
        ]
    },
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty"
    },
    plugins: [
        new ParallelUglifyPlugin({
            uglifyJS: {},
            test: /.js$/g,
            include: [],
            exclude: [],
            cacheDir: "",
            workerCount: "",
            sourceMap: false
        }),
        new VueLoaderPlugin(),
    ]
};