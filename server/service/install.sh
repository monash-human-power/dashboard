#!/bin/bash

SERVICE_DIR=$HOME/.config/systemd/user
DASHBOARD_DIR=$(dirname $(cd $(dirname "${BASH_SOURCE[0]}") && pwd))
SERVICE_FILE=dashboard_server.service

# Create folder for service if it doesn't yet exist
mkdir -p $SERVICE_DIR
# Copy service files to service directory
cp $DASHBOARD_DIR/service/$SERVICE_FILE $SERVICE_DIR

# Append working directory to service file
echo WorkingDirectory=$DASHBOARD_DIR >> $SERVICE_DIR/$SERVICE_FILE