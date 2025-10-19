const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false,
});

const elves = [];
let currentElf = 0;
let currentCalories = 0;

file.on('line', (line) => {
  if (line.trim() === '') {
    elves[currentElf] = currentCalories;
    currentElf++;
    currentCalories = 0;
    return;
  }
  currentCalories = currentCalories + Number(line);
});

file.on('close', () => {
  const top3 = elves.sort().slice(-3);
  const sum = top3.reduce((total, i) => total + i);
  const numberOfElves = elves.length;

  console.log('Happy Holidays: Day 1!');
  console.log('Elf with the most calories', elves[elves.length - 1]);
  console.log('Top 3 elf calories', sum);
  process.exit(0);
});
