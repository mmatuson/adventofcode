const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false,
});

const priorityList = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const dupesByPriority = [];
const dupesByElfGroup = [];
let buffer = [];
let possibleMatches = new Set();

function getPriority(char) {
  return priorityList.indexOf(char) + 1;
}

file.on('line', (line) => {
  // part 1
  const mid = line.length / 2;
  const left = line.slice(0, mid);
  const right = line.slice(mid);

  for (char in left) {
    if (right.includes(left[char])) {
      dupesByPriority.push(getPriority(left[char]));
      break;
    }
  }

  // part 2
  buffer.push(line);
  if (buffer.length === 3) {
    const one = new Set(buffer[0]);
    const two = new Set(buffer[1]);
    const three = new Set(buffer[2]);

    one.forEach((char) => {
      if (two.has(char)) {
        possibleMatches.add(char);
      }
    });

    possibleMatches.forEach((char) => {
      if (three.has(char)) {
        dupesByElfGroup.push(getPriority(char));
      }
    });

    buffer = [];
    possibleMatches = new Set();
  }
});

file.on('close', () => {
  console.log('Happy Holidays: Day 3!');

  console.group('part 1:');
  console.log(
    'Total Priority: ',
    dupesByPriority.reduce((total, i) => total + i)
  );
  console.groupEnd();

  console.group('part 2:');
  console.log(
    'Total Priority: ',
    dupesByElfGroup.reduce((total, i) => total + i)
  );
  console.groupEnd();

  process.exit(0);
});
