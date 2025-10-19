const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false,
});

const grid = [];
// for debugging
//const visibleGrid = [];

let countVisible = 0;
let highestScenicScore = 0;

file.on('line', (line) => {
  grid.push(line.split('').map(Number));
  //visibleGrid.push(['x','x','x','x','x']);
});

function parseCol(grid, index) {
  let col = [];
  for (row in grid) {
    col.push(Number(grid[row][index]));
  }
  return col;
}

function isVisible(treeIndex, treeList) {
  if (treeIndex === 0 || treeIndex === treeList.length - 1) {
    return true;
  }

  if (Math.max(...treeList.slice(0, treeIndex)) < treeList[treeIndex]) {
    return true;
  }

  if (Math.max(...treeList.slice(treeIndex + 1, treeList.length)) < treeList[treeIndex]) {
    return true;
  }

  return false;
}

function getScenicScore(treeIndex, treeList) {
  const left = treeList.slice(0, treeIndex).reverse();
  const leftIndex = left.findIndex((i) => i >= treeList[treeIndex]);

  const right = treeList.slice(treeIndex + 1, treeList.length);
  const rightIndex = right.findIndex((i) => i >= treeList[treeIndex]);

  return [leftIndex === -1 ? left.length : +leftIndex + 1, rightIndex === -1 ? right.length : +rightIndex + 1];
}

file.on('close', () => {
  // for (x in grid) {
  //   console.log(grid[x]);
  // }

  // console.log('---');

  for (let i = 0; i < grid.length; i++) {
    let row = grid[i];
    for (let t = 0; t < row.length; t++) {
      let visible = isVisible(t, row);
      const [x1, x2] = getScenicScore(t, row);

      let col = parseCol(grid, t);
      const [y1, y2] = getScenicScore(i, col);

      visible = visible || isVisible(i, col);
      // debugging
      // visibleGrid[i][t] = (x1 * x2 * y1 * y2) //'*';

      const scenicScore = x1 * x2 * y1 * y2;
      if (scenicScore > highestScenicScore) {
        highestScenicScore = scenicScore;
      }

      if (visible) {
        countVisible += 1;
      }
    }
  }

  // for (x in visibleGrid) {
  //   console.log(visibleGrid[x]);
  // }
  console.log('Happy Holidays: Day 8!');

  console.group('Part 1:');
  console.log('Visible Trees', countVisible);
  console.groupEnd();

  console.log('Part 2:');
  console.log('Highest Scenic Score: ', highestScenicScore);
  console.groupEnd();

  process.exit(0);
});
