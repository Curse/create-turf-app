/* eslint-env node */
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleTracker = require('webpack-bundle-tracker')
const jsonImporter = require('node-sass-json-importer')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const merge = require('webpack-merge')
const polyfills = ['@babel/polyfill']

module.exports = ({
  entry = './main.js',
  basePath = process.cwd(),
  distPath = 'dist',
  publicPath = '/static/dist',
  statsFile = {
    path: '/static/dist',
    fileName: 'webpack-stats.json',
  },
  overrides = {},
}) => (env, argv) => {
  const devMode = argv.mode === 'development'
  let cdnDomain = env && env.cdnDomain || ''
  const baseConfig = {
    entry: [...polyfills, entry],
    output: {
      filename: devMode ? 'js/[name].js' : 'js/[name].[contenthash].js',
      chunkFilename: 'js/[name].[contenthash].js',
      path: path.resolve(basePath, distPath),
      publicPath: devMode || !cdnDomain ? publicPath : `https://${cdnDomain}${publicPath}`,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            // .babelrc config was causing issues with imported js from other package directories
            options: {
              presets: [['@babel/preset-env', {modules: false}], '@babel/preset-react'],
              plugins: [
                'babel-plugin-styled-components',
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-runtime',
              ],
            },
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            devMode ? {
              loader: 'style-loader',
              options: { sourceMap: true },
            } : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: devMode },
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: devMode },
            },
            {
              loader: 'resolve-url-loader',
              options: { sourceMap: devMode },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true, // required for resolve-url-loader
                importer: jsonImporter(),
              },
            },
          ],
        },
        {
          test: /\.(png|svg|gif|jpe?g)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1000,
                // ManifestStaticFilesStorage reuse.
                name: devMode ? 'img/[name].[ext]' : 'img/[name]-[contenthash].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(woff2?|eot|ttf)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1000,
                // ManifestStaticFilesStorage reuse.
                name: devMode ? 'font/[name].[ext]' : 'font/[name]-[contenthash].[ext]',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      mainFields: ['esnext', 'main'],
      modules: ['node_modules', '../'],
      extensions: ['.js', '.jsx'],
      // These are important when you're running npm link on dependencies
      symlinks: false,
      alias: {
        'styled-components': path.resolve(process.cwd(), 'node_modules', 'styled-components'),
        'react': path.resolve(process.cwd(), 'node_modules', 'react'),
        'react-dom': path.resolve(process.cwd(), 'node_modules', 'react-dom'),
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: devMode ? 'css/[name].css' : 'css/[name].[contenthash].css',
        sourceMap: devMode,
      }),
      new BundleTracker({ filename: path.join(statsFile.path, statsFile.fileName) }),
      new CleanWebpackPlugin([path.join(basePath, distPath, '*')], { allowExternal: true }),
    ],
    devtool: devMode ? 'inline-source-map' : '',
  }

  return merge(baseConfig, overrides)
}
