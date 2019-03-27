#!/usr/bin/env node

const commander = require('commander')
const packageInfo = require('./package.json')
const lib = require('./lib')

const fieldParser = fstr => fstr.split(',').map(f => f.trim())

commander
  .version(packageInfo.version)
  .option('-i, --input-directory <inputDirectory>', 'Directory location of XML files to parse')
  .option('-o, --output-path <outputPath>', 'Path to write output CSV')
  .option('-f, --fields <fields>', 'Comma delimited list of fields to include', fieldParser)
  .parse(process.argv)

const inputDirectory = commander.inputDirectory || './'
const outputPath = commander.outputPath || `mappings-${new Date().getTime()}.csv`
const fields = commander.fields

lib({
  inputDirectory,
  outputPath,
  fields
}).then(({ fileCount }) => {
  console.log(`Transformed ${fileCount} XML files from ${inputDirectory} into ${outputPath}`)
}).catch(err => {
  console.error(`Error: ${err.message}`)
})
