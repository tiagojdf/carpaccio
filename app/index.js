'use strict'
const { dialog } = require('electron').remote
const fs = require('fs');

const holder = document.getElementById('holder')

let MAX_LINES
const maxLinesElement = document.getElementById('max-lines')

maxLinesElement.onchange = (e) => MAX_LINES = e.target.value

holder.ondragover = () => {
  return false;
}
holder.ondragleave = holder.ondragend = () => {
  return false;
}
holder.ondrop = (e) => {
  e.preventDefault()
  for (let f of e.dataTransfer.files) {
    splitFile(f.path)
  }
  return false;
}

document.getElementById('file-loader').addEventListener('click', openAndSplitFile)
function openAndSplitFile() {
  openFile()
  .then(splitFile)
}

function openFile() {
  return new Promise((resolve, reject) => {
    const config = {
      properties: ['openFile'],
      filters: [
        {
          name: 'csv',
          extensions: ['csv'],
        },
      ],
    }

    return dialog.showOpenDialog(config, function (fileName) {
      if (fileName == null) reject("You didn't save the file")

      resolve(fileName)
    })
  })
}

function splitFile(fileNames) {
  fileNames.forEach((fileName) => {
    const parser = require('csv').parse()

    let header;
    const readStream = fs.createReadStream(fileName).pipe(parser)
    let lines = 1
    let files = 1
    const now = new Date()
    let writeFile = generateFileName(fileName, files, now)

    let writeStream = fs.createWriteStream(writeFile)
    readStream.on('data', function(data) {
      if (header == null) header = data
      if (lines > MAX_LINES) {
        writeStream.end();
        lines = 1
        files++
        let writeFile = generateFileName(fileName, files, now)
        writeStream = fs.createWriteStream(writeFile)
        writeStream.write(header.toString()+'\n')
      }
      lines++
      writeStream.write(data.toString()+'\n')
    })

    readStream.on('end', function(data) {
      console.log('end');
    })
  })
}

function generateFileName(fileName, files, date) {
  const dateStamp = date.toLocaleString().replace(/,| |\//g,'_')

  return fileName.replace(/(.*)\/(.*)(\.csv$)/i, `$1/$2${dateStamp}_${files}$3`)
}
