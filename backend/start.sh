#!/bin/bash
# Clear conflicting path-to-regexp versions
rm -rf node_modules/router/node_modules/path-to-regexp

# Install production dependencies
npm install --production --no-audit
# Start the server
node server.js
