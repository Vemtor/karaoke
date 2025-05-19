# docker run -it -p 8081:8081 karaoke-frontend:latest

ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-alpine

WORKDIR /frontend

COPY package.json package-lock.json* ./

RUN npm install --legacy-peer-deps 
RUN npm install -g expo-cli ts-node typescript

ENV EXPO_DEVTOOLS_LISTEN_ADDRESS="0.0.0.0"
ENV REACT_NATIVE_PACKAGER_HOSTNAME="0.0.0.0"

COPY . .
EXPOSE 8081

CMD ["npx", "expo", "start"]
