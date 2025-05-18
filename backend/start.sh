#!/bin/bash

# Clean cache only if needed
if [ ! -d "node_modules" ]; then
  npm cache clean --force
fi

# Install dependencies
npm install --production --legacy-peer-deps --no-audit

# Start server
node server.js