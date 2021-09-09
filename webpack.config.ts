import CopyWebpackPlugin from 'copy-webpack-plugin'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import * as path from 'path'
import webpack from 'webpack'
import devserver from 'webpack-dev-server'

const config: webpack.Configuration | { devServer: devserver } = {
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
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
        },
        {
          from: path.join(__dirname, '/public/style.css'),
          to: './style.css'
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
