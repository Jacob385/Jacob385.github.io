//const fs = require('fs');

function pack(codeInput) {
  let input = codeInput.trim();
  


  // Convert input into a straight line of hexagony code
  let code = "";
  const inputArray = input.split('');
  const KEYCHARS = " \t\n0123456789()+-*:%~,.?;!$_|/\\<>[]#{}\"\'=^&`@";

  for (let x = 0; x < inputArray.length; x++) {
    let count = 1;
    while (x + count < inputArray.length && inputArray[x] === inputArray[x + count]) {
      count++;
    }

    let charToPrint = inputArray[x];
    const tempString = charToPrint;
    const bytes =  new TextEncoder().encode(tempString);
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
        if (inputArray[x].charCodeAt(0) === inputArray[x - 1].charCodeAt(0) + 1) {
          charToPrint = ')';
        }
        if (inputArray[x].charCodeAt(0) === inputArray[x - 1].charCodeAt(0) - 1) {
          charToPrint = '(';
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

function lineToHex(code){
  // Calculate grid size
  let sidelength = 1;
  let length = 1;
  let space = 1;
  let gridSizeReserver = 0;
  let x;

  for (x = 1; space < code.length; x++) {
    console.log(`x:${x} sidelength:${sidelength} length:${length} space:${space} gridSizeReserver:${gridSizeReserver}`);
    gridSizeReserver = length;
    space = 3 * x * x - x + 5;
    length = 3 * x * (x + 1) + 1;
    sidelength++;
  }

  console.log(`x:${x} sidelength:${sidelength} length:${length} space:${space} gridSizeReserver:${gridSizeReserver}`);

  // Create and fill the grid
  const outString = new Array(length).fill('E');
  outString[gridSizeReserver] = 'G';

  console.log("/////////////");
  console.log(outString.join(''));

  // Add zigzag commands to output
  let index = 1;
  let i;
  for (i = sidelength; i < sidelength * 2 - 2; i++) {
    index += i;
    if (i % 2 === 0) {
      outString[index - 1] = '>';
      outString[index + i - 1] = '/';
    } else {
      outString[index - 1] = '\\';
      outString[index + i - 1] = '<';
    }
  }
  index += i;
  const middleRowIndex = index - 1;
  outString[index + i - 1] = '/';

  console.log("I: " + i);
  for (i++; i > sidelength; i--) {
    index += i;
    if ((sidelength + i) % 2 === 0) {
      outString[index - 1] = '/';
      outString[index + i - 3] = '<';
    } else {
      outString[index - 1] = '>';
      outString[index + i - 3] = '\\';
    }
  }

  console.log(outString.join(''));

  // Insert string to grid
  let codeIndex = 0;
  for (index = 0; index < sidelength; index++) {
    outString[index] = code[codeIndex++];
  }
  index = middleRowIndex;
  outString[index++] = code[codeIndex++];

  let direction = 1; // 1=right, -1=left

  for (x = 0; x < sidelength - 1; x++) {
    for (let j = 0; j < sidelength * 2 - 3 - x; j++) {
      if (codeIndex < code.length && index > sidelength) {
        outString[index] = code[codeIndex++];
      }
      index += direction;
    }
    if (direction === 1) {
      index -= sidelength * 2 - x;
    } else {
      index -= sidelength * 2 - 3 - x;
    }
    direction *= -1;
  }

  if (direction === 1) {
    index += sidelength * 2 - x - 2;
  } else {
    index += sidelength * 2 - x + 1;
  }
  direction *= -1;

  console.log(outString.join(''));

  if (codeIndex < code.length) {
    outString[index] = code[codeIndex++];
  }

  if (direction === 1) {
    index = middleRowIndex + sidelength * 2 - 1;
  } else {
    index = middleRowIndex + sidelength * 4 - 4;
  }
  if (codeIndex < code.length) {
    outString[index] = code[codeIndex++];
  }
  index += direction;

  for (x = 1; x < sidelength; x++) {
    for (let j = 0; j < sidelength * 2 - 3 - x; j++) {
      if (codeIndex < code.length && index < outString.length) {
        outString[index] = code[codeIndex++];
      }
      index += direction;
    }
    if (direction === 1) {
      index += sidelength * 2 - 3 - x;
    } else {
      index += sidelength * 2 - x;
    }
    direction *= -1;
  }
  if (codeIndex < code.length) {
    outString[length - 1] = code[codeIndex++];
  }

  console.log("input length:" + input.length);
  console.log("code string length:" + code.length);
  console.log("grid length:" + length);
  console.log("side length:" + sidelength);
  console.log("space:" + space);
  console.log("code:" + outString);

  let output="";
  outString.forEach((char)=>{output+=char})
  return output

}

function hexToLine(code){//TODO
  return ""
}
