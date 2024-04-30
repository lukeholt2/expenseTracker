FROM node:alpine as build

WORKDIR /app

COPY package*.json /app/

RUN npm install -g @ionic/cli && npm install

COPY ./ /app/
RUN ionic build --prod

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/www/ /usr/share/nginx/html/