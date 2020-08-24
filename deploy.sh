#!/usr/bin/env bash

REPO=/server
cd ${REPO}

sudo npm install

pm2 delete all

npm run-script dev