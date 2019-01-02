#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const _ = require('lodash')
const argv = require('named-argv')

const turfPackageJson = require('./package.json')

const templatedContentFiles = ['package.json', 'webpack.config.js', 'main.js']
const ignoreInCopy = [...templatedContentFiles, 'npmrc']

let appName = path.dirname(process.cwd()).split(path.sep).pop()
let destDir = process.cwd()

if (argv.params.length > 0) {
    appName = argv.params[0]
    destDir = path.join(process.cwd(), appName)
}

const djangoAppName = path.dirname(path.dirname(destDir)).split(path.sep).pop()

try {
    console.log(`
    Generating configs for ${appName}...
    `)

    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir)
    }

    // special case for .npmrc file as they are not published
    fs.copySync(path.join(__dirname, 'template', 'npmrc'), path.join(destDir, '.npmrc'), {
        overwrite: false,
    })

    templatedContentFiles.forEach((fileName) => {
        const destFile = path.join(destDir, fileName)

        if (fs.existsSync(destFile)) {
            console.log(chalk.yellow(`${fileName} exists in destination folder, skipping`))
        } else {
            const templateFile = path.join(__dirname, 'template', fileName)
            const compiled = _.template(fs.readFileSync(templateFile))
            fs.writeFileSync(destFile, compiled({
                name: appName, 
                turfVersion: turfPackageJson.version,
                djangoApp: djangoAppName,
            }))
        }
    })
    
    fs.copySync(path.join(__dirname, 'template'), destDir, {
        overwrite: false,
        filter: (src, dest) => !ignoreInCopy.includes(src.split(path.sep).pop())
    })

    console.log(`
    ${chalk.green('Default configs written to root directory.')}
    Please note that files are not overwritten.
    if you have existing configs you want to replace, you will need to delete them, and run again
    or manually update them with additional configs from create-turf-app
    
    #############
    To begin:
    
    cd ${appName}
    npm install
    npm run watch`)
} catch (err) {
    console.log(chalk.red('Problem generating configs'))
    console.log(chalk.red(err))
}