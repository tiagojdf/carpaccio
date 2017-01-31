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
    console.log(f);
    let header;
    const fileStream = fs.createReadStream(f.path).pipe(parser)
    // const fileStream = fs.createWriteStream(f.path).pipe(parser)
    // fileStream.setEncoding('utf8');
    let lines = 1
    fileStream.on('data', function(data) {
      if (header == null) header = data
      if (lines > MAX_LINES) {
        lines = 1
        console.log(header);
        console.log(data);
      }
      lines++
      console.log(lines)
    })

    fileStream.on('end', function(data) {
      console.log('end');
    })
  }
  return false;
}
