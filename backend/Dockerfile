FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 5000

ENTRYPOINT ["npm", "run", "start"]