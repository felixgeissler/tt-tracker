FROM node:20-alpine3.17 as builder
WORKDIR /usr/src/app

COPY . .

RUN corepack enable

RUN yarn workspaces focus frontend

RUN yarn workspace frontend run build

FROM nginx:latest

ADD docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/packages/frontend/dist/frontend/browser /app/frontend/dist/frontend/browser

