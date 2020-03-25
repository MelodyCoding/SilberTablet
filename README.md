# SilberTablet Webapp
Welcome to the code repository for the SilberTablet Webapp.  
SilberTablet is a custom video conference server which provides an easy to use Webinterface that is especially designed to be used by old people.  
It is build on [NodeJS](https://nodejs.org/en/about/) and the open-source video conference solution [Jitsi Meet](https://github.com/jitsi/jitsi-meet).

## Quick Start
To start the NodeJS server just execute:
```bash
    npm i
    npm run start
```

## Setup
This section shows how to host the SilberTablet Webapp on your server.  
The following instructions were tested on a server running Debian 4.19.

First start with setting up the Jitsi docker containers.  
This part of instructions can also be found in the [Jitsi docker repository](https://github.com/jitsi/docker-jitsi-meet).
```bash
    apt update
    apt install docker docker-compose npm git vim
    git clone https://github.com/jitsi/docker-jitsi-meet && cd docker-jitsi-meet
    cp env.example .env
    mkdir -p ~/.jitsi-meet-cfg/{web/letsencrypt,transcripts,prosody,jicofo,jvb}
```
Now your Jitsi instance is prepared to be started, but we need https before doing it.
```bash
    vim .env
```
Uncomment the three LetsEncrypt options and insert your domain (set $MY_DOMAIN) and your email (set $MY_EMAIL):
```bash
#
# Let's Encrypt configuration
#

# Enable Let's Encrypt certificate generation.
ENABLE_LETSENCRYPT=1

# Domain for which to generate the certificate.
LETSENCRYPT_DOMAIN=$MY_DOMAIN

# E-Mail for receiving important account notifications (mandatory).
LETSENCRYPT_EMAIL=$MY_EMAIL
```
Then, run the docker containers and create the folder for your TLS key and certificate:
```bash
    docker-compose up -d
    mkdir -p ~/.jitsi-meet-cfg/web/letsencrypt/live/$MY_DOMAIN
```
We assume that you already set up LetsEncrypt on your server with your domain.  
If not do so before going on (`apt install certbot && certbot certonly` may help).  

Now copy your pem-files in the created folder. 
```bash
    cp /etc/letsencrypt/live/$YOUR_DOMAIN/*.pem ~/.jitsi-meet-cfg/web/letsencrypt/live/$MY_DOMAIN/
```
Moreover copy your keyfiles to the keys folder:
 ```bash
    cp /etc/letsencrypt/keys/*.pem ~/.jitsi-meet-cfg/web/letsencrypt/keys/
```   
Then restart the web docker container.
```bash
    docker restart docker-jitsi-meet_web_1
```
Now the Jitsi instance should be accessible at `https://$YOUR_DOMAIN:8443` and be secured by a valid LetsEncrypt certificate.  
  
To download the SilberTablet Webapp go on:
```bash
    cd
    git clone https://github.com/MelodyCoding/SilberTablet && cd SilberTablet
```
Copy the example config for deployment to create a config file.
```bash
    cp config/deploy_config_example.json config/config.json
```
Now start the NodeJS server.
```bash
    npm i
    npm run start
```
The SilberTablet Webapp should now be available at `https://$YOUR_DOMAIN/app`.


## TODOs
* find out if we get to run Jitsi on Android and iOS browsers or if we need to use native apps
    * see https://github.com/jitsi/jitsi-meet/issues/1662
    * and https://github.com/jitsi/jitsi-meet/issues/5105
* fix fullscreen mode (toggle or not?)
* /callSomeone: press enter to start a call
* translate warnings into german
* exchange codes by word combinations
    * sanitize word list from offensive and complicated words
* get rid of indicators in participant thumbnails
