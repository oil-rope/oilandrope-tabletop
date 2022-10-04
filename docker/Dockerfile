FROM node:18-slim as NODE_BUILD

COPY . /app/

WORKDIR /app/

ENV NODE_ENV=production
ENV WS_URL=wss://live.oilandrope-project.com

RUN npm ci
RUN npm run build

FROM nginx:1.23-alpine

# Add Vim
RUN apk add vim

COPY --from=NODE_BUILD --chown=nginx:www-data /app/dist/ /usr/share/nginx/html/
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf
