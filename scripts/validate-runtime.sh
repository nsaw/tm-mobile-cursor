#!/bin/bash

# Hardened non-blocking pattern for runtime validation
{ timeout 60s node scripts/validate/runtime-check.js & } >/dev/null 2>&1 & disown 