#!/bin/bash
rm -rf node_modules
npm install --production --legacy-peer-deps
# Start the server
node server.js
