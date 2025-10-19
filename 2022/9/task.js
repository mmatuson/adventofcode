const fs = require('fs');
const readline = require('readline');

// Creating a readable stream from file
// readline module reads line by line
// but from a readable stream only.
const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false,
});

//const stream = fs.createWriteStream('out.txt', { flags: 'a' })
//const DEBUG_MODE = true;

const START = [150, 150];
const SIZE = 10;

const knots = new Array(SIZE).fill(0).map(() => [...START]);

let tailVisits = new Set();
tailVisits.add(START.join(':'));

// way too much data!
// function printKnots(){
//   const board = new Array(500).fill('.').map(() => new Array(500).fill('.'));
//   for (let i = 0; i< knots.length; i++){
//     let [x,y] = knots[i];
//     console.log(x,y)
//     board[x][y] = (i === 0) ? "H" : i;
//   }
//   for (row in board) {
//     let success = stream.write((board[row].join('') + '\n'));
//   }
// }

function move(marker, direction) {
  switch (direction) {
    case 'R':
      marker[1] += 1;
      break;
    case 'L':
      marker[1] -= 1;
      break;
    case 'U':
      marker[0] += 1;
      break;
    case 'D':
      marker[0] -= 1;
      break;
    default:
      throw Error('Invalid Direction found:', direction);
  }
  //printKnots();
}

function run(line) {
  const [direction, numSpaces] = line.split(' ');
  //printKnots();
  for (i = 0; i < Number(numSpaces); i++) {
    move(knots[0], direction);
    for (j = 0; j < knots.length - 1; j++) {
      let head = knots[j];
      let tail = knots[j + 1];
      const isTrueTail = knots[j + 1] === knots[knots.length - 1];

      // head has moved 2 away from tail
      if (Math.abs(head[0] - tail[0]) === 2 || Math.abs(head[1] - tail[1]) === 2) {
        // we're in the same row or column still
        if (head[0] === tail[0]) {
          tail[1] += head[1] - tail[1] > 0 ? 1 : -1;
        } else if (head[1] === tail[1]) {
          tail[0] += head[0] - tail[0] > 0 ? 1 : -1;
        } else {
          // move diagonal
          tail[0] += head[0] - tail[0] > 0 ? 1 : -1;
          tail[1] += head[1] - tail[1] > 0 ? 1 : -1;
        }
        if (isTrueTail) {
          tailVisits.add(tail.join(':'));
        }
      }
    }
  }
  //printKnots();
}

file.on('line', run);
file.on('close', () => {
  console.log('Happy Holidays: Day 9!');
  console.log('tail visited', tailVisits.size);
  //stream.end();
  process.exit(0);
});
