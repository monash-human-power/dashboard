#!/bin/bash

SERVICE_DIR=$HOME/.config/systemd/user
DASHBOARD_DIR=$(dirname $(cd $(dirname "${BASH_SOURCE[0]}") && pwd))

# Create folder for service if it doesn't yet exist
mkdir -p $SERVICE_DIR
# Copy service files to service directory
cp $DASHBOARD_DIR/service/boost_unit.service $SERVICE_DIR

# Append working directory to service file
echo WorkingDirectory=$DASHBOARD_DIR >> $SERVICE_DIR/dashboard_unit.service