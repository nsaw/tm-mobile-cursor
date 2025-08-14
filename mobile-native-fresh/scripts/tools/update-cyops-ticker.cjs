#!/usr/bin/env node
const fs=require("fs"),p=require("path");
const PR="/Users/sawyer/gitSync/.cursor-cache/CYOPS/patches",META="/Users/sawyer/gitSync/.cursor-cache/CYOPS/meta",T=p.join(META,"tickers");
fs.mkdirSync(T,{recursive:true});
const pc=(fs.existsSync(PR)?fs.readdirSync(PR):[]).filter(f=>/^patch-.*\.json$/.test(f)).length;
const state=pc>0?"executor_wait":"idle";
fs.writeFileSync(p.join(T,"p1.json"),JSON.stringify({ts:new Date().toISOString(),state,plain_count:pc},null,2));
console.log("ticker_updated:", p.join(T,"p1.json"));


