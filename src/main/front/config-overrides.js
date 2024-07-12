// const webpack = require('webpack');

module.exports = function override(config, env) {
    config.resolve.fallback = {
        fs: false,
        path: require.resolve("path-browserify"),
        os: require.resolve("os-browserify/browser"),
        util: require.resolve("util/"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        url: require.resolve("url/"),
        crypto: require.resolve("crypto-browserify"),
        buffer: require.resolve("buffer/")
    };
    return config;
}