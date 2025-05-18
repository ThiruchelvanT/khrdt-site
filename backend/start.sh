#!/bin/bash

if [ ! -d "node_modules" ]; then
  npm cache clean --force
fi

npm install --production --legacy-peer-deps --no-audit

node server.js
