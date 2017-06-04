module.exports = function (wallaby) {
    return {
        files: [
            'Core/**',
            'Types/*.js',
            '*.js',
            'test/qs/**',
            'test/sample/**',
            'test/lib/QComponent4/src/*'

        ],

        tests: [
            'test/*.js'
        ],

        testFramework: 'mocha',
        setup: function (wallaby) {
            // wallaby.testFramework is jasmine/QUnit/mocha object
            wallaby.testFramework.ui('tdd');
        },
        env: {
            type: 'node'
        }
    };
};