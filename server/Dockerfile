FROM node:current-alpine

WORKDIR /server

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

EXPOSE 8080

CMD [ "node", "build/server.js" ]
