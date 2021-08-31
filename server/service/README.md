# Systemd files
This folder contains scripts needed to create our own systemd unit service for DASHboard.

This allows us to start DAShboard `client` and `server` when our Raspberry Pi boots up and be able to restart the script if the program crashes.

## Usage
Run `install.sh` to add `dashboard_unit` to the `~/.config/systemd/user/` folder on the OS system.

Enable the unit by running:
```
    systemctl --user enable dashboard_unit.service
```

To manually start/stop the unit, run
```
    systemctl --user <<start or stop>> dashboard_unit.service
```

To view the latest logs for the unit use
```
    journalctl _PID=<<pid of the unit>>
```

The PID of the unit can be found using
```
    systemctl --user status dashboard_unit.service
```