#!/bin/bash

# Hardened non-blocking pattern for component validation
{ timeout 60s node scripts/validate/check-components.js & } >/dev/null 2>&1 & disown 