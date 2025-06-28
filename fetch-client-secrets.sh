#!/bin/bash
set -e

# Fetch Google client secrets from 1Password vault 'tm-mobile'
echo "Fetching Google client secrets from 1Password..."

op item get "Google Client Secret 1" --vault "tm-mobile" --fields label=client_secret_482692133923-poms71p5e0qk6lt585kbaes1ak6ntqfl.apps.googleusercontent.com.json > cursor-uploads/client_secret_482692133923-poms71p5e0qk6lt585kbaes1ak6ntqfl.apps.googleusercontent.com.json
op item get "Google Client Secret 2" --vault "tm-mobile" --fields label=client_secret_482692133923-uahvc6eshmr3p03mv8dl9vgk6vrl6b5v.apps.googleusercontent.com.json > cursor-uploads/client_secret_482692133923-uahvc6eshmr3p03mv8dl9vgk6vrl6b5v.apps.googleusercontent.com.json

echo "Secrets restored to cursor-uploads/" 