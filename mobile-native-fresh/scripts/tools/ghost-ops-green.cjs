#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs'); const path = require('path');
function jlist(){ const r=spawnSync("pm2",["jlist"],{encoding:"utf8"}); try{return JSON.parse(r.stdout)}catch{return[]} }
const req=["g2o-executor","g2o-queue-reader","g2o-reporter","dashboard","webhook-server"];
const procs=jlist();
const core=req.map(n=>({name:n,status:(procs.find(p=>p?.name===n)?.pm2_env?.status)||"missing"}));
const patches=(fs.existsSync("/Users/sawyer/gitSync/.cursor-cache/CYOPS/patches")?fs.readdirSync("/Users/sawyer/gitSync/.cursor-cache/CYOPS/patches"):[]).filter(f=>/^patch-.*\.json$/.test(f));
const logsDir="/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/validations/logs";
const p66Logs= ["p66-plan.log","p66-exec.log","p66-resume.log"].filter(f=>fs.existsSync(path.join(logsDir,f)));
const tickerPath="/Users/sawyer/gitSync/.cursor-cache/CYOPS/meta/tickers/p1.json";
const ticker=fs.existsSync(tickerPath)?JSON.parse(fs.readFileSync(tickerPath,"utf8")):null;
const okCore=core.every(x=>x.status==="online");
const okQueue=patches.length<=1;
const okLogs=p66Logs.length>=1;
const state={ts:new Date().toISOString(),core,plain_count:patches.length,logs:p66Logs,ticker,green:(okCore&&okQueue&&okLogs)};
console.log(JSON.stringify(state,null,2));
process.exit(state.green?0:1);


