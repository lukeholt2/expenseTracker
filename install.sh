#!/bin/bash


if [ -d /opt/plutus_backup ]; then
    rm -rf /opt/plutus_backup
fi
if [ -d /opt/plutus ]; then
    mv /opt/plutus /opt/plutus_backup
fi

mv www /opt/plutus
cd /opt/plutus
