# ./backend/Dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "dev" ]
