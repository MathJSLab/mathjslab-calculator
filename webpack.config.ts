/**
 * webpack.config.ts: Webpack configuration factory.
 */
import path from 'node:path';
import webpack from 'webpack';
import 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default (env: any, argv: any): webpack.Configuration => {
    const isProduction = argv.mode.startsWith('prod');
    const configuration: webpack.Configuration = {
        mode: argv.mode,
        entry: './src/main.ts',
        module: {
            rules: [
                {
                    test: /\.[tj]sx?$/i,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: 'tsconfig.build.json',
                            },
                        },
                    ],
                    exclude: [/node_modules/, /dist/, /doc/, /example/, /help/, /images/, /m-file/, /script/],
                },
                {
                    test: /\.css$/i,
                    use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
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
            environment: {
                module: true,
                dynamicImport: true,
            },
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'MathJSLab Calculator',
                template: 'src/main.html',
            }),
        ],
        ignoreWarnings: [(warning: webpack.WebpackError, compilation: webpack.Compilation) => warning.constructor.name === 'ModuleDependencyWarning'],
    };
    if (isProduction) {
        configuration.plugins!.push(new MiniCssExtractPlugin());
    } else {
        configuration.devtool = 'inline-source-map';
        configuration.devServer = {
            static: path.join(__dirname, 'dist'),
            compress: true,
            port: 4000,
        };
    }
    console.warn(`webpack.config.ts: Building ${argv.mode} bundle.`);
    console.log('Environment variables:');
    console.table(env);
    return configuration;
};
