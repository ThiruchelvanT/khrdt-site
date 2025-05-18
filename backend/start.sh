#!/bin/bash
rm -rf node_modules
npm install --production
# Start the server
node server.js
