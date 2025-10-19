const assert = require('assert');
const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false,
});

const MAX_SIZE = 100000;
const TOTAL_DISK_SIZE = 70000000;
const FREE_SPACE_REQUIRED = 30000000;

function Node(name, size = 0, parent = null) {
  this.name = name;
  this.size = size;
  this.children = [];
  this.parent = parent;

  this.getSize = () => this.size + this.children.reduce((total, n) => total + n.getSize(), 0);
  this.isDeletable = () => this.size === 0 && this.getSize() <= MAX_SIZE;
  this.isDirectory = () => this.size === 0;
}

function Tree() {
  const root = new Node('/');
  this.rootNode = root;
  this.currentNode = root;

  this.cd = (dirName) => {
    let node = this.currentNode;
    if (dirName === '/') {
      return;
    } else if (dirName === '..' && node.parent) {
      this.currentNode = node.parent;
    } else {
      const targetDir = node.children.find((n) => n.name === dirName && n.size === 0);
      assert(targetDir);
      this.currentNode = targetDir;
    }
  };

  this.mkdir = (dirName) => {
    const dir = new Node(dirName, 0, this.currentNode);
    this.currentNode.children.push(dir);
  };

  this.touch = (fileName, size) => {
    const file = new Node(fileName, size);
    this.currentNode.children.push(file);
  };

  this.totalSize = () => {
    return this.rootNode.getSize();
  };
}

function walk(node, callback = null, level = 0, debug = false) {
  if (callback) {
    callback(node);
  }
  const nextLevel = (level += 1);
  for (let i = 0; i < node.children.length; i++) {
    walk(node.children[i], callback, nextLevel);
  }
}

const fileTree = new Tree();

file.on('line', (line) => {
  // parse the directory structure
  const parts = line.split(' ');
  if (parts[0] === '$' && parts[1] === 'cd') {
    fileTree.cd(parts[2]);
  } else if (parts[0] === 'dir') {
    fileTree.mkdir(parts[1]);
  } else if (Number(parts[0])) {
    fileTree.touch(parts[1], Number(parts[0]));
  }
});

file.on('close', () => {
  console.log('Happy Holidays: Day 7!');

  // Part 1: Find the total size of all deletable directories
  let sizeOfDeletable = 0;
  walk(fileTree.rootNode, (n) => {
    if (n.isDeletable()) {
      sizeOfDeletable += n.getSize();
    }
  });
  console.group('Part 1:');
  console.log('sizeOfDeletable', sizeOfDeletable);
  console.groupEnd();

  // Part 2: Find the smallest directory size you can delete
  //  to have enough space (FREE_SPACE_REQUIRED) to run an update
  const freeSpaceNeeded = FREE_SPACE_REQUIRED - (TOTAL_DISK_SIZE - fileTree.totalSize());
  let minSpaceNeeded = FREE_SPACE_REQUIRED;
  walk(fileTree.rootNode, (n) => {
    if (n.isDirectory()) {
      ns = n.getSize();
      if (ns >= freeSpaceNeeded && ns < minSpaceNeeded) {
        minSpaceNeeded = ns;
      }
    }
  });
  console.group('Part 2:');
  console.log('Delete the Directory of size: ', minSpaceNeeded);
  console.groupEnd();

  process.exit(0);
});
