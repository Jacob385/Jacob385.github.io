//Go to Home page
function goToHome(){window.location.href ="https://jacob385.github.io"}

//Go to GitHub
function goToGithub(){window.location.href ="https://github.com/Jacob385"}

//Go to tools page
function goToTools(){window.location.href ="https://jacob385.github.io/tools"}

//Go to reverse text page
function goToReverse(){window.location.href ="https://jacob385.github.io/Tools/reverse"}

//Go to int-char converter page
function goToIntchar(){window.location.href ="https://jacob385.github.io/Tools/intchar"}

//Go to NewlineReplace page
function goToNewlineReplace(){window.location.href ="https://jacob385.github.io/Tools/newlineReplace"}

//Go to java Packer page
function goToJavaPacker(){window.location.href ="https://jacob385.github.io/Tools/CodeGolf/javaPacker"}

//Go to hexagony Packer page
function goToHexagonyPacker(){window.location.href ="https://jacob385.github.io/Tools/CodeGolf/HexagonyPacker"}


//Test is string is an integer
function isInteger( str ) {return /^-?\d+$/.test( str );}

function copyText(ElementId) {
  // Get the text field
  var copyText = document.getElementById(ElementId);

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);
}