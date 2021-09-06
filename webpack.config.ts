import webpack from 'webpack'
import devserver from 'webpack-dev-server'
import * as path from 'path'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

const config: webpack.Configuration | { devServer: devserver } = {
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      // '': path.resolve(__dirname, 'src/**/*')
    }
  },
  devServer: {
    liveReload: true,
    hot: true,
    port: 8080
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    }),
    new (CopyWebpackPlugin as any)({
      patterns: [
        {
          from: path.join(__dirname, '/static'),
          to: './static/'
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.ts/,
            exclude: /node_modules/,
            use: {
              loader: 'ts-loader'
            }
          }
        ]
      }
    ]
  }
}

export default config