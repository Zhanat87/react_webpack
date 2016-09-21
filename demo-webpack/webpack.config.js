const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const merge = require('webpack-merge');

const validate = require('webpack-validator');

const parts = require('./libs/parts');

const pkg = require('./package.json');

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
    // style: path.join(__dirname, 'app', 'main.css')
    style: [
        path.join(__dirname, 'node_modules', 'purecss'),
        path.join(__dirname, 'app', 'main.css')
    ],
};

const common = {

    // Entry accepts a path or an object of entries.
    // We'll be using the latter form given it's
    // convenient with more complex configurations.
    entry: {
        app: PATHS.app
        // ,vendor: ['react']
        ,vendor: Object.keys(pkg.dependencies)
        ,style: PATHS.style
    },
    output: {
        path: PATHS.build,
        filename: '[name].[hash].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack demo'
        })
    ]
};

var config;

// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
    case 'build':
        config = merge(
            common,
            {
                devtool: 'source-map',
                output: {
                    path: PATHS.build,
                    filename: '[name].[chunkhash].js',
                    // This is used for require.ensure. The setup
                    // will work without but this is useful to set.
                    chunkFilename: '[chunkhash].js'
                }
            },
            parts.minify(),
            // parts.setupCSS(PATHS.app),
            // parts.extractCSS(PATHS.app),
            parts.extractCSS(PATHS.style),
            parts.purifyCSS([PATHS.app]),
            parts.setFreeVariable(
                        'process.env.NODE_ENV',
                        'production'
                    ),
                    parts.extractBundle({
                        name: 'vendor',
                        entries: ['react']
                    }),
                    parts.clean(PATHS.build)
                );
        break;
    case 'stats':
        config = merge(
            common,
            {
                path: PATHS.build,
                filename: '[name].[chunkhash].js',
                // This is used for require.ensure. The setup
                // will work without but this is useful to set.
                devtool: 'eval-source-map',
                // Tweak this to match your GitHub project name
                publicPath: '/webpack-demo/'
            },
            parts.minify(),
            // parts.setupCSS(PATHS.app),
            // parts.extractCSS(PATHS.app),
            parts.extractCSS(PATHS.style),
            parts.purifyCSS([PATHS.app]),
            parts.setFreeVariable(
                'process.env.NODE_ENV',
                'production'
            ),
            parts.extractBundle({
                name: 'vendor',
                entries: ['react']
            }),
            parts.clean(PATHS.build)
        );
        break;
    default:
        config = merge(
            common,
            {
                devtool: 'eval-source-map'
            },
            parts.devServer({
                // Customize host/port here if needed
                host: process.env.HOST,
                port: process.env.PORT
            }),
            // parts.setupCSS(PATHS.app),
            parts.setupCSS(PATHS.style)
        );
}

// module.exports = validate(config);

// Run validator in quiet mode to avoid output in stats
module.exports = validate(config, {
    quiet: true
});