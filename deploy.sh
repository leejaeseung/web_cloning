#!/usr/bin/env bash

REPO=/server
cd $REPO

sudo yum install npm

npm install

npm install pm2

npm start