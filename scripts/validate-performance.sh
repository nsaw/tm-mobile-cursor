#!/bin/bash

# Hardened non-blocking pattern for performance validation
{ timeout 60s node scripts/perf/profile-metrics.js & } >/dev/null 2>&1 & disown 