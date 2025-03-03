//const fs = require('fs');
class Grid {
  constructor(code) {
    this.sidelength = 1; // length of one side
    this.length = 1; //length the whole grid of this size
    this.space = 1; //space left for the program after drection pieces
    this.gridSizeReserver = 0; //minimum index needed to be occupied to maintain size

    let x;
    for (x = 1; this.space < code.length; x++) {
      // Calculate grid size
      //console.log(`x:${x} sidelength:${this.sidelength} length:${this.length} space:${this.space} gridSizeReserver:${this.gridSizeReserver}`);
      this.gridSizeReserver = this.length;
      this.space = 3 * x * x - x + 5;
      this.length = 3 * x * (x + 1) + 1;
      this.sidelength++;
    }
    console.log(
      `x:${x} sidelength:${this.sidelength} length:${this.length} space:${this.space} gridSizeReserver:${this.gridSizeReserver}`
    );
  }
}

class GridFull {
  constructor(code) {
    this.sidelength = 1; // length of one side
    this.length = 1; //length the whole grid of this size
    this.space = 1; //space left for the program after drection pieces
    this.gridSizeReserver = 0; //minimum index needed to be occupied to maintain size

    let x;
    for (x = 1; this.length < code.length; x++) {
      // Calculate grid size
      //console.log(`x:${x} sidelength:${this.sidelength} length:${this.length} space:${this.space} gridSizeReserver:${this.gridSizeReserver}`);
      this.gridSizeReserver = this.length;
      this.space = 3 * x * x - x + 5;
      this.length = 3 * x * (x + 1) + 1;
      this.sidelength++;
    }
    console.log(
      `x:${x} sidelength:${this.sidelength} length:${this.length} space:${this.space} gridSizeReserver:${this.gridSizeReserver}`
    );
  }
}

function pack(codeInput) {
  let input = codeInput.trim();

  // Convert input into a straight line of hexagony code
  let code = "";
  const inputArray = input.split("");
  const KEYCHARS = " \t\n0123456789()+-*:%~,.?;!$_|/\\<>[]#{}\"'=^&`@";

  for (let x = 0; x < inputArray.length; x++) {
    let count = 1;
    while (
      x + count < inputArray.length &&
      inputArray[x] === inputArray[x + count]
    ) {
      count++;
    }

    let charToPrint = inputArray[x];
    const tempString = charToPrint;
    const bytes = new TextEncoder().encode(tempString);
    //Buffer.from(tempString, 'utf8');

    if (bytes.length > 1) {
      for (const byte of bytes) {
        code += String.fromCharCode(byte + 256) + ";";
      }
    } else {
      if (KEYCHARS.includes(inputArray[x])) {
        charToPrint = String.fromCharCode(charToPrint.charCodeAt(0) + 256);
      }

      if (x > 0) {
        if (
          inputArray[x].charCodeAt(0) ===
          inputArray[x - 1].charCodeAt(0) + 1
        ) {
          charToPrint = ")";
        }
        if (
          inputArray[x].charCodeAt(0) ===
          inputArray[x - 1].charCodeAt(0) - 1
        ) {
          charToPrint = "(";
        }
      }

      code += charToPrint + ";".repeat(count);
    }
    x += count - 1;
  }
  code += "@";
  console.log(code);
  return lineToHex(code);
}

function lineToHex(code) {
  let grid = new Grid(code);

  // Create and fill the grid
  const outString = new Array(grid.length).fill("E");
  outString[grid.gridSizeReserver] = "G";

  console.log(outString.join(""));

  // Add zigzag commands to output
  let index = 1;
  let i;
  for (i = grid.sidelength; i < grid.sidelength * 2 - 2; i++) {
    index += i;
    if (i % 2 === 0) {
      outString[index - 1] = ">";
      outString[index + i - 1] = "/";
    } else {
      outString[index - 1] = "\\";
      outString[index + i - 1] = "<";
    }
  }
  index += i;
  const middleRowIndex = index - 1;

  outString[index + i - 1] = "/";

  for (i++; i > grid.sidelength; i--) {
    index += i;
    if ((grid.sidelength + i) % 2 === 0) {
      outString[index - 1] = "/";
      outString[index + i - 3] = "<";
    } else {
      outString[index - 1] = ">";
      outString[index + i - 3] = "\\";
    }
  }

  console.log(outString.join(""));
  let indexArray = getCodeIndexes(grid);

  for (let x = 0; x < grid.length; x++) {
    if (indexArray[x] >= 0 && code.charAt(indexArray[x]) != "") {
      outString[x] = code.charAt(indexArray[x]);
    }
  }
  console.log(outString.join(""));

  return outString.join("");
}

function hexToLine(code) {
  let grid = new GridFull(code);
  let indexArray = getCodeIndexes(grid);

  out = "";
  for (let x = 0; x < grid.length; x++) {
    if (indexArray.indexOf(x) >= 0) {
      out += code.charAt(indexArray.indexOf(x));
    }
  }
  return out;
}

function getCodeIndexes(grid) {
  let codeIndex = 0;
  let index = 0;
  const codeIndexes = new Array(grid.length).fill(-1);

  for (; index < grid.sidelength; index++) {
    codeIndexes[index] = codeIndex++;
  }

  let middleRowIndex =
    ((grid.sidelength - 1) * (3 * (grid.sidelength - 1) + 1)) / 2;
  index = middleRowIndex;

  codeIndexes[index++] = codeIndex++;

  let direction = 1; // 1=right, -1=left

  for (x = 0; x < grid.sidelength - 1; x++) {
    for (let j = 0; j < grid.sidelength * 2 - 3 - x; j++) {
      if (codeIndex < grid.length && index > grid.sidelength) {
        codeIndexes[index] = codeIndex++;
      }

      index += direction;
    }

    if (direction === 1) {
      index -= grid.sidelength * 2 - x;
    } else {
      index -= grid.sidelength * 2 - 3 - x;
    }
    direction *= -1;
  }

  if (direction === 1) {
    index += grid.sidelength * 2 - x - 2;
  } else {
    index += grid.sidelength * 2 - x + 1;
  }
  direction *= -1;

  if (codeIndex < grid.length) {
    codeIndexes[index] = codeIndex++;
  }

  if (direction === 1) {
    index = middleRowIndex + grid.sidelength * 2 - 1;
  } else {
    index = middleRowIndex + grid.sidelength * 4 - 4;
  }
  if (codeIndex < grid.length) {
    codeIndexes[index] = codeIndex++;
  }
  index += direction;

  for (x = 1; x < grid.sidelength; x++) {
    for (let j = 0; j < grid.sidelength * 2 - 3 - x; j++) {
      if (codeIndex < grid.length && index < grid.length) {
        codeIndexes[index] = codeIndex++;
      }
      index += direction;
    }
    if (direction === 1) {
      index += grid.sidelength * 2 - 3 - x;
    } else {
      index += grid.sidelength * 2 - x;
    }
    direction *= -1;
  }

  codeIndexes[grid.length - 1] = codeIndex++;

  console.log(codeIndexes.join(","));
  return codeIndexes;
}
