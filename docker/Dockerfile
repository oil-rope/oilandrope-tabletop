FROM node:18-slim as NODE_BUILD

ENV NODE_ENV=production

# If we move the installation to another level we'll get cache
COPY ./package.json /tmp/package.json
COPY ./package-lock.json /tmp/package-lock.json
WORKDIR /tmp/
RUN npm ci

COPY . /app/
RUN cp -a /tmp/node_modules/ /app/node_modules/

WORKDIR /app/

RUN npm run build

FROM nginx:1.23-alpine

# Add Vim
RUN apk add vim

COPY --from=NODE_BUILD --chown=nginx:www-data /app/dist/ /usr/share/nginx/html/
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./docker/nginx/proxy_params /etc/nginx/proxy_params
COPY ./docker/nginx/templates /etc/nginx/templates

WORKDIR /etc/nginx/
