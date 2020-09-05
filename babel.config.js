module.exports = {
    presets: ['@babel/env'],
    plugins: [
        '@babel/proposal-do-expressions', ['@babel/proposal-decorators',
            { decoratorsBeforeExport: true }
        ],
        ['@babel/proposal-class-properties', { loose: true }]
    ]
};