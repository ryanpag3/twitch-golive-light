# Twitch Go Live Light

This application allows you to toggle a Philips Hue lightbulb when going live on Twitch.

## Configuration

| Environment Variable | Default Value | Description | Required |
|----------------------|---------------|-------------|----------|
|`STREAM_LIGHT`| `StreamLight`| The name of the light that you would like to turn on and off. |`false`|
|`TWITCH_CLIENT_ID`|`nil`| The client ID of the Twitch user making requests. (Does not have to be the client ID of `TWITCH_USER`)|`true`|
|`TWITCH_CLIENT_SECRET`|`nil`| The client secret of the Twitch user making requests.|`true`|
|`HUE_USER`|`nil`| The Hue User|`true`|
|`HUE_CLIENT_KEY`|`nil`| The Hue Client Key|`true`|
|`TWITCH_USER`|`ryan_pag3`| The twitch user you would like to check if online. |`false`|
|`SCHEDULE`| `*/10 * * * * *`| How often to check if the user is online in [cron notation](https://crontab.guru/) |`false`|
|`TIMEZONE`| `America/Los_Angeles`| Set the timezone for the schedule to run on. |`false`|

## Getting Started

### Requirements

- Docker ([Installation Instructions](https://docs.docker.com/get-docker/))
- Docker Compose ([Installation Instructions](https://docs.docker.com/compose/install/))
- A valid Twitch account with 2-Factor Authentication enabled

### Steps

#### Philip's Hue Account Credentials

In order to be able to connect and control your Philip's Hue lightbulbs, you must run the container once to generate your credentials.

Here is an example `docker run` command that achieves that.

``` text
docker run -e GENERATE_HUE_CREDENTIALS=true ryanpage/twitch-golive-light:latest
```

The container will then look up your Philip's Hue on the local network, generate credentials, and print them out on the console.

Example:

``` text
User has been created on the Hue Bridge. The following username can be used to authenticate with the Bridge and provide full local access to the Hue Bridge. 

YOU SHOULD TREAT THIS LIKE A PASSWORD
    
Hue Bridge User: xxxx
Hue Bridge User Client Key: xxxx
```

You can press `Ctrl+C` to exit.

#### Deploy The Application

Now that you have generated your credentials, deploying the application is pretty simple. 

1. Create a new directory in your filesystem and place a file named `docker-compose.yml` inside of it.
2. Edit the contents of `docker-compose.yml` and place the following:

``` yaml
version: '3'
services:
    twitch-golive-light:
        image: ryanpage/twitch-golive-light
        environment:
          STREAM_LIGHT: StreamLight
          TWITCH_CLIENT_ID: xxxx
          TWITCH_CLIENT_SECRET: xxxx
          HUE_USER: xxxx
          HUE_CLIENT_KEY: xxxx
          TWITCH_USER: ryan_pag3
          SCHEDULE: "*/10 * * * * *"
          TIMEZONE: America/Los_Angeles
```

3. Edit the values under `environment:` with those from your Philip's Hue account generation as well as from your [Twitch Developer Console](https://dev.twitch.tv/console/apps)

    _hint: to get a new client ID and client secret you must click "Register Your Application" at the top right._

    _hint: You can obtain the name of your lights using the Philip's Hue mobile app._

4. Run `docker-compose up` to run the application in the foreground. If you would like to run it in the background you can run `docker-compose up -d`
