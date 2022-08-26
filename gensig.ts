import {environment as env} from "./src/environments/environment";
import {environment as prod_env} from "./src/environments/environment.prod";

function buf2hex(buffer: ArrayBuffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}

const genSig = async () => {
 const fs = require('fs');
 const pbkdf2Hmac = require('pbkdf2-hmac')
 const writeFile = fs.writeFile;
// target is url_signature.ts
 const targetPath = './src/environments/url_signature.ts';
// Load node modules
 const colors = require('colors');
 require('dotenv').config({
 path: '.env'
 });

 const baseUrl = env.invite_base_url;
 const prodBaseUrl = prod_env.invite_base_url;
 const secret = process.env['URL_SECRET'] || "secret";
 const urlSignatureProdArr = await pbkdf2Hmac(prodBaseUrl, secret, 100000, 32);
 const urlSignatureArr = await pbkdf2Hmac(baseUrl, secret, 100000, 32);

 const urlSignature = buf2hex(urlSignatureArr);
 const urlSignatureProd = buf2hex(urlSignatureProdArr);


 const sigFile = `export const url_signature_prod='${urlSignatureProd}';
 export const url_signature = '${urlSignature}';
`;
 console.log(colors.magenta('The file `url_signature.ts" is being written: \n'));
 writeFile(targetPath, sigFile, (err:any) => {
 if (err) {
 console.error(err);
 } else {
 console.log(colors.magenta(`URL signature file generated correctly at ${targetPath} \n`));
 }
 });
};

genSig().then();
