const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false,
});

let subsetCount = 0;
let overlaps = 0;

file.on('line', (line) => {
  const [a, b] = line.split(',');
  let aRange = a.split('-').map(Number);
  let bRange = b.split('-').map(Number);
  const [aStart, aEnd] = aRange;
  const [bStart, bEnd] = bRange;

  if (bStart <= aEnd && bEnd >= aStart) {
    overlaps++;
  }

  if (aStart >= bStart && aEnd <= bEnd) {
    console.log(bStart, a, bEnd);
    subsetCount++;
  } else if (bStart >= aStart && bEnd <= aEnd) {
    console.log(aStart, b, aEnd);
    subsetCount++;
  }
});

file.on('close', () => {
  console.log('Happy Holidays: Day 4!');

  console.group('Part 1:');
  console.log('Subsets found: ', subsetCount);
  console.groupEnd();

  console.group('Part 2:');
  console.log('overlaps found: ', overlaps);
  console.groupEnd();

  process.exit(0);
});
