const isDevelopment = process.env.NODE_ENV !== 'production';
module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
        isDevelopment && 'react-refresh/babel',
        [
            'import',
            {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true
            }
        ]
    ].filter(Boolean)
};
