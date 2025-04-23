# docker run -it -p 8081:8081 karaoke-frontend:latest

ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-alpine

WORKDIR /frontend

COPY package.json package-lock.json* ./

RUN npm install
RUN npm install -g expo-cli

COPY . .
EXPOSE 8081

CMD ["npx", "expo", "start"]
