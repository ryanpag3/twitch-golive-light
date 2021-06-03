FROM node:14

WORKDIR /opt/twitch-golive-light

COPY . .

RUN yarn install

ENTRYPOINT [ "yarn", "watch" ]