const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false,
});

const ROUNDS = 10000;

const modValues = [];
let mod = 0;

class Monkey {
  constructor() {
    this.friends = [];
    this.items = [];
    this.opFn = null;
    this.testFn = null;
    this.inspectCount = 0;
  }

  addFriend(friend) {
    this.friends.push(friend);
  }

  addItems(newItems) {
    this.items = this.items.concat(newItems);
  }

  setOpFn(op, rVal) {
    this.opFn = (a) => {
      let b = rVal === 'old' ? a : Number(rVal);
      switch (op) {
        case '+':
          return a + b;
        case '*':
          return a * b;
        default:
          throw Error('Invalid op', op);
      }
    };
  }

  setTestFn(val) {
    this.testFn = (old) => {
      return old % Number(val) === 0;
    };
  }

  *play() {
    let item = this.items.shift();
    while (item) {
      // part 1
      // const newItem = Math.floor(this.opFn(item) / 3);
      // part 2
      const newItem = this.opFn(item) % mod;
      this.inspectCount += 1;
      yield [newItem, this.testFn(newItem) ? this.friends[0] : this.friends[1]];

      item = this.items.shift();
    }
  }
}

const BunchOfMonkeys = [];

function parse(line) {
  const currentMonkey = BunchOfMonkeys[BunchOfMonkeys.length - 1];

  let data = line
    .split(' ')
    .map((x) => x.trim())
    .filter((i) => i.length > 0);

  if (data[0] === 'Monkey') {
    BunchOfMonkeys.push(new Monkey());
  }

  if (data[0] === 'Starting') {
    currentMonkey.addItems(data.slice(2).map((v) => parseInt(v, 10)));
  }

  if (data[0] === 'Operation:') {
    currentMonkey.setOpFn(data[data.length - 2], data[data.length - 1]);
  }

  if (data[0] === 'Test:') {
    m = data[data.length - 1];
    currentMonkey.setTestFn(m);
    // tracking for part 2
    modValues.push(m);
  }
  if (data[0] === 'If') {
    currentMonkey.addFriend(Number(data[data.length - 1]));
  }
}

file.on('line', parse);
file.on('close', () => {
  // part 2: find the product of the monkeys mod values
  mod = modValues.reduce((total, i) => total * i);

  for (let round = 0; round < ROUNDS; round++) {
    for (let monkey in BunchOfMonkeys) {
      let game = BunchOfMonkeys[monkey].play().next();
      while (!game.done) {
        let [item, friend] = game.value;
        if (item) {
          BunchOfMonkeys[friend].addItems([item]);
        }
        game = BunchOfMonkeys[monkey].play().next();
      }
    }
  }

  console.log('Happy Holidays: Day 11!');
  console.group(`After ${ROUNDS} rounds:`);
  for (let monkey in BunchOfMonkeys) {
    console.log(`Monkey ${monkey} inspected items N times: `, BunchOfMonkeys[monkey].inspectCount);
  }
  console.groupEnd();
  const inspections = BunchOfMonkeys.map((m) => m.inspectCount);
  const top1 = Math.max(...inspections);
  const top2 = Math.max(...inspections.filter((i) => i !== top1));
  console.log('The level of monkey business: ', top1 * top2);
  console.groupEnd();
  process.exit(0);
});
