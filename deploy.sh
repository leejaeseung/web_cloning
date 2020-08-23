#!/usr/bin/env bash

REPO=/server
cd $REPO

sudo chown -R $(whoami) /server

npm install

npm install pm2

npm start