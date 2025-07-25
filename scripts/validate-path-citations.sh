#!/bin/bash

# Hardened non-blocking pattern for path validation
timeout 60s bash scripts/utils/scan-paths.sh > tmp/validate-paths.log & disown 