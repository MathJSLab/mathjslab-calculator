/**
 * webpack.config.ts: Webpack configuration factory.
 */
import path from 'node:path';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import webpack from 'webpack';
import 'webpack-dev-server';
import DotenvWebpackPlugin from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default (env: any, argv: any): webpack.Configuration => {
    const buildEnvPath = path.join(__dirname, 'build.env');
    const envVars = dotenv.config({
        path: buildEnvPath,
    });
    dotenvExpand.expand(envVars);
    Object.assign(envVars.parsed!, env);
    envVars.parsed!.WEBPACK_MODE = argv.mode;
    const isProduction = argv.mode.startsWith('prod') || !argv.mode.startsWith('dev');
    const configuration: webpack.Configuration = {
        mode: argv.mode,
        entry: path.join(__dirname, 'src', 'main.ts'),
        module: {
            rules: [
                {
                    test: /\.ts$/i,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: 'tsconfig.build.json',
                            },
                        },
                    ],
                    exclude: [
                        'node_modules',
                        process.env.MATHJSLAB_APP_WEBPACK_OUTPUT_PATH!,
                        'doc',
                        'example',
                        'help',
                        'images',
                        'm-file',
                        'script',
                    ].map((dir) => path.join(__dirname, dir)),
                },
                {
                    test: /\.css$/i,
                    use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        output: {
            filename: process.env.MATHJSLAB_APP_WEBPACK_OUTPUT_FILENAME!,
            path: path.join(__dirname, process.env.MATHJSLAB_APP_WEBPACK_OUTPUT_PATH!),
            environment: {
                module: true,
                dynamicImport: true,
            },
        },
        plugins: [
            new DotenvWebpackPlugin({
                path: buildEnvPath,
                systemvars: true,
            }),
            new HtmlWebpackPlugin({
                title: process.env.MATHJSLAB_APP_TITLE,
                template: path.join(__dirname, 'src', 'main.html'),
            }),
        ],
    };
    if (isProduction) {
        configuration.plugins!.push(new MiniCssExtractPlugin());
    } else {
        configuration.devtool = 'inline-source-map';
        configuration.devServer = {
            static: path.join(__dirname, process.env.MATHJSLAB_APP_WEBPACK_OUTPUT_PATH!),
            compress: true,
            port: process.env.MATHJSLAB_APP_WEBPACK_DEVSERVER_PORT,
        };
    }
    console.warn(
        `Webpack configuration path: ${__filename}\n- Building ${process.env.MATHJSLAB_APP_TITLE} ${argv.mode} bundle.\n- Environment file: ${buildEnvPath}\n- Environment variables:`,
    );
    console.table(envVars.parsed);
    return configuration;
};
