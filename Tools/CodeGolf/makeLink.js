

const LZString = require('lz-string')


function getLink(){
let code = "a;b;c;@";
    return LZString.compressToBase64(JSON.stringify({
    code, input: run.args.join('\0') + '\0', inputMode: 'raw' }));
}