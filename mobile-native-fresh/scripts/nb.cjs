#!/usr/bin/env node
const fs=require('fs');const{spawn}=require('child_process');const path=require('path');
function parseArgs(a){const o={cmd:[],ttlMs:3e4,label:'task',log:null,status:null};let i=2;for(;i<a.length;i++){const x=a[i];if(x==='--'){i++;break}
  if(x==='--ttl'){const v=a[++i]||'30s';const m=/^(\d+)(ms|s|m)?$/i.exec(v)||[null,'30','s'];const n=parseInt(m[1],10);const u=(m[2]||'s').toLowerCase();o.ttlMs=u==='ms'?n:(u==='m'?n*60*1e3:n*1e3);continue}
  if(x==='--label'){o.label=a[++i]||o.label;continue}
  if(x==='--log'){o.log=a[++i]||null;continue}
  if(x==='--status'){o.status=a[++i]||null;continue}}
for(;i<a.length;i++)o.cmd.push(a[i]);if(!o.cmd.length)throw new Error('No command after --');return o}
function ensureDir(d){if(!d)return;try{fs.mkdirSync(d,{recursive:true})}catch{}}
(async()=>{let args;try{args=parseArgs(process.argv)}catch(e){console.error('[nb] parse error:',e.message);process.exit(2)}
  const stamp=()=>new Date().toISOString();const statusWrite=(n,c)=>{if(!args.status)return;ensureDir(args.status);const p=path.join(args.status,`${args.label}.${n}`);try{fs.writeFileSync(p,`${c}\n`)}catch{}}
  const logStream=args.log?fs.createWriteStream(args.log,{flags:'a'}):null;const child=spawn(args.cmd[0],args.cmd.slice(1),{stdio:['ignore','pipe','pipe'],shell:false})
  statusWrite('started',stamp());statusWrite('pid',child.pid||'');if(logStream){child.stdout.pipe(logStream);child.stderr.pipe(logStream)}
  let killed=false;const to=setTimeout(()=>{killed=true;try{process.platform==='win32'?child.kill('SIGTERM'):process.kill(-child.pid,'SIGKILL')}catch{try{child.kill('SIGKILL')}catch{}}},args.ttlMs)
  child.on('exit',(code)=>{clearTimeout(to);const exitCode=killed?124:(code??1);statusWrite('exit',exitCode);statusWrite('finished',stamp());if(logStream)logStream.end();process.exit(exitCode)})})();
