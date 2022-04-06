FROM node:16-slim

WORKDIR /usr/dist/index

COPY package*.json ./

RUN npm install --only=production

COPY . ./

CMD [ "npm", "start" ]