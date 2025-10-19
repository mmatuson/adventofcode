const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false,
});

const PointMapping = {
  // Rock
  A: 1,
  X: 1,
  // Paper
  B: 2,
  Y: 2,
  // Scissors
  C: 3,
  Z: 3,
};

const Rules = {
  X: 'C',
  Z: 'B',
  Y: 'A',
};

const PointOutcome = {
  WIN: 6,
  DRAW: 3,
  LOSE: 0,
};

const gamePoints = [];
let currentGame = 0;

file.on('line', (line) => {
  [them, _space, us] = line.split('');
  // assign points for the shape we picked
  let points = PointMapping[us];

  // assign points for game outcome
  if (Rules[us] === them) {
    points += PointOutcome.WIN;
  } else if (points === PointMapping[them]) {
    points += PointOutcome.DRAW;
  } else {
    points += PointOutcome.LOSE;
  }

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
