const xmlParser = require('xml2json')
const fs = require('fs-extra')
const Promise = require('bluebird')
const { parse } = require('json2csv')

const jsonToCsv = parse

const fields = [
  'AIMSPlatformEmail',
  'AIMSPlatformFilename'
]

const outputPath = './out.csv'

let fileCount

fs.readdir('./')
  .then(filenames => {
    const filtered = filenames.filter(filename => /\.xml$/.exec(filename))
    fileCount = filtered.length
    return filtered
  })
  .then(xmlFilenames => Promise.map(xmlFilenames, xmlFilename => fs.readFile(xmlFilename)))
  .then(xmlFiles => xmlFiles.map(xmlFile => xmlParser.toJson(xmlFile, { object: true })))
  .then(jsonFiles => jsonFiles.map(json => json['java.util.Collections_-UnmodifiableMap'].m.entry.reduce((agg, entry) => {
    if (Array.isArray(entry.string)) {
      agg[entry.string[0]] = entry.string[1]
    } else {
      agg[entry.string] = Object.assign({}, entry, { string: undefined })
    }
    return agg
  }, {})))
  .then(entries => jsonToCsv(entries, { fields }))
  .then(csv => fs.writeFile(outputPath, csv))
  .then(() => {
    console.log(`Transformed ${fileCount} XML files into ${outputPath}`)
  })
