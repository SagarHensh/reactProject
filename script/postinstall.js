var fs = require('fs');

const replaced1 = `resolve: {`;
const replacement1 = `resolve: {
    fallback: {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify")
      },
      `;

const replaced2 = `new webpack.DefinePlugin(env.stringified),`;
const replacement2 = `new webpack.DefinePlugin(env.stringified),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
            `;

const files = [
    'node_modules/react-scripts/config/webpack.config.js',
];

files.forEach(file => {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        var result = data.replace(new RegExp(replaced1, 'g'), replacement1);
        var result2 = result.replace(new RegExp(replaced2, 'g'), replacement2);
        fs.writeFile(file, result2, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
});