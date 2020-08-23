#!/usr/bin/env bash

REPO=/server
cd $REPO

sudo apt-get install npm

npm install

npm install pm2

npm start