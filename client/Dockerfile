FROM node:current-alpine

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

EXPOSE 80

CMD [ "npm", "run", "build" ]
