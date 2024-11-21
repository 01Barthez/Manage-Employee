FROM node:18-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start"]


# Production step with Nginx
FROM nginx:1.27.2-alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .

EXPOSE 80