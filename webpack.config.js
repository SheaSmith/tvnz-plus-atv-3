var path = require('path');

module.exports = {
    entry: {
        app : { import: './src/app.ts', filename: '[name].js' },
        'profile-page': {import: './src/pages/profile-page/profile-page.ts', filename: '[name].js', library: {name: 'profilePage', type: 'var'}},
        'main-menu': {import: './src/pages/main-menu/main-menu.ts', filename: '[name].js', library: {name: 'mainMenu', type: 'var'}},
        'hero-component': {import: './src/components/hero-component/hero-component.ts', filename: '[name].js', library: {name: 'heroComponent', type: 'var'}},
        'featured-content-component': {import: './src/components/featured-content-component/featured-content-component.ts', filename: '[name].js', library: {name: 'featuredContent', type: 'var'}},
        'generic-page': {import: './src/pages/generic-page/generic-page.ts', filename: '[name].js', library: {name: 'genericPage', type: 'var'}},
        'episodes-page': {import: './src/pages/episodes-page/episodes-page.ts', filename: '[name].js', library: {name: 'episodesPage', type: 'var'}},
        'profile-type': {import: './src/pages/profile-create-edit/profile-type/profile-type.ts', filename: '[name].js', library: {name: 'profileType', type: 'var'}},
        'profile-kids-pg': {import: './src/pages/profile-create-edit/profile-kids-pg/profile-kids-pg.ts', filename: '[name].js', library: {name: 'profileKidsPg', type: 'var'}},
        'profile-image': {import: './src/pages/profile-create-edit/profile-image/profile-image.ts', filename: '[name].js', library: {name: 'profileImage', type: 'var'}},
        'profile-gender': {import: './src/pages/profile-create-edit/profile-gender/profile-gender.ts', filename: '[name].js', library: {name: 'profileGender', type: 'var'}},
        'profile-edit': {import: './src/pages/profile-create-edit/profile-edit/profile-edit.ts', filename: '[name].js', library: {name: 'profileEdit', type: 'var'}},
        'profile-delete': {import: './src/pages/profile-create-edit/profile-delete/profile-delete.ts', filename: '[name].js', library: {name: 'profileDelete', type: 'var'}},
        'search-results': {import: './src/pages/search-results-page/search-results-page.ts', filename: '[name].js', library: {name: 'searchResults', type: 'var'}},
    },
    output: {
        path: path.join(__dirname, 'dist2'),
        environment: {
            arrowFunction: false,
            bigIntLiteral: false,
            const: false,
            destructuring: false,
            dynamicImport: false,
            forOf: false,
            module: false,
        },
        iife: false,
    },
    optimization: {
        minimize: false
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js'
        }
    },
    target: ["web", "es5"],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        useBuiltIns: "entry",
                                        corejs: 3,
                                        modules: false,
                                    }
                                ]
                            ],
                            plugins: [
                                "@babel/plugin-transform-runtime"
                            ]
                        }
                    },
                    {
                        loader: 'ts-loader'
                    }
                ],
                sideEffects: true
            },
            {
                test: /\.xml$/i,
                use: 'raw-loader'
            }
        ]
    }
};
