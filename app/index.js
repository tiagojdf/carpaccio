'use strict'
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
    let header;
    const readStream = fs.createReadStream(f.path).pipe(parser)
    // fileStream.setEncoding('utf8');
    let lines = 1
    let files = 1
    let writeStream = fs.createWriteStream(f.path.replace(f.name, `${files}.csv`))
    readStream.on('data', function(data) {
      if (header == null) header = data
      if (lines > MAX_LINES) {
        writeStream.end();
        lines = 1
        files++
        writeStream = fs.createWriteStream(f.path.replace(f.name, `${files}.csv`))
        writeStream.write(header.toString()+'\n')
        // console.log(header);
        // console.log(data);
      }
      lines++
      writeStream.write(data.toString()+'\n')
      // console.log(lines)
    })

    readStream.on('end', function(data) {
      console.log('end');
    })
  }
  return false;
}
