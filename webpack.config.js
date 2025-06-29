const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/renderer/windows/main/index.js",
    overlay: "./src/renderer/windows/overlay/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist", "renderer"),
    filename: "[name].bundle.js",
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { targets: "defaults" }],
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript"
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      // {
      //   test: /\.svg$/,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[name].[ext]',
      //         outputPath: 'assets/'
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              typescript: true,
            }
          },
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/'
            }
          }
        ]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "renderer", "windows", "main", "index.html"),
      filename: "index.html",
      chunks: ["main"]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "renderer", "windows", "overlay", "index.html"),
      filename: "overlay.html",
      chunks: ["overlay"]
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist/renderer"),
    },
    port: 3000,
    hot: true,
    liveReload: true,
    devMiddleware: {
      writeToDisk: true,
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      '@components': path.resolve(__dirname, 'src/renderer/components'),
      '@styles': path.resolve(__dirname, 'src/renderer/styles'),
      '@windows': path.resolve(__dirname, 'src/renderer/windows'),
      '@hooks': path.resolve(__dirname, 'src/renderer/hooks'),
      '@assets': path.resolve(__dirname, 'src/renderer/assets'),
      '@utils': path.resolve(__dirname, 'src/renderer/utils'),
      '@stores': path.resolve(__dirname, 'src/renderer/stores'),
    }
  }
};