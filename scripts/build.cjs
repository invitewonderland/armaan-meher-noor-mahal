require('esbuild').buildSync({
  entryPoints: ['src/noor/experience.mjs'],
  bundle: true,
  format: 'iife',
  target: ['es2022'],
  minify: true,
  outfile: 'js/noor.bundle.js',
  legalComments: 'eof'
});
// Give every changed browser asset a new URL, including the unbundled interaction/audio code.
const fs=require('node:fs'),crypto=require('node:crypto');
const html=fs.readFileSync('index.html','utf8').replace(/((?:src|href)=")([^"?#]+\.(?:js|css))(?:\?[^"\s]*)?"/g,(match,prefix,file)=>{
  if(!fs.existsSync(file))return match;
  const hash=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0,12);
  return `${prefix}${file}?v=${hash}"`;
});
fs.writeFileSync('index.html',html);
// A small, complete hosting directory. Legacy Infinity media and source stay local.
const path=require('node:path');
fs.mkdirSync('dist/js',{recursive:true});
fs.mkdirSync('dist/assets/audio',{recursive:true});
for(const file of ['index.html','noor.css','noor-fonts.css','manifest.webmanifest','THREE-LICENSE.txt','.nojekyll']){
  fs.copyFileSync(file,path.join('dist',file));
}
fs.copyFileSync('js/noor.bundle.js','dist/js/noor.bundle.js');
fs.cpSync('assets/noor','dist/assets/noor',{recursive:true});
fs.copyFileSync('assets/audio/A_Canopy_of_White_Roses.mp3','dist/assets/audio/A_Canopy_of_White_Roses.mp3');
