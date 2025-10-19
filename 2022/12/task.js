const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false,
});

function Node(x, y, parent = null) {
  this.x = x;
  this.y = y;
  this.parent = parent;
}

const directions = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

const grid = [];

function parse(line) {
  grid.push(line.split(''));
}

function findMarkers(char, replacement = '') {
  const cells = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === char) {
        cells.push([row, col]);
        if (replacement) {
          grid[row][col] = replacement;
        }
      }
    }
  }
  return cells;
}

function isAccessible(from, to) {
  let currChar = grid[from.x][from.y];
  let nextChar = grid[to.x][to.y];
  return nextChar.charCodeAt(0) - currChar.charCodeAt(0) <= 1;
}

function bfs(fromXY, toXY, testCellFn) {
  const queue = [];
  const visited = new Set();
  const root = new Node(fromXY[0], fromXY[1], null, true);

  visited.add(fromXY.join(':'));
  queue.push(root);

  while (queue.length) {
    let n = queue.shift();
    if (n.x === toXY[0] && n.y === toXY[1]) {
      return n;
    }

    for (let d = 0; d < directions.length; d++) {
      const newX = n.x + directions[d].x;
      const newY = n.y + directions[d].y;
      if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length) {
        if (!visited.has(`${newX}:${newY}`) && testCellFn(n, { x: newX, y: newY }, visited)) {
          const next = new Node(newX, newY, n, true);
          queue.push(next);
          visited.add(`${newX}:${newY}`);
        }
      }
    }
  }
}

function getShortestPath(starts, end) {
  const getPathSize = (node) => {
    let pathLength = 0;
    while (node.parent) {
      pathLength += 1;
      node = node.parent;
    }
    return pathLength;
  };

  const paths = [];
  for (let startPos in starts) {
    let found = bfs(starts[startPos], end, isAccessible);
    if (found) {
      paths.push(getPathSize(found));
    }
  }
  return Math.min(...paths);
}

file.on('line', parse);
file.on('close', () => {
  console.log('Happy Holidays: Day 12!');

  console.group(`Part 1:`);
  let start = findMarkers('S', 'a');
  let end = findMarkers('E', 'z')[0];
  let answer = getShortestPath(start, end);
  console.log('Shortest path: ', answer);
  console.groupEnd();

  console.group(`Part 2:`);
  let aIndexes = findMarkers('a'); // includes S from part 1 (replaced)
  // end index already determined in part 1
  let answer2 = getShortestPath(aIndexes, end);
  console.log('Shortest path: ', answer2);
  console.groupEnd();

  process.exit(0);
});
