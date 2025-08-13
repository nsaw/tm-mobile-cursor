// @ts-nocheck
/**
 * ensure-expo.cjs — non-blocking Expo/Metro starter
 * - If http://127.0.0.1:8081/status responds, exit 0
 * - Else spawn: npx expo start --ios --clear (detached), write PID file, exit 0
 */
const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh';
const LOG_DIR = path.join(ROOT, 'validations', 'logs');
const ST_DIR  = path.join(ROOT, 'validations', 'status');
const PIDFILE = path.join(ST_DIR, 'expo.pid');
const STATUS  = 'http://127.0.0.1:8081/status';
fs.mkdirSync(LOG_DIR,{recursive:true});
fs.mkdirSync(ST_DIR,{recursive:true});

const probe = (ms=2500)=>new Promise(res=>{
  const req=http.get(STATUS,r=>{r.resume();res(r.statusCode&&r.statusCode<500);});
  req.setTimeout(ms,()=>{req.destroy();res(false)});
  req.on('error',()=>res(false));
});

(async()=>{
  if (await probe()) { console.log('Expo healthy'); process.exit(0); }
  try {
    if (fs.existsSync(PIDFILE)) {
      const pid = parseInt(fs.readFileSync(PIDFILE,'utf8').trim(),10);
      if (pid>1) { try { process.kill(pid,0); /* alive */ process.exit(0);} catch(_){} }
    }
  } catch(_) {}
  const logPath = path.join(LOG_DIR, 'expo-launch.log');
  const out = fs.openSync(logPath,'a');
  const err = fs.openSync(logPath,'a');
  const child = spawn('npx',['expo','start','--ios','--clear'],{cwd:ROOT,detached:true,stdio:['ignore',out,err]});
  if (child && child.pid) { fs.writeFileSync(PIDFILE,String(child.pid)); child.unref(); console.log('Expo spawn pid',child.pid); process.exit(0); }
  console.error('Expo spawn failed'); process.exit(1);
})();


