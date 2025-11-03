//import { Hexagony } from "./HexagonyInterperter/hexagony/Hexagony.js";
//let H = require("./HexagonyInterperter/hexagony/Hexagony.js");

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


function toPrintableNumber(num) {
  let end = "";
  while (num > 65535) {
    end = (num % 10) + end;
    num = Math.floor(num / 10);
  }
  console.log(num + " " + end);
  return String.fromCodePoint(num) + end;
}

function pack(codeInput) {
  let input = codeInput.trim();

  // Convert input into a straight line of hexagony code
  let code = "";
  const inputArray = input.split("");
  const KEYCHARS = " \t\n0123456789()+-*:%~,.?;!$_|/\\<>[]#{}\"'=^&`@";
  const KEYCHAR_BYTELOOKUP = [
    "P0",
    "M7",
    "M8",
    "Q6",
    "Q7",
    "Q8",
    "Q9",
    "R0",
    "R1",
    "R2",
    "R3",
    "R4",
    "R5",
    "P8",
    "P9",
    "Q1",
    "Q3",
    "Q0",
    "R6",
    "P5",
    "Y4",
    "Q2",
    "Q4",
    "S1",
    "R7",
    "P1",
    "P4",
    "V3",
    "Y2",
    "Q5",
    "V0",
    "R8",
    "S0",
    "U9",
    "V1",
    "P3",
    "Y1",
    "Y3",
    "P2",
    "P7",
    "R9",
    "V2",
    "P6",
    "V4",
    "S2",
  ];

  /*
  //print KEYCHAR_BYTELOOKUP debug
  console.log(KEYCHAR_BYTELOOKUP.join(";") + ";@");
  for (let ad = 0; ad < KEYCHAR_BYTELOOKUP.length; ad++) {
    console.log("[" + KEYCHARS.split("")[ad] + "] " + KEYCHAR_BYTELOOKUP[ad]);
  }
  */

  for (let x = 0; x < inputArray.length; x++) {
    let count = 1;
    let number = -1;
    let charToPrint;
    console.log(number);

    //Casess:
    // single letter / char (one byte)   y
    // repeat letter / char (one byte)   y

    //single KEYCHAR
    //repeat KEYCHAR

    // single number

    // multi didgit number                    /*could hit a new yey char*/   N
    // repeat number    (multi didgit number)                                N

    //single multi byte            Y
    //repeat multi byte char       N

    if (isInteger(inputArray[x])) {
      number = Number(inputArray[x]);

      console.log(number);
      console.log(inputArray.join(","));

      while (isInteger(inputArray[x + 1])) {
        console.log("//////////////");

        console.log(Number(inputArray[x + 1]));
        console.log(inputArray[x + 1]);

        number = number * 10 + Number(inputArray[x + 1]);
        console.log(number);
        x++;
      }
      console.log("number is");

      console.log(number);
      let charToPrint = toPrintableNumber(number);
      console.log(charToPrint);
      code += charToPrint + "!";
      console.log("^^^^^^^^^^");
    } else {
      while (
        x + count < inputArray.length &&
        inputArray[x] === inputArray[x + count]
      ) {
        count++;
      }
    }
    charToPrint = inputArray[x];
    const tempString = charToPrint;
    const bytes = new TextEncoder().encode(tempString);
    //Buffer.from(tempString, 'utf8');

    if (bytes.length > 1) {
      for(let y = 0; y < count; y++){
        for (const byte of bytes) {
          code += String.fromCharCode(byte + 256) + ";";
        }
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

  console.log("Here's the code line:");
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

function getLinkAnchor(code){
  let input=""
  let inputmode="raw"
    
  let inputString = JSON.stringify({code, input, inputmode})

  //generate link
  return compressToBase64(inputString)
}

function openLink(code){
  let link = "https://hexagony.net/#lz" + getLinkAnchor(code);
  //open link in a new tab
  return window.open(link,'_blank' );
}

function compressToBase64(input){

  if (input == null) {return "";}

  const res = _compress(input, 6, (a) => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a));

  // To produce valid Base64
  switch (res.length % 4) {
    default: // When could this happen ?
    case 0:
        return res;
    case 1:
        return res + "===";
    case 2:
        return res + "==";
    case 3:
        return res + "=";
  }
    
}


function test(){
  console.log("Start Test(s)");

  testInput("EIEIO");
  /*
  testInput("a");
  testInput("ab");
  testInput("abc");
  testInput("abcd");
  testInput("abcde");
  testInput("abcdef");
  testInput("abcdefg");
  testInput("abcdefgh");
  testInput("abcdefghi");
  testInput("abcdefghij");
  testInput("abcdefghijk");
  testInput("abcdefghijkl");
  testInput("abcdefghijklm");
  testInput("abcdefghijklmn");
  testInput("abcdefghijklmno");
  testInput("abcdefghijklmnop");
  testInput("abcdefghijklmnopq");
  testInput("abcdefghijklmnopqr");
  testInput("abcdefghijklmnopqrs");
  testInput("abcdefghijklmnopqrst");
  testInput("abcdefghijklmnopqrstu");
  testInput("abcdefghijklmnopqrstuv");
  testInput("abcdefghijklmnopqrstuvw");
  testInput("abcdefghijklmnopqrstuvwx");
  testInput("abcdefghijklmnopqrstuvwxy");
  testInput("abcdefghijklmnopqrstuvwxyz");
  testInput("z");
  testInput("zy");
  testInput("zyx");
  testInput("zyxw");
  testInput("zyxwv");
  testInput("zyxwvu");
  testInput("zyxwvut");
  testInput("zyxwvuts");
  testInput("zyxwvutsr");
  testInput("zyxwvutsrq");
  testInput("zyxwvutsrqp");
  testInput("zyxwvutsrqpo");
  testInput("zyxwvutsrqpon");
  testInput("zyxwvutsrqponm");
  testInput("zyxwvutsrqponml");
  testInput("zyxwvutsrqponmlk");
  testInput("zyxwvutsrqponmlkj");
  testInput("zyxwvutsrqponmlkji");
  testInput("zyxwvutsrqponmlkjih");
  testInput("zyxwvutsrqponmlkjihg");
  testInput("zyxwvutsrqponmlkjihgf");
  testInput("zyxwvutsrqponmlkjihgfe");
  testInput("zyxwvutsrqponmlkjihgfed");
  testInput("zyxwvutsrqponmlkjihgfedc");
  testInput("zyxwvutsrqponmlkjihgfedcb");
  testInput("zyxwvutsrqponmlkjihgfedcba");

  testInput("q");
  testInput("ze");
  testInput("vng");
  testInput("khdw");
  testInput("ifutx");
  testInput("ejvygp");
  testInput("ykozbme");
  testInput("pdwlemzo");
  testInput("zqrdcfemu");
  testInput("hfetcamydz");
  testInput("npoduktyxsr");
  testInput("ltgnzqpkumjv");
  testInput("afkmhgwpydzxu");
  testInput("ctnlxobqzayhrv");
  testInput("idrzsqujeacpkmh");
  testInput("meizlvktybfrqxuc");
  testInput("ftynxgudswlmaphrz");
  testInput("ftynxgudswlmcaphrz");
  testInput("yvmdftgquwlhcnbzrkx");
  testInput("khcvjfrxblzmqtpuonsw");
  testInput("kghcvjfrxblzmqtpuonsw");
  testInput("wtvkpmblgdxyourfnzcjeh");
  testInput("zexycukoqanhlfwgtdbvrmp");
  testInput("zexycukonqanhlfwgtdbvrmp");
  testInput("dwzctemhsixljfgpuqovynrab");
  testInput("uywbjfekghrplstnizqvmcxado");
  testInput("aonzkjldsfvyiqhtcegrbxwmupu");
  testInput("mzdpzfwcynqhpjtegviaskxobtuz");
  testInput("eclzxfmwbqgpoyanivkstrjhedclb");
  testInput("ajvqnhxclemfkrpdbzgwyiostvmyxz");
  testInput("kpbayuxtzwgljosemncdqkhifvrblaq");
  testInput("vdmhlazpgwsfxrebykoiqtnjcluvbwrn");
  testInput("nzrpqxhtkljfmygobaveudcwsznikqvba");
  testInput("xybgulcwjkohrvzneidfasmqtpkdgyuqox");
  testInput("vjyrznusotlxqehidkmcfwbapgvyrkqlmza");
  testInput("amrwvobtpucxyhfnsqkjdizglemvcanqrkzq");
  testInput("lwfavyrkujezxdgobimqnshphctvykrlxajed");
  testInput("gxqzidncykhtlupwsfgkrvmjaoebxqkwprcyzt");
  testInput("zkwljrfqmsvgaouybihsdcepxhntkvmgycwzpxl");
  testInput("buipmvdoytxlewhfnsgrkjzqxfecambzviekrjlg");*/


  function testInput(input){
    // let win = openLink(pack(input));
    //console.log(GetAPIJson(pack(input)));
    
    console.log("here");

let linkString = window.location.href + "#lz" + getLinkAnchor(pack(input))
window.location.href = linkString; 
    document.getElementById("myButton").click();
    console.log("should be running");

/* let win = window.open();

  win.onload = getCodeOutput;
  function getCodeOutput(){
    console.log("loaded");
    win.document.getElementById("myButton").click();
    console.log("done");

  }

*/
    function codeToSourceCode(string){
      let codeString = pack(input);
      let leng = codeString.length;
      return new SourceCode(leng, codeString, codeString);
    }
   
    //let Hex = new Hexagony(codeToSourceCode(input));




 
    //win.close();
  }
}

function run(){

  //input box
  let theirInputbox = document.getElementById("myInput");
  console.log("their box says: "+theirInputbox.innerHTML);
  theirInputbox.value = "TEST TEST";
  theirInputbox.innerHTML = "TEST2 TEST2";
  theirInputbox.input = "Test3 TEST3";
  //theirInputbox. = "Test4 TEST4";
  theirInputbox.inputString = "Test5 TEST5";

  //theirInputbox.change();
  //theirInputbox.input();

function getNonNullProperties(obj) {
  const nonNullProperties = {};
  for (const key in obj) {
    // Ensure the property is directly on the object and not inherited
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] !== null) {
        nonNullProperties[key] = obj[key];
      }
    }
  }
  return nonNullProperties;
}
console.log(getNonNullProperties(theirInputbox));
//theirInputbox._valueTracker//.setValue("TEST ABC");
//theirInputbox.onchange.call();
//document.createElement("textarea").
//Ao.fromString("TEST4 TEST4");


  console.log("\n\nit now says: "+theirInputbox.innerHTML);

  //speed slider
  let slider = document.getElementById("speedSlider");
  console.log("\n\n  slider value is : "+slider.value +"and its max is: "+ slider.max);
  slider.value = "1000"; //slider.max;
 // slider.change();
  //slider.onSpeedSliderChanged();
  console.log("\n\n  slider value is now: "+slider.value );

  //run
  //   onPlayPause()
  console.log("starting");
  let playbtn = document.getElementById("myButton")
  console.log(getNonNullProperties(playbtn));

  //playbtn.click();

   console.log("started");
 // alert(document.getElementById("outputBox").innerHTML);
  

}

    
function GetAPIJson(url){
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",url,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}