FROM node:alpine
WORKDIR /usr/src/app

COPY package*.json .
RUN npm install --force
RUN npm ci 
COPY . .

CMD ["npm", "start"]