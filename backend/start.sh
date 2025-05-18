#!/bin/bash
# Clean only if needed
if [ ! -d "node_modules" ]; then
  npm cache clean --force
fi

# Install with forced path-to-regexp version first
npm install path-to-regexp@6.2.1 --no-save
npm install --production --legacy-peer-deps --no-audit

# Start server
node server.js

