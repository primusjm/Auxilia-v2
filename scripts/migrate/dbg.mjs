import {extractRecord} from './extract-all.mjs';
try{extractRecord(process.argv[2])}catch(e){console.log(e.stack.split('\n').slice(0,5).join('\n'))}
