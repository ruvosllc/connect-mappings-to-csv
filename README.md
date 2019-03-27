# connect-mappings-to-csv

> Transform Mirth/NextGen Connect message mapping XML files to a single CSV.


## Install

```
$ npm install -g https://gitlab.ruvos.com/paul.anderson/connect-mappings-to-csv
```


## Usage

```
Usage: connect-mappings-to-csv [options]

Options:
  -V, --version                           output the version number
  -i, --input-directory <inputDirectory>  Directory location of XML files to parse
  -o, --output-path <outputPath>          Path to write output CSV
  -f, --fields <fields>                   Comma delimited list of fields to include
  -h, --help                              output usage information

```

## Defaults

`inputDirectory` defaults to `./`
`outputPath` defaults to `mappings-<timestamp>.csv`
`fields` defaults to all


## Example Usage
1. From the Mirth/NextGen Connect dashboard view of a channel, `Export Results` and set the `Content` to `Source Map`, `Channel Map`, etc. Export to `/exampleLocation` and ensure the file extensions will be `.xml`.
2. `connect-mappings-to-csv -i /exampleLocation -o out.csv -f fieldOne,fieldFive`
3. `out.csv` will contain a comma delimited set of `fieldOne` and `fieldFive` mappings
