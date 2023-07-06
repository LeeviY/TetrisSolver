const path = require("path");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    target: ["web", "es2021"],
    entry: {
        //main: "./src/app.ts",
        main: "./src/index.js",
    },
    output: {
        path: path.resolve(__dirname, "./public"),
        filename: "[name]-bundle.js", // <--- Will be compiled to this single file
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
        ],
    },
};
