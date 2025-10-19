const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false,
});

const stacks = [];

function isCrateLine(line) {
  return line.startsWith('   ') || line.startsWith('[');
}

function isInstructionLine(line) {
  return line.startsWith('move');
}

function parseInstruction(line) {
  // example: move 7 from 6 to 8
  const [_m, numItems, _f, from, _t, to] = line.split(' ');
  return {
    numItems: Number(numItems),
    from: Number(from),
    to: Number(to),
  };
}

file.on('line', (line) => {
  if (isCrateLine(line)) {
    for (i = 0; i < line.length; i = i + 4) {
      const col = line.slice(i, i + 3);
      const currStack = i / 4;
      if (col.trim()) {
        if (!stacks[currStack]) {
          stacks[currStack] = [col[1]];
        } else {
          stacks[currStack].unshift(col[1]);
        }
      }
    }
  } else if (isInstructionLine(line)) {
    const instruction = parseInstruction(line);
    // part 1: move count from stack to stack one at a time
    // for (i = 0; i < instruction.numItems; i++){
    //   const item = stacks[instruction.from - 1].pop();
    //   stacks[instruction.to - 1].push(item);
    // }

    // part 2: move count from stack in one move
    const currentStack = stacks[instruction.from - 1];
    const items = currentStack.splice(currentStack.length - instruction.numItems, instruction.numItems);
    stacks[instruction.to - 1].push(...items);
  }
});

file.on('close', () => {
  const tops = stacks.map((stack) => stack[stack.length - 1]);
  console.log('Happy Holidays: Day 5!');

  console.log('Crates on the top of each stack: ', tops.join(''));
  process.exit(0);
});
