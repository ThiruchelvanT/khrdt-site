#!/bin/bash
rm -rf node_modules
rm -rf package-lock.json
rm -rf ~/.npm/_logs/


npm cache clean --force
npm install --production --legacy-peer-deps --no-audit
# Explicitly remove any nested path-to-regexp
find node_modules -type d -name "path-to-regexp" -exec rm -rf {} +

# Reinstall the correct version
npm install path-to-regexp@6.2.1 --no-save

# Start server
node server.js
