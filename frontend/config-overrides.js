const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
    // ... other config options
    plugins: [
        new NodePolyfillPlugin()
    ],
    resolve: {
        fallback: {
            console: require.resolve("console-browserify")
        }
    }
};