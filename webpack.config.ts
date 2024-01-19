import path from 'path';
import webpack from 'webpack';
import 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const isProduction = process.env.NODE_ENV?.startsWith('prod');

const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

const config: webpack.Configuration = {
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.(tsx?|jsx?)$/i,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.build.json',
                        },
                    },
                ],
                exclude: [/node_modules/],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            parser: path.resolve(__dirname, 'src/'),
        },
    },
    output: {
        filename: 'mathjslab-calculator.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'MathJSLab Calculator',
            template: 'src/main.html',
        }),
    ],
};

if (isProduction) {
    config.mode = 'production';
    config.plugins!.push(new MiniCssExtractPlugin());
    console.log('webpack.config.ts: Building production bundle.');
} else {
    config.mode = 'development';
    config.devtool = 'inline-source-map';
    config.devServer = {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 4000,
    };
    console.log('webpack.config.ts: Building development bundle.');
}

export default config;
