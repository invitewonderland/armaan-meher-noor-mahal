require('esbuild').buildSync({
  entryPoints: ['src/beyond/main.mjs'],
  bundle: true,
  format: 'iife',
  target: ['es2022'],
  minify: true,
  outfile: 'js/beyond.bundle.js',
  legalComments: 'eof'
});
// Give every changed browser asset a new URL, including the unbundled interaction/audio code.
const fs=require('node:fs'),crypto=require('node:crypto');
const html=fs.readFileSync('beyond.html','utf8').replace(/((?:src|href)=")([^"?#]+\.(?:js|css))(?:\?[^"\s]*)?"/g,(match,prefix,file)=>{
  if(!fs.existsSync(file))return match;
  const hash=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0,12);
  return `${prefix}${file}?v=${hash}"`;
});
fs.writeFileSync('index.html',html);
// A small, complete hosting directory. Legacy Infinity media and source stay local.
const path=require('node:path');
const workspace=fs.realpathSync(process.cwd()),output=path.resolve('dist');
if(output!==path.join(workspace,'dist')||fs.existsSync(output)&&fs.lstatSync(output).isSymbolicLink())throw new Error('Refusing to clean an unexpected build directory.');
fs.rmSync(output,{recursive:true,force:true});
fs.mkdirSync('dist/js',{recursive:true});
fs.mkdirSync('dist/assets/audio',{recursive:true});
for(const file of ['index.html','beyond-v4.css','beyond-v5.css','beyond-v6.css','noor-fonts.css','manifest.webmanifest','THREE-LICENSE.txt','.nojekyll']){
  fs.copyFileSync(file,path.join('dist',file));
}
fs.copyFileSync('js/beyond.bundle.js','dist/js/beyond.bundle.js');
fs.cpSync('assets/noor','dist/assets/noor',{recursive:true});
fs.cpSync('assets/beyond','dist/assets/beyond',{recursive:true});
fs.copyFileSync('assets/audio/A_Canopy_of_White_Roses.mp3','dist/assets/audio/A_Canopy_of_White_Roses.mp3');
