# Systemd files
This folder contains scripts needed to create our own systemd unit service for DASHboard.

This allows us to start DAShboard `server` when our Raspberry Pi boots up and be able to restart the script if the program crashes.

## Usage
Run `install.sh` to add `dashboard_server` to the `~/.config/systemd/user/` folder on the OS system.

Enable the unit by running:
```
    systemctl --user enable dashboard_server.service
```

To manually start/stop the unit, run
```
    systemctl --user <<start or stop>> dashboard_server.service
```

To view the latest logs for the unit use
```
    journalctl _PID=<<pid of the unit>>
```

The PID of the unit can be found using
```
    systemctl --user status dashboard_server.service
```

## Troubleshooting
1)
A known error is when `sudo node -v` outputs an incompatible version (< 14.x.x). Systemd will use this node version when running the service. 
To enforce a specific node version, ensure you have a compatible node installed and use 
    `which node`
to find the path to the compatible node. Insert this path in the "ExecStart" script in `dashboard_server.service` before running `install.sh`.