// @ts-nocheck
const fs=require('fs');
const PIDFILE='/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/validations/status/expo.pid';
if (!fs.existsSync(PIDFILE)) { console.log('No PID file'); process.exit(0); }
const pid=parseInt(fs.readFileSync(PIDFILE,'utf8').trim(),10);
if (Number.isFinite(pid) && pid>1) {
  try { process.kill(pid,'SIGTERM'); console.log('Stopped Expo',pid); }
  catch(e){ console.log('Stop failed:',e.message); }
}
process.exit(0);


