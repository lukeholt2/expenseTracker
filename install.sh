#!/bin/bash

sudo systemctl stop expenseapp.service

if [ -d /opt/plutus_backup ]; then
    rm -rf /opt/plutus_backup
fi
if [ -d /opt/plutus ]; then
    mv /opt/plutus /opt/plutus_backup
fi

mv dist /opt/plutus
cd /opt/plutus
cd 
sudo systemctl restart expenseapp.service
sleep 3 # sleep for 3 seconds to give it time to startup
systemctl status expenseapp.service
