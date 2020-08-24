#!/usr/bin/env bash

REPO=/server
cd ${REPO}

sudo npm install

sudo pm2 delete all

npm run-script dev