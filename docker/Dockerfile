FROM node:18-slim as NODE_BUILD

COPY . /app/

WORKDIR /app/

RUN npm ci
RUN npm run build

FROM nginx:1.23-alpine

COPY --from=NODE_BUILD --chown=nginx:www-data /app/dist/ /usr/share/nginx/html/
