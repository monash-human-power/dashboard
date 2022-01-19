# Systemd files
This folder contains scripts needed to create our own systemd unit service for DASHboard.

This allows us to start DAShboard `client` when our Raspberry Pi boots up and be able to restart the script if the program crashes.

## Usage
Run `install.sh` to add `dashboard_client` to the `~/.config/systemd/user/` folder on the OS system.

Enable the unit by running:
```
    systemctl --user enable dashboard_client.service
```

To manually start/stop the unit, run
```
    systemctl --user <<start or stop>> dashboard_client.service
```

To view the latest logs for the unit use
```
    journalctl _PID=<<pid of the unit>>
```

The PID of the unit can be found using
```
    systemctl --user status dashboard_client.service
```

## Troubleshooting
1)
A known error is when `serve not found` is thrown in the logs for the service.
In this case find the path to `serve` using `yarn global bin` and add the explicit path to `serve` inside `dashboard_client.service` instead of using `serve` directly.