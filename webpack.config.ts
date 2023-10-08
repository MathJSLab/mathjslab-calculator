import path from 'path';
import webpack from 'webpack';
import 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config: webpack.Configuration = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /(\.tsx?)|(\.js)$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.build.json',
                        },
                    },
                ],
                exclude: [/node_modules/, /test/],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            parser: path.resolve(__dirname, 'src/'),
        },
    },
    output: {
        filename: 'mathjslab-calc.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'MathJSLab Calculator',
            template: 'src/custom.html',
        }),
    ],
};

if (process.env.MODE_ENV?.startsWith('prod')) {
    console.log('Building production bundle.');
} else if (process.env.MODE_ENV?.startsWith('dev')) {
    config.devtool = 'inline-source-map';
    config.devServer = {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 4000,
    };
    console.log('Building development bundle.');
}

export default config;
