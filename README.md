# Monash Human Power - Data Acquisition System Web Server

![eslint Checker](https://github.com/monash-human-power/dashboard/workflows/eslint%20Checker/badge.svg)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

[![Generic badge](https://img.shields.io/badge/PROJECT_BOARD-green.svg)](https://github.com/monash-human-power/dashboard/projects/1)

A web server for the Data Acquisition System (DAS) for Monash Human Power.

The node.js + Express HTTP REST server is used to host the real-time dashboard whilst the MQTT broker is used to transfer data from the sensors to all the necessary scripts that need it.

## Getting Started

### Environment variable setup

Set up environment variables using a `.env` file. Create a `.env` file in the `server/` directory. Add the following variables:

| Environment Variable | Description                                         |
| -------------------- | --------------------------------------------------- |
| MQTT_USERNAME        | MQTT username                                       |
| MQTT_PASSWORD        | MQTT password                                       |
| MQTT_SERVER          | Address of the MQTT broker                          |
| MQTT_PORT            | Port of the MQTT broker                             |
| HEROKU               | Define this **only** if you are the Heroku instance |

### Installation guide - Frontend

1. Go to `client/`
2. `yarn install` to install all dependencies and libraries
3. `yarn start` to start the development server
4. `yarn build` to create an optimized production bundle

### Installation guide - Backend

1. Go to `server/`
2. `yarn install` to install all dependencies and libraries
3. Build the frontend production bundle
4. `yarn start` to start the server

### SSH connection guide

This is relevant if SSH has not been setup on the computer (Windows)

1. Open Command Prompt to generate a SSH Key.
2. `ssh-keygen -t ed25519 -C "your_email@example.com"` to create a new SSH key, remember to change the `"your_email@example.com"` to the your own email
3. When prompted, press Enter for default settings unless you know what you are doing
4. Open a new Powershell
5. `Get-Content C:\Users\YOUR_USERNAME\.ssh\id_ed25519.pub | clip` to copy the items inside to clipboard, make sure to change `YOUR_USERNAME` to your own username, or where the file was saved if it was not default
6. Go to Github and view your account settings
7. Navigate to the SSH and GPG Keys, under Access
8. Press new SSH key and in the Key section, paste what was copied to clipboard
9. Go back to Powershell and type `ssh -T git@github.com`
10. If prompted by "The authenticity of host 'github.com' can't be established
    Are you sure you want to continue connecting (yes/no/[fingerprint])?", Enter `yes`
11. Test the connection with `ssh -T git@github.com` again, there should be a success message

## Deploying

This project is set up to automatically deploy from GitHub.

| Branch        | Environment | URL                            |
| ------------- | ----------- | ------------------------------ |
| `master`      | Production  | http://mhp-board.herokuapp.com |
| Pull requests | Review app  |                                |

## Documentation

| Endpoint          | Method | Body | Description                                             |
| ----------------- | ------ | ---- | ------------------------------------------------------- |
| /files            | GET    |      | Returns an array of files that are stored on the server |
| /files/recent     | GET    |      | Download most recent file edited from server            |
| /files/_filename_ | GET    |      | Download specified file from server                     |
| /files/_filename_ | DELETE |      | Delete specified file from server                       |
| /server/status    | GET    |      | Status of the server                                    |

## TODO

- [ ] Add Map display
- [ ] Add power model graph/output
- [ ] Options page that saves options to browser storage

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://khlee.me"><img src="https://avatars3.githubusercontent.com/u/18709969?v=4" width="100px;" alt=""/><br /><sub><b>Angus Lee</b></sub></a><br /><a href="https://github.com/monash-human-power/dashboard/commits?author=khanguslee" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/hallgchris"><img src="https://avatars2.githubusercontent.com/u/17876556?v=4" width="100px;" alt=""/><br /><sub><b>Christopher Hall</b></sub></a><br /><a href="https://github.com/monash-human-power/dashboard/commits?author=hallgchris" title="Code">💻</a></td>
    <td align="center"><a href="https://angus.ws"><img src="https://avatars1.githubusercontent.com/u/13267947?v=4" width="100px;" alt=""/><br /><sub><b>Angus Trau</b></sub></a><br /><a href="https://github.com/monash-human-power/dashboard/commits?author=angustrau" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/harsilspatel"><img src="https://avatars1.githubusercontent.com/u/25992839?v=4" width="100px;" alt=""/><br /><sub><b>Harsil Patel</b></sub></a><br /><a href="https://github.com/monash-human-power/dashboard/commits?author=harsilspatel" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/rileyclarke"><img src="https://avatars1.githubusercontent.com/u/24428011?v=4" width="100px;" alt=""/><br /><sub><b>Riley Clarke</b></sub></a><br /><a href="https://github.com/monash-human-power/dashboard/commits?author=rileyclarke" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
