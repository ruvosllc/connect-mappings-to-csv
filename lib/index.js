const fs = require('fs-extra')
const Promise = require('bluebird')
const { parse } = require('json2csv')
const path = require('path')
const traverse = require('traverse')
const xml2js = require('xml2js')
const jsonToCsv = parse

module.exports = ({ inputDirectory, outputPath, fields }) => {
  let fileCount

  const xmlParser = new xml2js.Parser()
  const parseXml = Promise.promisify(xmlParser.parseString)

  return fs.readdir(inputDirectory)
    .then(filenames => {
      const filtered = filenames.filter(filename => /\.xml$/.exec(filename))
      fileCount = filtered.length
      return filtered
    })
    .then(xmlFilenames => Promise.map(xmlFilenames, xmlFilename => fs.readFile(path.join(inputDirectory, xmlFilename)).then(contents => parseXml(contents.toString()))))
    .then(jsonFiles => jsonFiles.map(json => traverse(json).reduce((agg, node) => {
      const { entry } = node
      if (entry) {
        agg = entry
      }
      return agg
    }, {})))
    .then(entrySets => entrySets.map(entrySet => entrySet.reduce((agg, entry) => {
      if (Array.isArray(entry.string)) {
        agg[entry.string[0]] = entry.string[1]
      } else {
        agg[entry.string] = Object.assign({}, entry, { string: undefined })
      }
      return agg
    }, {})))
    .then(entries => {
      if (!entries.length) {
        throw new Error('No mappings found.')
      }
      if (fields && fields.length) {
        return jsonToCsv(entries, { fields })
      }
      return jsonToCsv(entries)
    })
    .then(csv => fs.writeFile(outputPath, csv))
    .then(() => ({ fileCount }))
}
