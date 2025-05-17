#!/bin/bash
if [ ! -d "node_modules" ]; then
  echo "Installing missing dependencies..."
  npm install --omit=dev
fi

# Start the server
node server.js
