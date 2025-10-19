const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false,
});

const Rules = {
  A: {
    Z: 'B',
    X: 'C',
    Y: 'A',
  },
  B: {
    Z: 'C',
    X: 'A',
    Y: 'B',
  },
  C: {
    Z: 'A',
    X: 'B',
    Y: 'C',
  },
};

const PointsPerShape = {
  A: 1, // Rock
  B: 2, // Paper
  C: 3, // Scissors
};

const PointsPerGameOutcome = {
  Z: 6, // win
  Y: 3, // draw
  X: 0, // lose
};

const gamePoints = [];
let currentGame = 0;

file.on('line', (line) => {
  [them, _space, targetOutcome] = line.split('');
  // assign points for the shape we picked
  const us = Rules[them][targetOutcome];
  let points = PointsPerShape[us] + PointsPerGameOutcome[targetOutcome];
  gamePoints[currentGame] = points;
  currentGame++;
});

file.on('close', () => {
  console.log('Happy Holidays: Day 2!');
  console.log(
    'Total score across all games',
    gamePoints.reduce((total, curr) => total + curr)
  );
  process.exit(0);
});
