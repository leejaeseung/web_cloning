#!/usr/bin/env bash

REPO=/server
cd ${REPO}

sudo npm install

sudo npm install pm2

APP_NAME=myServer

CURRENT_PID=$(pgrep -f ${APP_NAME})

if [ -z ${CURRENT_PID} ]
then
    echo "> Not started."
else
    echo "> kill -9 ${CURRENT_PID}"
    kill -15 ${CURRENT_PID}
    sleep 5
fi

sudo npm start