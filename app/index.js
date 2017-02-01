'use strict'
const { dialog } = require('electron').remote
const fs = require('fs');
const parser = require('csv').parse()

const holder = document.getElementById('holder')

const MAX_LINES = 100

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
    let header;
    const readStream = fs.createReadStream(fileName).pipe(parser)
    // fileStream.setEncoding('utf8');
    let lines = 1
    let files = 1
    let writeFile = fileName.replace(/(.*)\/.*(\.csv$)/i, `$1/${files}$2`)
    let writeStream = fs.createWriteStream(writeFile)
    readStream.on('data', function(data) {
      if (header == null) header = data
      if (lines > MAX_LINES) {
        writeStream.end();
        lines = 1
        files++
        let writeFile = fileName.replace(/(.*)\/.*(\.csv$)/i, `$1/${files}$2`)
        writeStream = fs.createWriteStream(writeFile)
        writeStream.write(header.toString()+'\n')
        // console.log(header);
        // console.log(data);
      }
      lines++
      writeStream.write(data.toString()+'\n')
      // console.log(lines)
    })

    readStream.on('end', function(data) {
      // writeStream.end()
    })
  })
}
