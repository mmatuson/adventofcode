const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false,
});

let registerX = 1;
let cycle = 0;

const strengthMeter = {
  20: 0,
  60: 0,
  100: 0,
  140: 0,
  180: 0,
  220: 0,
};

const CRT_WIDTH = 40;
const CRT_HEIGHT = 6;
const CRT = new Array(CRT_HEIGHT).fill('.').map(() => new Array(CRT_WIDTH).fill('.'));

function tickCycle() {
  cycle += 1;

  if (cycle in strengthMeter) {
    strengthMeter[cycle] = cycle * registerX;
  }

  const row = Math.floor((cycle - 1) / CRT_WIDTH);
  const index = cycle - 1 - row * CRT_WIDTH;
  const pixel = [registerX - 1, registerX, registerX + 1].includes(index) ? '#' : '.';
  CRT[row][index] = pixel;
}

function updateRegister(value) {
  registerX += Number(value);
}

function printCRT() {
  for (row in CRT) {
    console.log(CRT[row].join(''));
  }
}

function execute(line) {
  const [op, value] = line.split(' ');
  if (op === 'noop') {
    tickCycle();
  } else if (op === 'addx') {
    tickCycle();
    tickCycle();
    updateRegister(value);
  }
}

file.on('line', execute);
file.on('close', () => {
  console.log('Happy Holidays: Day 10!');
  console.group('Part 1:');
  console.log(
    'Sum of Signal Strengths',
    Object.values(strengthMeter).reduce((total, i) => (total += i), 0)
  );
  console.groupEnd();
  console.group('Part 2:');
  printCRT();
  console.groupEnd();
  process.exit(0);
});
