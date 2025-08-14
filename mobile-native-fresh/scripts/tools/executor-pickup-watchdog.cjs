#!/usr/bin/env node
const fs = require('fs'); const path = require('path');
const ROOT="/Users/sawyer/gitSync/.cursor-cache/CYOPS/patches";
const META="/Users/sawyer/gitSync/.cursor-cache/CYOPS/meta";
const start = (fs.existsSync(ROOT)?fs.readdirSync(ROOT):[]).filter(f=>/^patch-.*\.json$/.test(f)).length;
const t0=Date.now(), dl=t0+40000;
function count(){ return (fs.existsSync(ROOT)?fs.readdirSync(ROOT):[]).filter(f=>/^patch-.*\.json$/.test(f)).length; }
function done(moved){
  const o={ts:new Date().toISOString(), start_plain:start, end_plain:count(), moved};
  fs.mkdirSync(META,{recursive:true});
  fs.writeFileSync(path.join(META,"pickup_probe.json"), JSON.stringify(o,null,2));
  if(!moved){
    fs.writeFileSync(path.join(META,"P1.HALT.json"), JSON.stringify({ts:o.ts,reason:"executor_pickup_timeout",probe:o},null,2));
    process.exit(3);
  }
  process.exit(0);
}
(function poll(){ const now=count(); if(now<start) return done(true); if(Date.now()>dl) return done(false); setTimeout(poll,1500); })();


