const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false,
});

const PACKET_MARKER_SIZE = 4;
const MESSAGE_MARKER_SIZE = 14;

function detectMarker(line, markerLength) {
  for (i = 0; i < line.length; i++) {
    sequence = line.substr(i, markerLength);
    if (new Set(sequence).size === markerLength) {
      return i + markerLength;
    }
  }
}

file.on('line', (line) => {
  console.group('Part 1:');
  console.log('Packet Marker: ', detectMarker(line, PACKET_MARKER_SIZE));
  console.groupEnd();

  console.group('Part 2:');
  console.log('Message Marker: ', detectMarker(line, MESSAGE_MARKER_SIZE));
  console.groupEnd();
});

file.on('close', () => {
  console.log('Happy Holidays: Day 6!');
  process.exit(0);
});
