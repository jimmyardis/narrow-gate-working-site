import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const args=process.argv.slice(2),port=Number(args[args.indexOf('--port')+1])||4173,root=process.cwd();
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','.md':'text/plain; charset=utf-8'};
createServer(async(req,res)=>{try{let path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403).end();return}if((await stat(path)).isDirectory())path=resolve(path,'index.html');const buf=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(buf)}catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found')}}).listen(port,'0.0.0.0',()=>console.log('Narrow Gate preview ready on port '+port));
