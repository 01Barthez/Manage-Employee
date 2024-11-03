FROM node:23-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install && apk add --no-cache bash

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]
