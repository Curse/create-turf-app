# @turf/create-turf-app

[Internal NPM Link](http://npm.curse.us/#/detail/@turf/create-turf-app)

Base build configs for sports team front-end apps within the default django workflow.

**It is intended that apps made with this workflow are organised within a django app `static_src` directory, many config options are specifically catered to this, and will break in other situations**

It is recomended to set your version to a static release of this on your apps to prevent regressions, updates to these scripts can be added to apps using it by adjusting the required version in your own `package.json` and running `npm i`. Or by `npm install --save @turf/create-turf-app@[version-numebr]`

# Automated setup

This requires @turf/create-turf-app to be installed globally, or within your current npm scope (allowing @turf/create-turf-app to create sub-apps for example) 

At your project folder:

```bash
# make new sub app
~/> npx create-turf-app [new-app-name]

# turn existing directoy into app
~/[app-folder]> npx create-turf-app
```

Then just `cd` to the app directory to install dependancies and run a build

```bash
~/[app-folder]> npm install
~/[app-folder]> npm run build
```

## Existing files

`create-turf-app` will not replace existing files, if may run a setup on a non-empty directory, but existing files that conflict with turf configs will remain and may not work as intended. You can always delete existing config files and re-run `create-turf-app`

# Manual setup

## NPM

To enable the use of the curse CDN

At your project level `.npmrc`

```
; Set a new registry for a scoped package
@node:registry=http://npm.curse.us
@turf:registry=http://npm.curse.us
@muthead:registry=http://npm.curse.us
@futhead:registry=http://npm.curse.us
```

## ESLint

At your project level `.eslintrc.js`

```javascript
    const createTurfApp = require('@turf/create-turf-app/')

    module.exports = {
        ...createTurfApp.eslintConfig,
        // your overrides here
    }
```


## webpack config

At your project level `webpack.config.js`

```javascript
    const createTurfApp = require('@turf/create-turf-app/')

    module.exports = createTurfApp.makeWebpackConfig({
        // Default values shown
        entry = './main.js',
        distPath: '../static/[your-app-name]/dist',
        publicPath: '[your-app-name]/dist',
        overrides = {
            // these will be merged with the base config
        }
    })
```

Webpack can then be called normally, and the shared config will be used


## PostCss

At your project level `postcss.config.js`

```javascript
    const createTurfApp = require('@turf/create-turf-app/')
    module.exports = {
        ...createTurfApp.postcssConfig,
        // your overrides here
    }
```