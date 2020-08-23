#!/usr/bin/env bash

REPO=/server
cd ${REPO}

sudo npm install

sudo npm install pm2

APP_NAME=myServer

CURRENT_PID=$(pgrep -f ${APP_NAME})

echo "> pid : ${CURRENT_PID}"

if [ -z ${CURRENT_PID} ]
then
    echo "> Not started."
    sudo npm start
else
    echo "> kill -9 ${CURRENT_PID}"
    sudo kill -15 ${CURRENT_PID}
    sleep 5
    pm2 restart ${APP_NAME}
fi

